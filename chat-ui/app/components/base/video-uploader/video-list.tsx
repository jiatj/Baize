import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loading02 from '@/app/components/base/icons/line/loading-02'
import XClose from '@/app/components/base/icons/line/x-close'
import RefreshCcw01 from '@/app/components/base/icons/line/refresh-ccw-01'
import AlertTriangle from '@/app/components/base/icons/solid/alert-triangle'
import TooltipPlus from '@/app/components/base/tooltip-plus'
import type { VideoFile } from '@/types/app'
import { TransferMethod } from '@/types/app'
import VideoPreview from '@/app/components/base/video-uploader/video-preview'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'

type VideoListProps = {
  list: VideoFile[]
  readonly?: boolean
  onRemove?: (videoFileId: string) => void
  onReUpload?: (videoFileId: string) => void
  onVideoLinkLoadSuccess?: (videoFileId: string) => void
  onVideoLinkLoadError?: (videoFileId: string) => void
}

const VideoList: FC<VideoListProps> = ({
  list,
  readonly,
  onRemove,
  onReUpload,
  onVideoLinkLoadSuccess,
  onVideoLinkLoadError,
}) => {
  const { t } = useTranslation()
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('')

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  const handleVideoLinkLoadSuccess = (item: VideoFile) => {
    if (item.type === TransferMethod.remote_url && onVideoLinkLoadSuccess && item.progress !== -1)
      onVideoLinkLoadSuccess(item._id)
  }
  const handleVideoLinkLoadError = (item: VideoFile) => {
    if (item.type === TransferMethod.remote_url && onVideoLinkLoadError)
      onVideoLinkLoadError(item._id)
  }
  return (
    <div className='flex flex-wrap'>
      {
        list.map(item => (
          <div
            key={item._id}
            className='group relative mr-1 border-[0.5px] border-black/5 rounded-lg'
          >
            {
              item.type === TransferMethod.local_file && item.progress !== 100 && (
                <>
                  <div
                    className='absolute inset-0 flex items-center justify-center z-[1] bg-black/30'
                    style={{ left: item.progress > -1 ? `${item.progress}%` : 0 }}
                  >
                    {
                      item.progress === -1 && (
                        <RefreshCcw01 className='w-5 h-5 text-white' onClick={() => onReUpload && onReUpload(item._id)} />
                      )
                    }
                  </div>
                  {
                    item.progress > -1 && (
                      <span className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-white mix-blend-lighten z-[1]'>{item.progress}%</span>
                    )
                  }
                </>
              )
            }
            {
              item.type === TransferMethod.remote_url && item.progress !== 100 && (
                <div className={`
                  absolute inset-0 flex items-center justify-center rounded-lg z-[1] border
                  ${item.progress === -1 ? 'bg-[#FEF0C7] border-[#DC6803]' : 'bg-black/[0.16] border-transparent'}
                `}>
                  {
                    item.progress > -1 && (
                      <Loading02 className='animate-spin w-5 h-5 text-white' />
                    )
                  }
                  {
                    item.progress === -1 && (
                      <TooltipPlus popupContent={t('common.imageUploader.pasteImageLinkInvalid')}>
                        <AlertTriangle className='w-4 h-4 text-[#DC6803]' />
                      </TooltipPlus>
                    )
                  }
                </div>
              )
            }
            <img
              className='w-16 h-16 rounded-lg object-cover cursor-pointer border-[0.5px] border-black/5'
              alt=''
              onLoad={() => handleVideoLinkLoadSuccess(item)}
              onError={() => handleVideoLinkLoadError(item)}
              src={item.type === TransferMethod.remote_url ? item.Thumbnail64Url : item.Thumbnail64Url}
              onClick={() => item.progress === 100 && setVideoPreviewUrl((item.type === TransferMethod.remote_url ? item.url : item.base64Url) as string)}
            />
            {/* <video id="video" controls={false} className='w-16 h-16' onClick={() => item.progress === 100 && setVideoPreviewUrl((item.type === TransferMethod.remote_url ? item.url : item.base64Url) as string)}>
              <source src={item.type === TransferMethod.remote_url ? item.url : item.base64Url} />
            </video> */}

            {
              !readonly && (
                <div>
                  {
                    isMobile ? (
                      <div
                        className={`
                        absolute z-10 -top-[9px] -right-[9px] items-center justify-center w-[18px] h-[18px] 
                       bg-gray-50 border-[0.5px] border-black/[0.02] rounded-2xl shadow-lg
                        cursor-pointer flex
                        }
                      `}
                        onClick={() => onRemove && onRemove(item._id)}
                      >
                        <XClose className='w-3 h-3 text-gray-500' />
                      </div>
                    ) : (
                      <div
                        className={`
                          absolute z-10 -top-[9px] -right-[9px] items-center justify-center w-[18px] h-[18px] 
                          bg-white hover:bg-gray-50 border-[0.5px] border-black/[0.02] rounded-2xl shadow-lg
                          cursor-pointer
                          ${item.progress === -1 ? 'flex' : 'hidden group-hover:flex'}
                        `}
                        onClick={() => onRemove && onRemove(item._id)}
                      >
                        <XClose className='w-3 h-3 text-gray-500' />
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        ))
      }
      {
        videoPreviewUrl && (
          <VideoPreview
            url={videoPreviewUrl}
            onCancel={() => setVideoPreviewUrl('')}
          />
        )
      }
    </div>
  )
}

export default VideoList
