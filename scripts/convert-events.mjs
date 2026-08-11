import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const assets =
  'C:/Users/Jeck/.cursor/projects/h-SkardSoft-Strekoza/assets'
const outDir = 'H:/SkardSoft/Strekoza/public/images/events'
await mkdir(outDir, { recursive: true })

const map = [
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-41dbaff4-310c-4cb4-a3cf-84dabb849c0b.png',
    'mothers-day-tea.webp',
  ],
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-1ff249f4-c4b1-4360-aeea-af4c6f3d9368.png',
    'march8-bento.webp',
  ],
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-28f229a2-1584-4a68-b418-20d426d2f603.png',
    'easter-kulich.webp',
  ],
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-799af2f0-6d8c-42d1-915d-58005c1304dc.png',
    'knowledge-day-cake.webp',
  ],
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-3c868294-2d36-4b45-aa73-12cbc9103b06.png',
    'cake-pops.webp',
  ],
  [
    'c__Users_Jeck_AppData_Roaming_Cursor_User_workspaceStorage_a04dab5c39aed95f8d8108133b4f04ac_images_image-bf9d0618-7bca-4b5e-8417-ac08a234e509.png',
    'easter-bunnies.webp',
  ],
]

for (const [srcName, outName] of map) {
  const src = join(assets, srcName)
  const dest = join(outDir, outName)
  await sharp(src)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest)
  console.log(outName)
}
