import type { FC } from 'react'
import { createPortal } from 'react-dom'
import XClose from '@/app/components/base/icons/line/x-close'

type VideoPreviewProps = {
  url: string
  onCancel: () => void
}
const ImagePreview: FC<VideoPreviewProps> = ({
  url,
  onCancel,
}) => {
  return createPortal(
    <div className='fixed inset-0 p-8 flex items-center justify-center bg-black/80 z-[1000]' onClick={e => e.stopPropagation()}>
      <video id="video" controls="controls" className='max-w-full max-h-full'>
        <source src={url} />
      </video>
      {/* <img
        alt='preview image'
        src={url}
        className='max-w-full max-h-full'
      /> */}
      <div
        className='absolute top-6 right-6 flex items-center justify-center w-8 h-8 bg-white/[0.08] rounded-lg backdrop-blur-[2px] cursor-pointer'
        onClick={onCancel}
      >
        <XClose className='w-4 h-4 text-white' />
      </div>
    </div>,
    document.body,
  )
}

export default ImagePreview
