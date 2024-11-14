'use client'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContext } from 'use-context-selector'

import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Recorder from 'js-audio-recorder'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, SpeechToTextSettings, TextToSpeechSettings, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'

import ChatVideoUploader from '@/app/components/base/video-uploader/chat-video-uploader'
import VideoList from '@/app/components/base/video-uploader/video-list'
import { useVideoFiles } from '@/app/components/base/video-uploader/hooks'
import XCircle from '@/app/components/base/icons/solid/general/XCircle'
import Send03 from '@/app/components/base/icons/solid/communication/Send03'
import Microphone01 from '@/app/components/base/icons/line/Microphone01'
import Microphone01Solid from '@/app/components/base/icons/solid/Microphone01'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import VoiceInput from '@/app/components/base/voice-input'
import PromptEditor from '../prompt-editor'
import Button from '../base/button'
import StopCircle from '../base/icons/solid/StopCircle'

const theme = {
  // Theme styling goes here
  //...
}

function onError(error: Error) {
  console.error(error);
}


export type IChatProps = {
  currConversationId?: string
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponsing?: boolean
  noStopResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  speechToTextConfig?: SpeechToTextSettings
  textToSpeechConfig?: TextToSpeechSettings
  setHasImage?: (hasImage: boolean) => void
  setHasVideo?: (hasVideo: boolean) => void
  onStopResponding?: () => void
}

