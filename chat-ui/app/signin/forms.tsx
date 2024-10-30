'use client'
import React from 'react'

import NormalForm from './normalForm'
import cn from '@/utils/classnames'

const Forms = () => {

  return <div className={
    cn(
      'flex flex-col items-center w-full grow justify-center',
      'px-6',
      'md:px-[108px]',
    )
  }>
    <div className='flex flex-col md:w-[400px]'>
      <NormalForm />
    </div>
  </div>
}

export default Forms
