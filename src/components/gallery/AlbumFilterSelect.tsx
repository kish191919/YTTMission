'use client'

import { useRouter } from 'next/navigation'

export default function AlbumFilterSelect({
  albums,
  currentAlbum,
}: {
  albums: { name: string }[]
  currentAlbum?: string
}) {
  const router = useRouter()

  return (
    <div className="mb-8">
      <select
        value={currentAlbum ?? ''}
        onChange={(e) => {
          const value = e.target.value
          router.push(value ? `/gallery?album=${encodeURIComponent(value)}` : '/gallery')
        }}
        className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      >
        <option value="">전체 앨범 보기</option>
        {albums.map((a) => (
          <option key={a.name} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  )
}
