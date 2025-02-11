import React, { useEffect, useState } from 'react'
import Checkbox from '../checkbox'
import Button from '@/app/components/base/button'
import Textarea from '@/app/components/base/textarea'

enum DATA_FORMAT {
  TEXT = 'text',
  JSON = 'json',
}
enum SUPPORTED_TAGS {
  LABEL = 'label',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  NOTICE = 'notice',
}
enum SUPPORTED_TYPES {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  NUMBER = 'number',
}
const MarkdownForm = ({ node, onSend }: any) => {
  // const supportedTypes = ['text', 'password', 'email', 'number']
  //   <form data-format="text">
  //      <label for="username">Username:</label>
  //      <input type="text" name="username" />
  //      <label for="password">Password:</label>
  //      <input type="password" name="password" />
  //      <label for="content">Content:</label>
  //      <textarea name="content"></textarea>
  //      <button data-size="small" data-variant="primary">Login</button>
  //   </form>
  // const { onSend } = useChatContext()

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    const initialValues: { [key: string]: any } = {}
    node.children.forEach((child: any) => {
      if ([SUPPORTED_TAGS.INPUT, SUPPORTED_TAGS.TEXTAREA].includes(child.tagName))
        initialValues[child.properties.name] = child.properties.value
      else if (child.tagName === SUPPORTED_TAGS.CHECKBOX)
        initialValues[child.properties.qid] = false
      else if (child.tagName === SUPPORTED_TAGS.NOTICE)
        initialValues.messageid = child.properties.messageid
    })
    setFormValues(initialValues)
  }, [node.children])

  const getFormValues = (children: any) => {
    const values: { [key: string]: any } = {}
    children.forEach((child: any) => {
      if ([SUPPORTED_TAGS.INPUT, SUPPORTED_TAGS.TEXTAREA, SUPPORTED_TAGS.CHECKBOX].includes(child.tagName))
        values[child.properties.name] = formValues[child.properties.name]
    })
    return values
  }

  const getQuestionnaireValues = (children: any) => {
    const values: { [key: string]: any } = {}
    children.forEach((child: any) => {
      if (child.tagName === SUPPORTED_TAGS.CHECKBOX)
        values[child.properties.qid] = formValues[child.properties.name]
    })
    return values
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (node.properties.formtype === 'questionnaire') {
      const result = getQuestionnaireValues(node.children)
      const params = {
        type: 'questionnaire',
        data: result,
      }
      const sendContent = '提交成功' + `*****${JSON.stringify(params)}*****`
      onSend?.(sendContent)
    }
    else {
      const format = node.properties.dataFormat || DATA_FORMAT.TEXT
      const result = getFormValues(node.children)
      if (format === DATA_FORMAT.JSON) {
        onSend?.(JSON.stringify(result))
      }
      else {
        const textResult = Object.entries(result)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
        onSend?.(textResult)
      }
    }
  }

  const getNoticeId = (children: any) => {
    const values: { [key: string]: any } = {}
    children.forEach((child: any) => {
      if ([SUPPORTED_TAGS.NOTICE].includes(child.tagName))
        values.messageid = child.properties.messageid
    })
    return values
  }

  const onClickNotice = (e: any) => {
    const result = getNoticeId(node.children)
    const params = {
      type: 'notice',
      data: result,
    }
    const sendContent = '查询成功' + `*****${JSON.stringify(params)}*****`
    onSend?.(sendContent)
  }
  return (
    <form
      autoComplete="off"
      className='flex flex-col self-stretch'
      onSubmit={(e: any) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {node.children.filter((i: any) => i.type === 'element').map((child: any, index: number) => {
        if (child.tagName === SUPPORTED_TAGS.LABEL) {
          return (
            <label
              key={index}
              htmlFor={child.properties.for}
              className="my-2 system-md-semibold text-text-secondary"
            >
              {child.children[0]?.value || ''}
            </label>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.CHECKBOX) {
          return (
            <div className='flex items-start mb-2'>
              <Checkbox
                styleCss={{ width: '20px', height: '20px', marginRight: '8px' }}
                key={index}
                type={child.properties.type}
                name={child.properties.name}
                placeholder={child.properties.placeholder}
                checked={formValues[child.properties.name]}
                onChange={(e) => {
                  setFormValues(prevValues => ({
                    ...prevValues,
                    [child.properties.name]: e.target.checked,
                  }))
                }}
              />
              {child.children[0]?.value || ''}
            </div>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.NOTICE) {
          return (
            <div className='flex items-start mb-2' onClick={onClickNotice}>
              {child.children[0]?.value || ''}
            </div>
          )
        }
        if (child.tagName === SUPPORTED_TAGS.TEXTAREA) {
          return (
            <Textarea
              key={index}
              name={child.properties.name}
              placeholder={child.properties.placeholder}
              value={formValues[child.properties.name]}
              onChange={(e) => {
                setFormValues(prevValues => ({
                  ...prevValues,
                  [child.properties.name]: e.target.value,
                }))
              }}
            />
          )
        }
        if (child.tagName === SUPPORTED_TAGS.BUTTON) {
          const variant = child.properties.dataVariant
          const size = child.properties.dataSize

          return (
            <Button
              variant={variant}
              size={size}
              className='mt-4'
              key={index}
              onClick={onSubmit}
            >
              <span className='text-[13px]'>{child.children[0]?.value || ''}</span>
            </Button>
          )
        }

        return <p key={index}>Unsupported tag: {child.tagName}</p>
      })}
    </form>
  )
}
MarkdownForm.displayName = 'MarkdownForm'
export default MarkdownForm
