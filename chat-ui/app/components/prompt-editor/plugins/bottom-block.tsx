import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import {
  $getRoot,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ImageFile, VideoFile } from '@/types/app'

type BottomBlockProps = {
  onClear?: () => void
  renderInputBottom: (clearFn: () => void) => JSX.Element
  renderUpload: () => JSX.Element
  onSend?: () => void
  query?: string
  ImageFiles?: ImageFile[]
  VideoFiles?: VideoFile[]
  currConversationId?: string
}
const BottomBlock: FC<BottomBlockProps> = ({
  onClear,
  renderInputBottom,
  renderUpload,
  onSend,
  ImageFiles,
  VideoFiles,
  query,
  currConversationId
}) => {
  const [editor] = useLexicalComposerContext()

  const ref = useRef<any>(null)

  const clearFn = () => {
    editor.update(() => {
      $getRoot().clear();
    })
  }

  useEffect(() => {
    editor.update(() => {
      $getRoot().clear();
    })
  }, [currConversationId])

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (payload) => {
        const { shiftKey, key } = payload;
        if (key == "Enter" && shiftKey == false) {
          payload.preventDefault();

          onSend()
          editor.update(() => {
            $getRoot().clear();
          })
        }

        // onSend()
        // editor.update(() => {
        //   $getRoot().clear();
        // })
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, query, ImageFiles, VideoFiles, onSend]);

  return <div className='h-[40px]'>
    {renderUpload()}
    {renderInputBottom(clearFn)}
  </div>
}

export default BottomBlock
