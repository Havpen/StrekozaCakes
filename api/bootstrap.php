<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

function app_config(): array
{
  static $config = null;
  if ($config !== null) {
    return $config;
  }
  $path = __DIR__ . '/config.php';
  if (!is_file($path)) {
    json_error('API не настроено: создайте api/config.php из config.example.php', 503);
  }
  /** @var array $config */
  $config = require $path;
  return $config;
}

function db(): PDO
{
  static $pdo = null;
  if ($pdo instanceof PDO) {
    return $pdo;
  }
  $c = app_config()['db'];
  $dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=%s',
    $c['host'],
    $c['name'],
    $c['charset'] ?? 'utf8mb4'
  );
  $pdo = new PDO($dsn, $c['user'], $c['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  return $pdo;
}

function json_ok(array $data, int $code = 200): void
{
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function json_error(string $message, int $code = 400): void
{
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
  exit;
}

function apply_cors(): void
{
  $originHeader = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed = (string)(app_config()['allowed_origin'] ?? '');
  if ($allowed !== '' && $originHeader === $allowed) {
    header('Access-Control-Allow-Origin: ' . $allowed);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Password');
  }
  if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

function client_ip(): string
{
  return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function ip_hash(): string
{
  return hash('sha256', client_ip() . '|strekoza-reviews');
}

function uploads_dir(): string
{
  $dir = __DIR__ . '/uploads/reviews';
  if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
  }
  return $dir;
}

function public_photo_url(string $relative): string
{
  $relative = ltrim(str_replace('\\', '/', $relative), '/');
  return '/api/uploads/reviews/' . $relative;
}
