const translation = {
  api: {
    success: '成功',
    saved: '已保存',
    create: '已创建',
  },
  operation: {
    confirm: '确认',
    cancel: '取消',
    clear: '清空',
    save: '保存',
    edit: '编辑',
    refresh: '重新开始',
    search: '搜索',
    send: '发送',
    lineBreak: '换行',
    like: '赞同',
    dislike: '反对',
    ok: '好的',
    copy: '复制',
    copied: '已复制'
  },
  imageUploader: {
    uploadFromComputer: '从本地上传',
    uploadFromComputerReadError: '图片读取失败，请重新选择。',
    uploadFromComputerUploadError: '图片上传失败，请重新上传。',
    uploadFromComputerLimit: '上传图片不能超过 {{size}} MB',
    pasteImageLink: '粘贴图片链接',
    pasteImageLinkInputPlaceholder: '将图像链接粘贴到此处',
    pasteImageLinkInvalid: '图片链接无效',
    imageUpload: '图片上传',
  },
  videoUploader: {
    uploadFromComputer: '从本地上传',
    uploadFromComputerReadError: '图片读取失败，请重新选择。',
    uploadFromComputerUploadError: '图片上传失败，请重新上传。',
    uploadFromComputerLimit: '上传图片不能超过 {{size}} MB',
    pasteVideoLink: '粘贴视频链接',
    pasteVideoLinkInputPlaceholder: '将视频链接粘贴到此处',
    pasteVideoLinkInvalid: '视频链接无效',
    videoUpload: '视频上传',
  },
  voiceInput: {
    speaking: '现在讲...',
    converting: '正在转换为文本...',
    notAllow: '麦克风未授权',
  },
  promptEditor: {
    placeholder: '输入@唤起指令,Shift+Enter换行',
    context: {
      item: {
        title: '上下文',
        desc: '插入上下文模板',
      },
      modal: {
        title: '有 {{num}} 个知识库在上下文中',
        add: '添加上下文',
        footer: '您可以在下面的“上下文”部分中管理上下文。',
      },
    },
    history: {
      item: {
        title: '会话历史',
        desc: '插入历史消息模板',
      },
      modal: {
        title: '示例',
        user: '你好',
        assistant: '你好！今天我能为您提供什么帮助？',
        edit: '编辑对话角色名称',
      },
    },
    variable: {
      item: {
        title: '变量 & 外部工具',
        desc: '插入变量和外部工具',
      },
      outputToolDisabledItem: {
        title: '变量',
        desc: '插入变量',
      },
      modal: {
        add: '添加新变量',
        addTool: '添加工具',
      },
    },
    query: {
      item: {
        title: '查询内容',
        desc: '插入用户查询模板',
      },
    },
    existed: 'Prompt 中已存在',
  },
}

export default translation
