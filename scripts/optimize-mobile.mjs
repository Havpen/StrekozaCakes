import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')
const videoPath = join(root, 'public', 'videos', 'how-to-order.mp4')

// clean leftover tmp files
for (const name of readdirSync(imagesDir)) {
  if (name.endsWith('.tmp.webp')) {
    try {
      unlinkSync(join(imagesDir, name))
    } catch {
      /* ignore */
    }
  }
}

const galleryFiles = [
  'img_1253.webp',
  'img_0362.webp',
  'img_1124.webp',
  'order-04-pastry-peach-lemon.webp',
  'img_6881.webp',
  'img_7196.webp',
  'img_1486.webp',
  'order-08-cake-mixed.webp',
  'img_0574.webp',
  'img_1109.webp',
  'img_2443.webp',
  'img_9964.webp',
]

console.log('Compressing gallery images…')
for (const file of galleryFiles) {
  const input = join(imagesDir, file)
  if (!existsSync(input)) {
    console.warn('skip missing', file)
    continue
  }
  const before = statSync(input).size
  const buffer = await sharp(input)
    .rotate()
    .resize({ width: 900, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 68, effort: 6 })
    .toBuffer()
  writeFileSync(input, buffer)
  const after = statSync(input).size
  console.log(
    file,
    `${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`,
  )
}

if (!ffmpegPath) {
  console.error('ffmpeg-static not found')
  process.exit(1)
}

console.log('Compressing order video…')
const beforeVideo = statSync(videoPath).size
const tmpOut = join(root, 'public', 'videos', 'how-to-order.tmp.mp4')
const result = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-i',
    videoPath,
    '-vf',
    'scale=720:-2',
    '-c:v',
    'libx264',
    '-profile:v',
    'baseline',
    '-level',
    '3.1',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-crf',
    '28',
    '-preset',
    'medium',
    '-an',
    tmpOut,
  ],
  { encoding: 'utf8' },
)

if (result.status !== 0) {
  console.error(result.stderr)
  process.exit(result.status ?? 1)
}

copyFileSync(tmpOut, videoPath)
unlinkSync(tmpOut)
const afterVideo = statSync(videoPath).size
console.log(
  'how-to-order.mp4',
  `${(beforeVideo / 1024 / 1024).toFixed(1)}MB -> ${(afterVideo / 1024 / 1024).toFixed(1)}MB`,
)
console.log('done')
