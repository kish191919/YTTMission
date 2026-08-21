function grabFrame(video: HTMLVideoElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx || canvas.width === 0 || canvas.height === 0) {
        resolve(null)
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
    } catch {
      resolve(null)
    }
  })
}

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

    const onSeeked = async () => {
      const blob = await grabFrame(video)
      if (blob) finish(blob)
    }

    const onLoadedMetadata = () => {
      const duration = video.duration
      const target = Number.isFinite(duration) ? Math.min(atSeconds, Math.max(duration - 0.05, 0)) : atSeconds
      try {
        video.currentTime = target
      } catch {
        // ignore — the timeout fallback below will still try to grab whatever frame is available
      }
    }

    // Large videos on slower mobile devices can take a while to decode enough
    // to seek. Rather than giving up with no thumbnail at all, grab whatever
    // frame is currently on screen as a best-effort fallback once time is up.
    const timeoutId = setTimeout(async () => {
      const blob = await grabFrame(video)
      finish(blob)
    }, 15000)

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('canplay', onSeeked)
    video.addEventListener('error', onError)
    video.src = objectUrl
  })
}
