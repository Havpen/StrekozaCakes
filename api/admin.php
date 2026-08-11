<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

apply_cors();

$config = app_config();
$password = (string)($config['admin_password'] ?? '');
$provided = (string)($_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? ($_POST['password'] ?? ($_GET['password'] ?? '')));

if ($password === '' || $password === 'CHANGE_ADMIN_PASSWORD' || !hash_equals($password, $provided)) {
  if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' && !isset($_GET['password']) && !isset($_SERVER['HTTP_X_ADMIN_PASSWORD'])) {
    render_login_form();
  }
  json_error('Нет доступа', 401);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  $stmt = db()->query(
    "SELECT id, name, text, photo_path, status, created_at
     FROM reviews
     ORDER BY FIELD(status, 'pending', 'approved', 'rejected'), created_at DESC
     LIMIT 100"
  );
  $rows = $stmt->fetchAll();
  if (isset($_GET['format']) && $_GET['format'] === 'json') {
    json_ok(['ok' => true, 'reviews' => $rows]);
  }
  render_admin($rows, $provided);
}

if ($method === 'POST') {
  $id = (int)($_POST['id'] ?? 0);
  $action = (string)($_POST['action'] ?? '');
  if ($id < 1 || !in_array($action, ['approve', 'reject'], true)) {
    json_error('Некорректный запрос');
  }
  $status = $action === 'approve' ? 'approved' : 'rejected';
  $stmt = db()->prepare(
    'UPDATE reviews SET status = :status, moderated_at = NOW() WHERE id = :id'
  );
  $stmt->execute(['status' => $status, 'id' => $id]);

  if (isset($_POST['redirect']) && $_POST['redirect'] === '1') {
    header('Location: admin.php?password=' . rawurlencode($provided));
    exit;
  }
  json_ok(['ok' => true, 'status' => $status]);
}

json_error('Метод не поддерживается', 405);

function h(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function render_login_form(): void
{
  header('Content-Type: text/html; charset=utf-8');
  echo '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Модерация отзывов</title>
  <style>body{font-family:system-ui,sans-serif;background:#f7f5f1;padding:2rem}form{max-width:20rem;margin:auto;display:grid;gap:.75rem}input,button{padding:.7rem .9rem;font:inherit}button{background:#9e0000;color:#fff;border:0;cursor:pointer}</style>
  </head><body><form method="get"><h1>Модерация</h1><input type="password" name="password" placeholder="Пароль" required><button type="submit">Войти</button></form></body></html>';
  exit;
}

function render_admin(array $rows, string $password): void
{
  header('Content-Type: text/html; charset=utf-8');
  echo '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Модерация отзывов</title>
  <style>
  body{font-family:system-ui,sans-serif;background:#f7f5f1;color:#141414;margin:0;padding:1.25rem}
  h1{font-size:1.4rem} .list{display:grid;gap:1rem;max-width:52rem;margin:1rem auto}
  .card{background:#fff;border:1px solid rgba(20,20,20,.12);padding:1rem;display:grid;gap:.6rem;grid-template-columns:7rem 1fr}
  img{width:7rem;height:7rem;object-fit:cover;border-radius:4px;background:#eee}
  .meta{font-size:.85rem;color:#5c5c5c} .actions{display:flex;gap:.5rem;flex-wrap:wrap}
  button{padding:.45rem .8rem;border:0;cursor:pointer;font:inherit} .ok{background:#1f7a3f;color:#fff} .no{background:#9e0000;color:#fff}
  .pending{outline:2px solid #8eb1ff}
  </style></head><body><h1>Отзывы — модерация</h1><div class="list">';

  foreach ($rows as $row) {
    $cls = $row['status'] === 'pending' ? 'card pending' : 'card';
    $photo = h(public_photo_url($row['photo_path']));
    echo '<article class="' . $cls . '">';
    echo '<img src="' . $photo . '" alt="">';
    echo '<div>';
    echo '<strong>' . h($row['name']) . '</strong> · <span class="meta">' . h($row['status']) . ' · ' . h($row['created_at']) . '</span>';
    echo '<p>' . h($row['text']) . '</p>';
    if ($row['status'] === 'pending') {
      echo '<div class="actions">';
      echo '<form method="post"><input type="hidden" name="password" value="' . h($password) . '"><input type="hidden" name="redirect" value="1"><input type="hidden" name="id" value="' . (int)$row['id'] . '"><input type="hidden" name="action" value="approve"><button class="ok" type="submit">Одобрить</button></form>';
      echo '<form method="post"><input type="hidden" name="password" value="' . h($password) . '"><input type="hidden" name="redirect" value="1"><input type="hidden" name="id" value="' . (int)$row['id'] . '"><input type="hidden" name="action" value="reject"><button class="no" type="submit">Отклонить</button></form>';
      echo '</div>';
    }
    echo '</div></article>';
  }

  echo '</div></body></html>';
  exit;
}
