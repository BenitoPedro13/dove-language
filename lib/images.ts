import type { LessonImage } from "./lesson/schema"

/** DS §7: at most 1600px on the long edge, WebP. Keeps .dove.json files small enough for Discord. */
const MAX_EDGE = 1600
const QUALITY = 0.82

/** Browser-only. Call from an event handler with a file the teacher picked. */
export async function prepareImage(file: File): Promise<Omit<LessonImage, "alt">> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a picture file (JPG, PNG, WebP or GIF).")

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("This browser cannot prepare pictures.")
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return { src: canvas.toDataURL("image/webp", QUALITY), width, height }
}
