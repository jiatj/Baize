import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon, ServerIcon as ServerSolidIcon } from '@heroicons/react/24/solid'
import AppIcon from '../base/app-icon'
import Button from '@/app/components/base/button'
// import Card from './card'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  onLoadMore: () => void
  list: ConversationItem[]
  appList: any[]
  APP_ID: string
  onAppIdChange: (id: string) => void
  hasMore: boolean
  isMoreLoading?: boolean
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  onLoadMore,
  list,
  appList,
  APP_ID,
  onAppIdChange,
  hasMore,
  isMoreLoading,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto bg-white pc:w-[244px] tablet:w-[192px] mobile:w-[240px]  border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      <div className='mb-2 p-4 max-h-56 overflow-y-auto'>
        {appList.map((item) => {
          const isCurrent = item.appId === APP_ID
          const ItemIcon
            = isCurrent ? ServerSolidIcon : ServerIcon
          return (
            <div
              onClick={() => onAppIdChange(item.appId)}
              key={item.appId}
              className={classNames(
                isCurrent
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              {/* <div className={classNames(
                isCurrent
                  ? 'text-primary-600'
                  : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 h-5 w-5 flex-shrink-0',
              )}>{item.icon}</div> */}
              <AppIcon
                size='small'
                className='cursor-pointer w-5 h-5 mr-3 flex-shrink-0'
                iconType={'emoji'}
                icon={item.icon}
              />
              {item.name}
            </div>
          )
        })}
      </div>
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
            <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0 max-h-[calc(100%_-_3rem_-_56px)] overflow-y-scroll">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              <ItemIcon
                className={classNames(
                  isCurrent
                    ? 'text-primary-600'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-5 w-5 flex-shrink-0',
                )}
                aria-hidden="true"
              />
              {item.name}
            </div>
          )
        })}
        {hasMore && (
          <Button
            loading={isMoreLoading}
            onClick={() => onLoadMore()}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
            {t('app.chat.loadMore')}
          </Button>
        )}
      </nav>
      {/* <a className="flex flex-shrink-0 p-4" href="https://langgenius.ai/" target="_blank">
        <Card><div className="flex flex-row items-center"><ChatBubbleOvalLeftEllipsisSolidIcon className="text-primary-600 h-6 w-6 mr-2" /><span>LangGenius</span></div></Card>
      </a> */}
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