const Chat: FC<IChatProps> = ({
  currConversationId,
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponsing,
  noStopResponding,
  controlClearQuery,
  visionConfig,
  speechToTextConfig,
  textToSpeechConfig,
  setHasImage,
  setHasVideo,
  onStopResponding
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e
    setQuery(value)
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()
  const {
    files: videoFile,
    onUpload: onVideoUpload,
    onRemove: onVideoRemove,
    onReUpload: onVideoReUpload,
    onVideoLinkLoadError,
    onVideoLinkLoadSuccess,
    onClear: onVideoClear,
  } = useVideoFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(query, [...files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      Thumbnail64Url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })), ...videoFile.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'video',
      transfer_method: fileItem.type,
      Thumbnail64Url: fileItem.type === TransferMethod.local_file ? fileItem.Thumbnail64Url : 'data:image/png;base64,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',
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))])
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) {
        onClear()
      }
      if (!isResponsing)
        setQuery('')
    }
    if (!videoFile.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (videoFile.length) {
        onVideoClear()
      }

      if (!isResponsing)
        setQuery('')
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  const [voiceInputShow, setVoiceInputShow] = useState(false)

  const handleVoiceInputShow = () => {
    (Recorder as any).getPermission().then(() => {
      setVoiceInputShow(true)
    }, () => {
      logError(t('common.voiceInput.notAllow'))
    })
  }

  const [isActiveIconFocused, setActiveIconFocused] = useState(false)

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const sendIconThemeStyle = {
    color: (isActiveIconFocused || query || (query.trim() !== '')) ? '#1C64F2' : '#d1d5db',
  }
  const sendBtn = (clearFn: () => void) => useMemo(() => (
    <div
      className='group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#EBF5FF] cursor-pointer'
      onMouseEnter={() => setActiveIconFocused(true)}
      onMouseLeave={() => setActiveIconFocused(false)}
      onClick={() => { handleSend(); clearFn() }}
      style={isActiveIconFocused ? { backgroundColor: 'rgb(225 239 254)' } : {}}
    >
      <Send03
        style={sendIconThemeStyle}
        className={`
          w-5 h-5 text-gray-300 group-hover:text-primary-600
          ${!!query.trim() && 'text-primary-600'}
        `}
      />
    </div>
  ), [query])
  const renderInputBottom = (clearFn: () => void) => {
    return (<div className="absolute bottom-2 right-2 flex items-center h-8">
      <div className={`${s.count} mr-4 h-5 leading-5 text-sm bg-gray-50 text-gray-500`}>{query.trim().length}</div>
      {
        query
          ? (
            <div className='flex justify-center items-center ml-2 w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-lg' onClick={() => clearFn()}>
              <XCircle className='w-4 h-4 text-[#98A2B3]' />
            </div>
          )
          : speechToTextConfig?.enabled
            ? (
              <div
                className='group flex justify-center items-center ml-2 w-8 h-8 hover:bg-primary-50 rounded-lg cursor-pointer'
                onClick={handleVoiceInputShow}
              >
                <Microphone01 className='block w-4 h-4 text-gray-500 group-hover:hidden' />
                <Microphone01Solid className='hidden w-4 h-4 text-primary-600 group-hover:block' />
              </div>
            )
            : null
      }
      <div className='mx-2 w-[1px] h-4 bg-black opacity-5' />
      {isMobile
        ? sendBtn(clearFn)
        : (
          <Tooltip
            selector='send-tip'
            htmlContent={
              <div>
                <div>{t('common.operation.send')} Enter</div>
                <div>{t('common.operation.lineBreak')} Shift Enter</div>
              </div>
            }
          >
            {sendBtn(clearFn)}
            {/* <div className={`${s.sendBtn} w-8 h-8 cursor-pointer rounded-md`} onClick={() => { handleSend(); clearFn() }}></div> */}
          </Tooltip>
        )}
    </div>)
  }
  const [currentTag, setCurrentTag] = useState<any>({})
  const renderUpload = () => {
    return (<>
      {
        visionConfig?.enabled && (
          <div className='absolute bottom-2 left-2 flex items-center z-10'>
            <ChatImageUploader
              settings={visionConfig}
              onUpload={(files) => { onUpload(files, setHasImage) }}
              disabled={files.length >= 111}
            />
            <div className='mx-1 w-[1px] h-4 bg-black/5' />
          </div>
        )
      }
      {
        visionConfig?.enabled && (
          <div className='absolute bottom-2 left-10 flex items-center z-10'>
            <ChatVideoUploader
              settings={visionConfig}
              onUpload={(files) => { onVideoUpload(files, setHasVideo) }}
              disabled={files.length >= visionConfig?.number_limits}
            />
            <div className='mx-1 w-[1px] h-4 bg-black/5' />
          </div>
        )
      }
      {
        visionConfig?.enabled && (
          <div style={{
            top: files.length > 0 && videoFile.length > 0 ?
              (Object.keys(currentTag).length > 0 ? '-160px' : '-140px') :
              (files.length > 0 && videoFile.length === 0) || (videoFile.length > 0 && files.length === 0) ?
                (Object.keys(currentTag).length > 0 ? '-100px' : '-80px') :
                (Object.keys(currentTag).length > 0 ? '-40px' : '-20px')
          }}
            className={`absolute left-2 z-10 max-h-[136px] overflow-y-auto pt-2`}>
            <ImageList
              list={files}
              onRemove={(fileId) => { onRemove(fileId, setHasImage) }}
              onReUpload={onReUpload}
              onImageLinkLoadSuccess={onImageLinkLoadSuccess}
              onImageLinkLoadError={onImageLinkLoadError}
            />
            <VideoList
              list={videoFile}
              onRemove={(videoFileId) => { onVideoRemove(videoFileId, setHasVideo) }}
              onReUpload={onVideoReUpload}
              onVideoLinkLoadSuccess={onVideoLinkLoadSuccess}
              onVideoLinkLoadError={onVideoLinkLoadError}
            />
          </div>
        )
      }
    </>)
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat List */}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              textToSpeechConfig={textToSpeechConfig}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isLast={isLast}
              isResponsing={isResponsing && isLast}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.filter(v => v.type.indexOf('video')).map(item => item.Thumbnail64Url) : []}
              videoSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.filter(v => v.type.indexOf('image')).map(item => item.url) : []}
              videoImageSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.filter(v => v.type.indexOf('image')).map(item => item.Thumbnail64Url) : []}
            />
          )
        })}
      </div>
      {
        !isHideSendInput && (
          <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0')}>
            {
              !noStopResponding && isResponsing && (
                <div className='flex justify-center mb-2 animate-pulse'>
                  <Button onClick={onStopResponding}>
                    <StopCircle className='mr-[5px] w-3.5 h-3.5 text-gray-500' />
                    <span className='text-xs text-gray-500 font-normal'>{t('app.chat.stopResponding')}</span>
                  </Button>
                </div>
              )
            }
            <div className='p-[5.5px] max-h-[280px] bg-white border-[1.5px] border-gray-200 rounded-xl'>
              {/* <Textarea
                className={`
                  block w-full px-2 pr-[118px] py-[7px] leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none
                  ${visionConfig?.enabled && 'pl-12'}
                `}
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                autoSize
              /> */}
              <PromptEditor
                className={`
                 block w-full px-2 py-[7px] leading-5 ${currentTag.name ? 'h-[76px]' : 'h-[100px]'} overflow-y-auto no-scrollbar text-sm text-gray-700 outline-none appearance-none resize-none}
                `}
                placeholderClassName={'leading-4'}
                compact
                value={query}
                menuBlock={{
                  show: true,
                  menu: [
                    { id: '1', value: 'key11', name: 'name1-test', icon: 'icon1', icon_background: 'icon_background1' },
                    { id: '2', value: 'key22', name: '汉字', icon: 'icon1', icon_background: 'icon_background1' },
                    { id: '3', value: 'key33', name: 'dddname1', icon: 'icon1', icon_background: 'icon_background1' },
                    { id: '4', value: 'key44', name: 'ZZZname1', icon: 'icon1', icon_background: 'icon_background1' }
                  ].map(item => ({
                    id: item.id,
                    name: item.name,
                    value: item.value,
                    icon: item.icon,
                    icon_background: item.icon_background,
                  })),
                  onSelect: (selectItem) => { setCurrentTag(selectItem) },
                }}
                onChange={handleContentChange}
                onBlur={() => {
                  handleContentChange
                }}
                renderInputBottom={renderInputBottom}
                renderUpload={renderUpload}
                editable={true}
                onSend={handleSend}
                ImageFiles={files}
                VideoFiles={videoFile}
                currentTag={currentTag}
                setCurrentTag={setCurrentTag}
                currConversationId={currConversationId}
              />
              {
                voiceInputShow && (
                  <VoiceInput
                    onCancel={() => setVoiceInputShow(false)}
                    onConverted={(text: React.SetStateAction<string>) => setQuery(text)}
                  />
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
