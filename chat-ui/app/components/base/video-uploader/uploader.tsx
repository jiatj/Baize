'use client'

import type { ChangeEvent, FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { videoUpload, getVideoBase64 } from './utils'
import type { VideoFile } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'

type UploaderProps = {
  children: (hovering: boolean) => JSX.Element
  onUpload: (VideoFile: VideoFile) => void
  limit?: number
  disabled?: boolean
}

const Uploader: FC<UploaderProps> = ({
  children,
  onUpload,
  limit,
  disabled,
}) => {
  const [hovering, setHovering] = useState(false)
  const { notify } = Toast
  const { t } = useTranslation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file)
      return

    if (limit && file.size > limit * 1024 * 1024) {
      notify({ type: 'error', message: t('common.videoUploader.uploadFromComputerLimit', { size: limit }) })
      return
    }

    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        getVideoBase64(reader.result as string, 1).then(Thumbnail64Url => {
          const videoFile = {
            type: TransferMethod.local_file,
            _id: `${Date.now()}`,
            fileId: '',
            file,
            url: reader.result as string,
            base64Url: reader.result as string,
            progress: 0,
            fType: file.type,
            Thumbnail64Url: Thumbnail64Url
          }
          onUpload(videoFile)
          videoUpload({
            file: videoFile.file,
            onProgressCallback: (progress) => {
              onUpload({ ...videoFile, progress })
            },
            onSuccessCallback: (res) => {
              onUpload({ ...videoFile, fileId: res.id, progress: 100 })
            },
            onErrorCallback: () => {
              notify({ type: 'error', message: t('common.videoUploader.uploadFromComputerUploadError') })
              onUpload({ ...videoFile, progress: -1 })
            },
          })
        })
      },
      false,
    )
    reader.addEventListener(
      'error',
      () => {
        notify({ type: 'error', message: t('common.videoUploader.uploadFromComputerReadError') })
      },
      false,
    )
    reader.readAsDataURL(file)
  }

  return (
    <div
      className='relative'
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children(hovering)}
      <input
        className={`
          absolute block inset-0 opacity-0 text-[0] w-full
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={e => (e.target as HTMLInputElement).value = ''}
        type='file'
        accept='.MP4, .WebM, .Ogg'
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}

export default Uploader
