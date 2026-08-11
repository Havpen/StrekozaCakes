<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

apply_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  handle_list();
}

if ($method === 'POST') {
  handle_create();
}

json_error('Метод не поддерживается', 405);

function handle_list(): void
{
  $limit = min(60, max(1, (int)($_GET['limit'] ?? 24)));
  $stmt = db()->prepare(
    'SELECT id, name, text, photo_path, created_at
     FROM reviews
     WHERE status = :status
     ORDER BY created_at DESC
     LIMIT ' . $limit
  );
  $stmt->execute(['status' => 'approved']);
  $rows = $stmt->fetchAll();

  $reviews = array_map(static function (array $row): array {
    return [
      'id' => (int)$row['id'],
      'name' => $row['name'],
      'text' => $row['text'],
      'photoUrl' => public_photo_url($row['photo_path']),
      'createdAt' => $row['created_at'],
    ];
  }, $rows);

  json_ok(['ok' => true, 'reviews' => $reviews]);
}

function handle_create(): void
{
  $config = app_config();
  $name = trim((string)($_POST['name'] ?? ''));
  $text = trim((string)($_POST['text'] ?? ''));

  if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 40) {
    json_error('Укажите имя (одно слово)');
  }
  if ($text === '' || mb_strlen($text) < 20 || mb_strlen($text) > 800) {
    json_error('Напишите отзыв чуть подробнее (от 20 до 800 символов)');
  }

  require_once __DIR__ . '/moderation.php';
  $moderationError = validate_review_text_fields($name, $text);
  if ($moderationError !== null) {
    json_error($moderationError);
  }

  if (!isset($_FILES['photo']) || !is_array($_FILES['photo'])) {
    json_error('Добавьте фото к отзыву');
  }

  $file = $_FILES['photo'];
  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    json_error('Не удалось загрузить фото');
  }

  $maxBytes = (int)($config['max_upload_bytes'] ?? 2 * 1024 * 1024);
  if (($file['size'] ?? 0) <= 0 || $file['size'] > $maxBytes) {
    json_error('Фото слишком большое (макс. 2 МБ)');
  }

  $tmp = (string)$file['tmp_name'];
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime = $finfo->file($tmp) ?: '';
  $allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
  ];
  if (!isset($allowed[$mime])) {
    json_error('Допустимы JPEG, PNG или WebP');
  }

  // Антиспам: не больше N заявок с IP в сутки
  $maxPerDay = (int)($config['max_per_ip_day'] ?? 3);
  $hash = ip_hash();
  $countStmt = db()->prepare(
    'SELECT COUNT(*) FROM reviews
     WHERE ip_hash = :ip AND created_at >= (NOW() - INTERVAL 1 DAY)'
  );
  $countStmt->execute(['ip' => $hash]);
  if ((int)$countStmt->fetchColumn() >= $maxPerDay) {
    json_error('Слишком много отзывов с вашего адреса. Попробуйте завтра.', 429);
  }

  $saved = save_review_photo($tmp, $mime);
  if ($saved === null) {
    json_error('Не удалось обработать изображение', 500);
  }

  $insert = db()->prepare(
    'INSERT INTO reviews (name, text, photo_path, status, ip_hash)
     VALUES (:name, :text, :photo, :status, :ip)'
  );
  $insert->execute([
    'name' => $name,
    'text' => $text,
    'photo' => $saved,
    'status' => 'pending',
    'ip' => $hash,
  ]);

  json_ok([
    'ok' => true,
    'message' => 'Спасибо! Отзыв отправлен на модерацию и появится после проверки.',
  ], 201);
}

function save_review_photo(string $tmpPath, string $mime): ?string
{
  if (!function_exists('imagecreatetruecolor')) {
    // Без GD — сохраняем как есть с безопасным именем
    $ext = $mime === 'image/png' ? 'png' : ($mime === 'image/webp' ? 'webp' : 'jpg');
    $name = bin2hex(random_bytes(16)) . '.' . $ext;
    $dest = uploads_dir() . '/' . $name;
    if (!move_uploaded_file($tmpPath, $dest)) {
      return null;
    }
    @chmod($dest, 0644);
    return $name;
  }

  $src = false;
  if ($mime === 'image/jpeg') {
    $src = @imagecreatefromjpeg($tmpPath);
  } elseif ($mime === 'image/png') {
    $src = @imagecreatefrompng($tmpPath);
  } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
    $src = @imagecreatefromwebp($tmpPath);
  }
  if ($src === false) {
    return null;
  }

  $w = imagesx($src);
  $h = imagesy($src);
  if ($w < 1 || $h < 1) {
    imagedestroy($src);
    return null;
  }

  $maxSide = 1280;
  $scale = min(1, $maxSide / max($w, $h));
  $nw = max(1, (int)round($w * $scale));
  $nh = max(1, (int)round($h * $scale));

  $dst = imagecreatetruecolor($nw, $nh);
  imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
  imagedestroy($src);

  $name = bin2hex(random_bytes(16)) . '.jpg';
  $dest = uploads_dir() . '/' . $name;
  $ok = imagejpeg($dst, $dest, 82);
  imagedestroy($dst);
  if (!$ok) {
    return null;
  }
  @chmod($dest, 0644);
  return $name;
}
