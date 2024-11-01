import BrowerInitor from './components/browser-initor'
import { getLocaleOnServer } from '@/i18n/server'
import SwrInitor from '@/app/components/swr-initor'
// 为子组件globalThis添加localStorage和sessionStorage属性

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full dark-scheme">
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            <BrowerInitor>
              <SwrInitor>
                {children}
              </SwrInitor>
            </BrowerInitor>
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
