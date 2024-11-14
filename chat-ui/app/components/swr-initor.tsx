'use client'

import { SWRConfig } from 'swr'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { iframeLogin, login, switchApp } from '@/service'
import { isDev } from '@/config'

type SwrInitorProps = {
  children: ReactNode
}
const SwrInitor = ({
  children,
}: SwrInitorProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const token = searchParams.get('token')
  const accessTokenFromLocalStorage = localStorage?.getItem('access_token')
  const [init, setInit] = useState(false)

  const handleLogin = async (code: string) => {
    const { access_token, apps, app_code }: any = await login(code)
    globalThis.localStorage?.setItem('access_token', access_token)
    globalThis.localStorage?.setItem('app_code', app_code)
    globalThis.localStorage?.setItem('apps', JSON.stringify(apps))
    let appid: string = globalThis.localStorage?.getItem('APP_ID') || ''
    if ((appid === null || appid === '' || appid === undefined) && apps.length > 0)
      appid = (apps.find((app: any) => app.actived === 'y'))?.appId

    globalThis.localStorage?.setItem('APP_ID', appid)
    const { data }: any = await switchApp(appid)
    router.replace('/', { forceOptimisticNavigation: false } as any)
  }

  const handleLoginByIframe = async (token: string) => {
    const { access_token, apps, app_code }: any = await iframeLogin(token)
    globalThis.localStorage?.setItem('access_token', access_token)
    globalThis.localStorage?.setItem('app_code', app_code)
    globalThis.localStorage?.setItem('apps', JSON.stringify(apps))
    let appid: string = globalThis.localStorage?.getItem('APP_ID') || ''
    if ((appid === null || appid === '' || appid === undefined) && apps.length > 0)
      appid = (apps.find((app: any) => app.actived === 'y'))?.appId

    globalThis.localStorage?.setItem('APP_ID', appid)
    const { data }: any = await switchApp(appid)
    router.replace('/', { forceOptimisticNavigation: true } as any)
    globalThis.location.reload()
  }

  useEffect(() => {
    if (token && !accessTokenFromLocalStorage) {
      handleLoginByIframe(token)
      return
    }
    window.addEventListener('message', (event) => {
      const { data }: any = event
      if (!accessTokenFromLocalStorage)
        handleLoginByIframe(data)
      else
        router.replace('/', { forceOptimisticNavigation: false } as any)
    })
    if (!(code || accessTokenFromLocalStorage)) {
      // router.replace('/signin')
      // const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkNGY5MjA1Zi1hNDc1LTQzMjUtODlmMy04NmYzYjdmOWUzNzEiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZDRmOTIwNWYtYTQ3NS00MzI1LTg5ZjMtODZmM2I3ZjllMzcxIiwiYXBwX2NvZGUiOiJITzJFamZoRVFOVm5TYnlEIiwiZW5kX3VzZXJfaWQiOiI1OTI2M2Y2Yi03ODA0LTRjZDgtYmUxMS01NjQzM2FjN2YyYzEifQ.oWtH5709cSu7dvVI9MUMMj4bIXKpPU1rhD-5jqwItIw"
      // globalThis.localStorage?.setItem('access_token', access_token)
      // router.push('/')
      // return
      // let url = API_URL + `/sys/thirdLogin/render/${source}`
      console.log(isDev)
      const redirect_url = isDev ? 'http://192.168.10.199:3000/bot' : 'http://192.168.10.70/bot'
      const appid = '8cf949fc-9ea4-4b70-80f1-57a1f5f89bf3'
      const url = `http://yuntengwangluo.3322.org:8082/login?redirect_url=${encodeURIComponent(redirect_url)}&appid=${encodeURIComponent(appid)}`
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') || u.includes('Adr') // android终端
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      window.location.replace(url)
      // window.open(url, 'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      // let receiveMessage = function (event: MessageEvent) {
      //   let token = event.data
      //   localStorage?.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTU2Mzc2ZWEtMzU2Ny00MmMwLWFlNDgtMTYxZTg2YjJkNjk1IiwiZXhwIjoxNzI0OTgwNzUxLCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.ydKOV0afbmwv5qsUxmLrwb7heMkm9BP6nkgNueNJetc')
      //   router.push('/')
      //   if (typeof token === 'string') {
      //     //字符串 说明是token
      //   } else if (typeof token === 'object') {

      //   } else {

      //   }
      // }
      // window.addEventListener('message', receiveMessage, false)
    }
    if (code)
      handleLogin(code)
    // localStorage?.setItem('access_token', accessToken!)
    // const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkNGY5MjA1Zi1hNDc1LTQzMjUtODlmMy04NmYzYjdmOWUzNzEiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZDRmOTIwNWYtYTQ3NS00MzI1LTg5ZjMtODZmM2I3ZjllMzcxIiwiYXBwX2NvZGUiOiJITzJFamZoRVFOVm5TYnlEIiwiZW5kX3VzZXJfaWQiOiI1OTI2M2Y2Yi03ODA0LTRjZDgtYmUxMS01NjQzM2FjN2YyYzEifQ.oWtH5709cSu7dvVI9MUMMj4bIXKpPU1rhD-5jqwItIw"
    // globalThis.localStorage?.setItem('access_token', access_token)
    // router.replace('/', { forceOptimisticNavigation: false } as any)

    setInit(true)
  }, [])

  return init
    ? (
      <SWRConfig value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}>
        {children}
      </SWRConfig>
    )
    : null
}

export default SwrInitor
