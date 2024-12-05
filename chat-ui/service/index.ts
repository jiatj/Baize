import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { get, post, ssePost } from './base'
import type { Feedbacktype } from '@/types/app'

export const sendChatMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  return ssePost('chat-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace, onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished })
}

export const fetchConversations = async (params: any) => {
  return get('conversations', { params })
}

export const fetchChatList = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
  // return {
  //   data: [
  //     {
  //       id: '5ba19f84-236b-4b5f-8456-408939fe1da9',
  //       conversation_id: 'f8c67b24-ada6-495d-903c-ba5c086d0ae1',
  //       parent_message_id: null,
  //       inputs: {},
  //       query: '提交成功*****{\"type\":\"questionnaire\",\"data\":{\"1\":true,\"2\":true}}*****',
  //       answer: '# 1.确定范围\n<form formType="questionnaire">\n  <label>使用场景：</label>\n  <checkbox type="checkbox" name="username" qid="1">\n    自己家里\n  </checkbox>\n  <checkbox type="checkbox" name="username1" qid="2">\n    公司\n  </checkbox>\n  <label>设备类型：</label>\n  <checkbox type="checkbox" name="username2" qid="3">\n    电脑\n  </checkbox>\n  <checkbox type="checkbox" name="username3" qid="4">\n    手机\n  </checkbox>\n  <button type="submit">提交</button>\n</form>\n',
  //       message_files: [],
  //       feedback: null,
  //       retriever_resources: [],
  //       created_at: 1731946621,
  //       agent_thoughts: [],
  //       status: 'normal',
  //       error: null,
  //     },
  //     {
  //       id: '5ba19f84-236b-4b5f-8456-408939fe1da9',
  //       conversation_id: 'f8c67b24-ada6-495d-903c-ba5c086d0ae1',
  //       parent_message_id: null,
  //       inputs: {},
  //       query: '查询成功*****{\"type\":\"notice\",\"data\":{\"messageid\":\"1\"}}*****',
  //       answer: '# 1.确定范围<form formType="notice"><notice messageid="1">使用场景使用场景使用场景使用场景使用场景使用场景</notice></form>',
  //       message_files: [],
  //       feedback: null,
  //       retriever_resources: [],
  //       created_at: 1731946621,
  //       agent_thoughts: [],
  //       status: 'normal',
  //     },
  //   ],
  //   has_more: false,
  //   limit: 20,
  // }
}

// init value. wait for server update
export const fetchAppParams = async () => {
  return get('parameters')
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}

export const audioToText = (url: string, body: FormData, otherOptions?: any) => {
  return post(url, { body }, otherOptions) as Promise<{ text: string }>
}

export const textToAudioStream = (url: string, header: { content_type: string }, body: { streaming: boolean; voice?: string; message_id?: string; text?: string | null | undefined }) => {
  return post(url, { body, header }, { needAllResponseContent: true })
}

export const stopResponseByTaskId = async (taskId: string) => {
  return post(`chat-messages/${taskId}/stop`, { body: {} })
}

export const login = async (code: string) => {
  return get(`auth2/login/${code}`)
}

export const iframeLogin = async (code: string) => {
  return get(`iu_token/${code}`)
}

export const switchApp = async (appid: string) => {
  return get(`app/switch/${appid}`)
}

// export const test = async (conversationId: string) => {
//   return post('ext-api/notify/abc', { body: { conversation_id: conversationId, inputs: { a: 1 }, query: '', files: [] } })
// }
export const extApi = async (api_name: string, tool_variable: string, payload: any) => {
  return post(`ext-api/${api_name}/${tool_variable}`, { body: { inputs: {}, ...payload } })
}
