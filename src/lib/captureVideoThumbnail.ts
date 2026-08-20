export function captureVideoThumbnail(file: File, atSeconds = 2): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)
    let settled = false

    const finish = (result: Blob | null) => {
      if (settled) return
      settled = true
      clearTimeout(timeoutId)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('canplay', onSeeked)
      video.removeEventListener('error', onError)
      URL.revokeObjectURL(objectUrl)
      resolve(result)
    }

    const onError = () => finish(null)

    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx || canvas.width === 0 || canvas.height === 0) {
          finish(null)
          return
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => finish(blob), 'image/jpeg', 0.85)
      } catch {
        finish(null)
      }
    }

    const onLoadedMetadata = () => {
      const duration = video.duration
      const target = Number.isFinite(duration) ? Math.min(atSeconds, Math.max(duration - 0.05, 0)) : atSeconds
      video.currentTime = target
    }

    const timeoutId = setTimeout(() => finish(null), 8000)

    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('canplay', onSeeked)
    video.addEventListener('error', onError)
    video.src = objectUrl
  })
}
