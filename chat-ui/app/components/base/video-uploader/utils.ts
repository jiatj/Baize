'use client'

import { upload } from '@/service/base'

type VideoUploadParams = {
  file: File
  onProgressCallback: (progress: number) => void
  onSuccessCallback: (res: { id: string }) => void
  onErrorCallback: () => void
}
type VideoUpload = (v: VideoUploadParams) => void
export const videoUpload: VideoUpload = ({
  file,
  onProgressCallback,
  onSuccessCallback,
  onErrorCallback,
}) => {
  const formData = new FormData()
  formData.append('file', file)
  const onProgress = (e: ProgressEvent) => {
    if (e.lengthComputable) {
      const percent = Math.floor(e.loaded / e.total * 100)
      onProgressCallback(percent)
    }
  }

  upload({
    xhr: new XMLHttpRequest(),
    data: formData,
    onprogress: onProgress,
  })
    .then((res: { id: string }) => {
      onSuccessCallback(res)
    })
    .catch(() => {
      onErrorCallback()
    })
}

/**
 * 获取视频的封面图信息
 * @param url 视频地址
 * @param second 秒数
 */
export async function getVideoBase64(url: string, second: number = 0) {
  const video = document.createElement('video');
  video.setAttribute('crossOrigin', 'anonymous'); // 处理跨域
  video.setAttribute('src', url);
  video.setAttribute('width', '64px');
  video.setAttribute('height', '64px');
  // 静音操作，防止播放失败
  video.setAttribute('muted', 'muted');
  const canvas = document.createElement('canvas');
  const { width, height } = video; // canvas的尺寸和图片一样
  canvas.width = width;
  canvas.height = height;

  if (second) {
    video.currentTime = second;
    // 播放到当前时间的帧，才能截取到当前的画面
    await video.play();
    await video.pause();
    canvas.getContext('2d')?.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg');
  } else {
    canvas.getContext('2d')?.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg');
  }
}
