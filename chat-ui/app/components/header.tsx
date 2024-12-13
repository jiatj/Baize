import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import Logo from '@/app/components/base/icons/public/logo'
export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  onCloseChatIframe?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
  onCloseChatIframe,
}) => {
  const isIframe = globalThis.localStorage?.getItem('isIframe') === '1'
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-gray-100">
      {isMobile
        ? (
          <div
            className='flex items-center justify-center h-8 w-8 cursor-pointer'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-4 w-4 text-gray-500" />
          </div>
        )
        : <div></div>}
      <div className='flex items-center space-x-2'>
        <Logo className='h-[30px] w-[56px] text-gray-500' />
        {/* <AppIcon size="small" />
        <div className=" text-sm text-gray-800 font-bold">{title}</div> */}
      </div>
      <div className='flex items-center'>
        {isMobile
          ? (
            <div className='flex items-center justify-center h-8 w-8 cursor-pointer'
              onClick={() => onCreateNewChat?.()}
            >
              <PencilSquareIcon className="h-4 w-4 text-gray-500" />
            </div>)
          : <div></div>}
        {isIframe
          ? (
            <div className='flex items-center justify-center h-8 w-8 cursor-pointer space-x-2'
              onClick={() => onCloseChatIframe?.()}
            >
              <XMarkIcon className="h-4 w-4 text-gray-500" />
            </div>)
          : <div></div>}
      </div>
    </div>
  )
}

export default React.memo(Header)
