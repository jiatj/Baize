import type { FC } from 'react'
import { memo } from 'react'
import Button from '@/app/components/base/button'

type SuggestedQuestionsProps = {
  item: any
  onSend?: (message: string) => void
}
const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({
  item,
  onSend,
}) => {
  const {
    isOpeningStatement,
    suggestedQuestions,
  } = item

  if (!isOpeningStatement || !suggestedQuestions?.length)
    return null

  return (
    <div className='flex flex-wrap'>
      {suggestedQuestions.filter(q => !!q && q.trim()).map((question, index) => (
        <Button
          key={index}
          className='mr-1 mt-1 max-w-full shrink-0 last:mr-0 bg-white hover:bg-gray-100 text-blue-600 text-sm'
          onClick={() => onSend?.(question)}
        >
          {question}
        </Button>),
      )}
    </div>
  )
}

export default memo(SuggestedQuestions)
