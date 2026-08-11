<?php
declare(strict_types=1);

function review_contains_link(string $value): bool
{
  return (bool)preg_match(
    '/(?:https?:\/\/|www\.|t\.me\/|vk\.com\/|instagram\.com\/|wa\.me\/|bit\.ly\/)|(?:[a-z0-9-]+\.)+(?:com|ru|by|net|org|info|me|cc|xyz|online|site|shop)\b/iu',
    $value
  );
}

function review_lookalike_single(): array
{
  return [
    '0' => 'о', '5' => 'с', '6' => 'б', '9' => 'д',
    'a' => 'а', 'b' => 'б', 'c' => 'с', 'e' => 'е', 'g' => 'г',
    'h' => 'н', 'i' => 'и', 'k' => 'к', 'l' => 'л', 'm' => 'м',
    'n' => 'п', 'o' => 'о', 'p' => 'р', 's' => 'с', 't' => 'т',
    'u' => 'у', 'v' => 'в', 'w' => 'ш', 'x' => 'х', 'y' => 'у', 'z' => 'з',
    '@' => 'а', '$' => 'с', '*' => '',
    'і' => 'и', 'ї' => 'и', 'є' => 'е', 'ґ' => 'г',
    'α' => 'а', 'β' => 'б', 'ε' => 'е', 'ι' => 'и', 'κ' => 'к',
    'ο' => 'о', 'ρ' => 'р', 'τ' => 'т', 'υ' => 'у', 'χ' => 'х',
  ];
}

function review_lookalike_ambiguous(): array
{
  return [
    '1' => ['и', 'л'],
    '3' => ['е', 'з'],
    '4' => ['ч', 'а'],
    '7' => ['т', 'л'],
    '8' => ['в', 'б'],
    'r' => ['г', 'р'],
    '!' => ['и'],
    '|' => ['и', 'л'],
  ];
}

function review_collapse_repeats(string $value): string
{
  return preg_replace('/(.)\1{2,}/u', '$1$1', $value) ?? $value;
}

/** @return list<string> */
function review_normalize_variants(string $value): array
{
  $value = mb_strtolower($value, 'UTF-8');
  $value = str_replace('ё', 'е', $value);
  $single = review_lookalike_single();
  $ambiguous = review_lookalike_ambiguous();
  $chars = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY) ?: [];
  $variants = [''];
  $max = 64;

  foreach ($chars as $ch) {
    $options = null;
    if (isset($ambiguous[$ch])) {
      $options = $ambiguous[$ch];
    } elseif (array_key_exists($ch, $single)) {
      $mapped = $single[$ch];
      $options = $mapped === '' ? [''] : [$mapped];
    } elseif (preg_match('/^[a-zа-я]$/u', $ch)) {
      $options = [$ch];
    } else {
      continue;
    }

    $next = [];
    foreach ($variants as $prefix) {
      foreach ($options as $opt) {
        $next[] = $prefix . $opt;
        if (count($next) >= $max) {
          break 2;
        }
      }
    }
    if ($next !== []) {
      $variants = $next;
    }
    if (count($variants) >= $max) {
      break;
    }
  }

  $unique = [];
  foreach ($variants as $variant) {
    $collapsed = review_collapse_repeats($variant);
    if ($collapsed !== '') {
      $unique[$collapsed] = true;
    }
  }
  return array_keys($unique);
}

function review_contains_profanity(string $value): bool
{
  $variants = review_normalize_variants($value);
  if ($variants === []) {
    return false;
  }
  $stems = [
    'бля', 'бляд', 'блят', 'еба', 'ебан', 'ебат', 'ебл', 'ебу', 'еби', 'еблан',
    'пизд', 'пезд', 'хуй', 'хуе', 'хуя', 'муда', 'мудил',
    'сука', 'сучк', 'гандон', 'гондон', 'залуп', 'дроч',
    'говн', 'дерьм', 'пидор', 'пидар', 'педик', 'чмо',
    'долбо', 'уеб', 'выеб', 'охуе', 'нахуй', 'похуй',
    'спизд', 'хуйло', 'шалав', 'шлюх',
    'епта', 'епть', 'йопта', 'ебта',
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'cunt',
  ];
  foreach ($variants as $variant) {
    foreach ($stems as $stem) {
      if (mb_strpos($variant, $stem) !== false) {
        return true;
      }
    }
  }
  return false;
}

function validate_review_text_fields(string $name, string $text): ?string
{
  $name = trim($name);
  if (preg_match('/\s/u', $name)) {
    return 'В имени можно только одно слово — без пробелов';
  }
  if (!preg_match('/^[a-zA-Zа-яА-ЯёЁ-]+$/u', $name)) {
    return 'В имени используйте только буквы';
  }
  if (review_contains_link($name) || review_contains_link($text)) {
    return 'В имени и отзыве нельзя указывать ссылки';
  }
  if (review_contains_profanity($name) || review_contains_profanity($text)) {
    return 'Пожалуйста, без грубых слов — напишите отзыв иначе';
  }
  return null;
}
