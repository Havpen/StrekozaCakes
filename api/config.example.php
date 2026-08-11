<?php
/**
 * Скопируйте в config.php и заполните данные БД из панели хостинга.
 * config.php в git не коммитится.
 */
return [
  'db' => [
    'host' => 'localhost',
    'name' => 'strekoza_db',
    'user' => 'strekoza_user',
    'pass' => 'CHANGE_ME',
    'charset' => 'utf8mb4',
  ],
  // Пароль модерации: /api/admin.php
  'admin_password' => 'CHANGE_ADMIN_PASSWORD',
  // Публичный origin сайта (для CORS). Пустая строка = тот же хост.
  'allowed_origin' => '',
  // Макс. размер загружаемого файла (байты) после клиентского сжатия
  'max_upload_bytes' => 2 * 1024 * 1024,
  // Лимит заявок с одного IP в сутки
  'max_per_ip_day' => 3,
];
