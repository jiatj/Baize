'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import Toast from '@/app/components/base/toast'
// import { getUserOAuth2SSOUrl, getUserOIDCSSOUrl, getUserSAMLSSOUrl } from '@/service/sso'
import Button from '@/app/components/base/button'
import { API_URL, APP_INFO } from '@/config'
import React from 'react'
import { setLocaleOnClient } from '@/i18n/client'



type UserSSOFormProps = {

}

const UserSSOForm: FC<UserSSOFormProps> = ({
}) => {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('access_token')
  const message = searchParams.get('message')

  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLocaleOnClient(APP_INFO.default_language, true)
    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
      router.replace('/')
    }

    if (message) {
      Toast.notify({
        type: 'error',
        message,
      })
    }
  }, [])

  const handleSSOLogin = () => {
    setIsLoading(true)
    localStorage?.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTU2Mzc2ZWEtMzU2Ny00MmMwLWFlNDgtMTYxZTg2YjJkNjk1IiwiZXhwIjoxNzI0OTgwNzUxLCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.ydKOV0afbmwv5qsUxmLrwb7heMkm9BP6nkgNueNJetc')
    setIsLoading(false)
    router.push('/')
    const source = 'test'
    let url = API_URL + `/sys/thirdLogin/render/${source}`
    const u = navigator.userAgent;
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    window.open(url, `login ${source}`, 'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
    let receiveMessage = function (event: MessageEvent) {
      let token = event.data
      localStorage?.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTU2Mzc2ZWEtMzU2Ny00MmMwLWFlNDgtMTYxZTg2YjJkNjk1IiwiZXhwIjoxNzI0OTgwNzUxLCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.ydKOV0afbmwv5qsUxmLrwb7heMkm9BP6nkgNueNJetc')
      setIsLoading(false)
      router.push('/')
      if (typeof token === 'string') {
        //字符串 说明是token
      } else if (typeof token === 'object') {

      } else {

      }
    }
    window.addEventListener('message', receiveMessage, false)
    // getUserOAuth2SSOUrl().then((res: any) => {
    //   document.cookie = `user-oauth2-state=${res.state}`
    //   router.push(res.url)
    // }).finally(() => {
    //   setIsLoading(false)
    // })
  }

  return (
    <div className={
      cn(
        'flex flex-col items-center w-full grow justify-center',
        'px-6',
        'md:px-[108px]',
      )
    }>
      <div className='flex flex-col md:w-[400px]'>
        {/* <div className="w-full mx-auto">
          <h2 className="text-[32px] font-bold text-gray-900">{t('app.login.title')}</h2>
        </div> */}
        <div className="w-full mx-auto mt-10">
          <Button
            onClick={() => { handleSSOLogin() }}
            disabled={isLoading}
            className="w-full bg-orange-300 hover:bg-orange-400 text-white hover:text-gray-100"
          >{t('app.login.sso')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserSSOForm
