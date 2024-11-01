/* eslint-disable @typescript-eslint/no-use-before-define */
'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import Loading from '../components/base/loading'
import Forms from './forms'
import Header from './_header'
import style from './page.module.css'
import UserSSOForm from './userSSOForm'
import cn from '@/utils/classnames'

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  return (
    <div className={cn(
      style.background,
      'flex w-full min-h-screen',
      'sm:p-4 lg:p-8',
      'gap-x-20',
      'justify-center lg:justify-start',
    )}>
      <div className={
        cn(
          'flex w-full flex-col bg-white shadow rounded-2xl shrink-0',
          'space-between',
        )
      }>
        {/* logo和右侧选择语言 */}


        {loading && (
          <div className={
            cn(
              'flex flex-col items-center w-full grow justify-center',
              'px-6',
              'md:px-[108px]',
            )
          }>
            <Loading type='area' />
          </div>
        )}

        {/* 正常登录表单 */}
        {/* {!loading && (
          <>
            <Forms />
            <div className='px-8 py-6 text-sm font-normal text-gray-500'>
              © {new Date().getFullYear()} LangGenius, Inc. All rights reserved.
            </div>
          </>
        )} */}
        {/* 单点登录表单 */}
        {!loading && (
          <UserSSOForm />
        )}
      </div>

    </div>
  )
}

export default SignIn
// import type { FC } from 'react'
// import React from 'react'

// import type { IMainProps } from '@/app/components'
// import Main from '@/app/components'

// const App: FC<IMainProps> = ({
//   params,
// }: any) => {
//   return (
//     <Main params={params} />
//   )
// }

// export default React.memo(App)
