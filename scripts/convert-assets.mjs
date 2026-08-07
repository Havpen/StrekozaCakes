import convert from 'heic-convert'
import sharp from 'sharp'
import { readFile, mkdir, copyFile } from 'node:fs/promises'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = join(root, 'assets')
const outDir = join(root, 'public', 'images')

// Selected product shots for hero + gallery (diverse set from provided assets)
const selected = [
  'IMG_0365.HEIC',
  'IMG_0574.HEIC',
  'IMG_0935.HEIC',
  'IMG_1109.HEIC',
  'IMG_1123.HEIC',
  'IMG_1253.HEIC',
  'IMG_1341.HEIC',
  'IMG_1701.HEIC',
  'IMG_2443.HEIC',
  'IMG_2711.HEIC',
  'IMG_6733.HEIC',
  'IMG_7196.HEIC',
  'IMG_8077.HEIC',
  'IMG_8468.HEIC',
  'IMG_9097.HEIC',
  'IMG_9964.HEIC',
]

await mkdir(outDir, { recursive: true })

for (const file of selected) {
  const input = join(assetsDir, file)
  const id = basename(file, '.HEIC').toLowerCase()
  const jpegBuffer = await convert({
    buffer: await readFile(input),
    format: 'JPEG',
    quality: 0.92,
  })

  await sharp(Buffer.from(jpegBuffer))
    .rotate()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(outDir, `${id}.webp`))

  console.log('converted', file, '->', `${id}.webp`)
}

// Logos
await copyFile(join(assetsDir, 'IMG_2868.PNG'), join(outDir, 'logo-color.png'))
await copyFile(join(assetsDir, 'IMG_2869.PNG'), join(outDir, 'logo-mark.png'))

// Favicon-friendly mark from logo
await sharp(join(assetsDir, 'IMG_2869.PNG'))
  .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(root, 'public', 'favicon-mark.png'))

console.log('done')
