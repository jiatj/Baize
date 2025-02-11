'use client'

import { type FC } from 'react'
import type {
  EditorState,
} from 'lexical'
import {
  $getRoot,
  TextNode,
} from 'lexical'
import { CodeNode } from '@lexical/code'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import Placeholder from './plugins/placeholder'
import ComponentPickerBlock from './plugins/component-picker-block'
import { CustomTextNode } from './plugins/custom-text/node'
import OnBlurBlock from './plugins/on-blur-or-focus-block'
import { textToEditorState } from './utils'
import type {
  MenuBlockType,
} from './types'
import BottomBlock from './plugins/bottom-block'
import type { ImageFile, VideoFile } from '@/types/app'
import XClose from '@/app/components/base/icons/line/x-close'

export type PromptEditorProps = {
  instanceId?: string
  compact?: boolean
  className?: string
  placeholder?: string
  placeholderClassName?: string
  style?: React.CSSProperties
  value?: string
  editable?: boolean
  onChange?: (text: string) => void
  onBlur?: () => void
  onFocus?: () => void
  renderInputBottom: (clearFn: () => void) => JSX.Element
  renderUpload: () => JSX.Element
  onSend?: () => void
  menuBlock?: MenuBlockType
  ImageFiles: ImageFile[]
  VideoFiles: VideoFile[]
  currentTag: any
  setCurrentTag?: (currentTag: any) => void
  currConversationId?: string
}

const PromptEditor: FC<PromptEditorProps> = ({
  instanceId,
  compact,
  className,
  placeholder,
  placeholderClassName,
  style,
  value,
  editable = true,
  onChange,
  onBlur,
  onFocus,
  renderInputBottom,
  renderUpload,
  onSend,
  ImageFiles,
  VideoFiles,
  menuBlock,
  currentTag,
  setCurrentTag,
  currConversationId,
}) => {
  const initialConfig = {
    namespace: 'prompt-editor',
    nodes: [
      CodeNode,
      CustomTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new CustomTextNode(node.__text),
      },
    ],
    editorState: textToEditorState(value || ''),
    onError: (error: Error) => {
      throw error
    },
  }

  const handleEditorChange = (editorState: EditorState) => {
    const text = editorState.read(() => {
      return $getRoot().getChildren().map(p => p.getTextContent()).join('\n')
    })
    if (onChange)
      onChange(text)
  }

  return (
    <LexicalComposer initialConfig={{ ...initialConfig, editable }}>
      {
        menuBlock?.show && Object.keys(currentTag).length > 0 && (
          <div className={`
          group inline-flex items-center pl-1 pr-0.5 h-6 border border-transparent bg-[#F4F3FF] text-[#6938EF] rounded-[5px] hover:bg-[#EBE9FE]
          'bg-[#EBE9FE]'}
          '!border-[#9B8AFB]'}
        `}>
            {currentTag.name}
            <XClose className='w-5 h-5 text-[#6938EF] cursor-pointer' onClick={() => { setCurrentTag({}) }} />
          </div>
        )
      }
      <div className='relative h-full'>
        <RichTextPlugin
          contentEditable={<ContentEditable className={`${className} outline-none ${compact ? 'leading-5 text-[13px]' : 'leading-6 text-sm'} text-gray-700`} style={style || {}} />}
          placeholder={<Placeholder value={placeholder} className={placeholderClassName} compact={compact} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ComponentPickerBlock
          triggerString='@'
          menuBlock={menuBlock}
        />
        <OnChangePlugin onChange={handleEditorChange} />
        <OnBlurBlock onBlur={onBlur} onFocus={onFocus} />
        <HistoryPlugin />
        <BottomBlock renderInputBottom={renderInputBottom} renderUpload={renderUpload} onSend={onSend}
          query={value} ImageFiles={ImageFiles} VideoFiles={VideoFiles} currConversationId={currConversationId} currentTag={currentTag} />
      </div>
    </LexicalComposer>
  )
}

export default PromptEditor
