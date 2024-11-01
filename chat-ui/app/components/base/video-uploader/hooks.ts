import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { videoUpload } from './utils'
import Toast from '@/app/components/base/toast'
import type { VideoFile } from '@/types/app'

export const useVideoFiles = () => {
  const { t } = useTranslation()
  const { notify } = Toast
  const [files, setFiles] = useState<VideoFile[]>([])
  const filesRef = useRef<VideoFile[]>([])

  const handleUpload = (videoFile: VideoFile, callBack?: (hasVideo: boolean) => void | undefined) => {
    const files = filesRef.current
    const index = files.findIndex(file => file._id === videoFile._id)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [...files.slice(0, index), { ...currentFile, ...videoFile }, ...files.slice(index + 1)]
      setFiles(newFiles)
      callBack && callBack(newFiles.filter(file => !file.deleted).length > 0)
      filesRef.current = newFiles
    }
    else {
      const newFiles = [...files, videoFile]
      setFiles(newFiles)
      callBack && callBack(newFiles.filter(file => !file.deleted).length > 0)
      filesRef.current = newFiles
    }
  }
  const handleRemove = (videoFileId: string, callBack?: (hasVideo: boolean) => void | undefined) => {
    const files = filesRef.current
    const index = files.findIndex(file => file._id === videoFileId)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [...files.slice(0, index), { ...currentFile, deleted: true }, ...files.slice(index + 1)]
      setFiles(newFiles)
      callBack && callBack(newFiles.filter(file => !file.deleted).length > 0)
      filesRef.current = newFiles
    }
  }
  const handleVideoLinkLoadError = (videoFileId: string) => {
    const files = filesRef.current
    const index = files.findIndex(file => file._id === videoFileId)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [...files.slice(0, index), { ...currentFile, progress: -1 }, ...files.slice(index + 1)]
      filesRef.current = newFiles
      setFiles(newFiles)
    }
  }
  const handleVideoLinkLoadSuccess = (videoFileId: string) => {
    const files = filesRef.current
    const index = files.findIndex(file => file._id === videoFileId)

    if (index > -1) {
      const currentVideoFile = files[index]
      const newFiles = [...files.slice(0, index), { ...currentVideoFile, progress: 100 }, ...files.slice(index + 1)]
      filesRef.current = newFiles
      setFiles(newFiles)
    }
  }
  const handleReUpload = (videoFileId: string) => {
    const files = filesRef.current
    const index = files.findIndex(file => file._id === videoFileId)

    if (index > -1) {
      const currentVideoFile = files[index]
      videoUpload({
        file: currentVideoFile.file!,
        onProgressCallback: (progress) => {
          const newFiles = [...files.slice(0, index), { ...currentVideoFile, progress }, ...files.slice(index + 1)]
          filesRef.current = newFiles
          setFiles(newFiles)
        },
        onSuccessCallback: (res) => {
          const newFiles = [...files.slice(0, index), { ...currentVideoFile, fileId: res.id, progress: 100 }, ...files.slice(index + 1)]
          filesRef.current = newFiles
          setFiles(newFiles)
        },
        onErrorCallback: () => {
          notify({ type: 'error', message: t('common.videoUploader.uploadFromComputerUploadError') })
          const newFiles = [...files.slice(0, index), { ...currentVideoFile, progress: -1 }, ...files.slice(index + 1)]
          filesRef.current = newFiles
          setFiles(newFiles)
        },
      })
    }
  }

  const handleClear = () => {
    setFiles([])
    filesRef.current = []
  }

  const filteredFiles = useMemo(() => {
    return files.filter(file => !file.deleted)
  }, [files])

  return {
    files: filteredFiles,
    onUpload: handleUpload,
    onRemove: handleRemove,
    onVideoLinkLoadError: handleVideoLinkLoadError,
    onVideoLinkLoadSuccess: handleVideoLinkLoadSuccess,
    onReUpload: handleReUpload,
    onClear: handleClear,
  }
}
