const translation = {
  api: {
    success: 'Success',
    saved: 'Saved',
    create: 'Created',
  },
  operation: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    clear: 'Clear',
    save: 'Save',
    edit: 'Edit',
    refresh: 'Restart',
    search: 'Search',
    send: 'Send',
    lineBreak: 'Line break',
    like: 'like',
    dislike: 'dislike',
    ok: 'OK',
    copy: 'Copy',
    copied: 'Copied'
  },
  imageUploader: {
    uploadFromComputer: 'Upload from Computer',
    uploadFromComputerReadError: 'Image reading failed, please try again.',
    uploadFromComputerUploadError: 'Image upload failed, please upload again.',
    uploadFromComputerLimit: 'Upload images cannot exceed {{size}} MB',
    pasteImageLink: 'Paste image link',
    pasteImageLinkInputPlaceholder: 'Paste image link here',
    pasteImageLinkInvalid: 'Invalid image link',
    imageUpload: 'Image Upload',
  },
  voiceInput: {
    speaking: 'Speak now...',
    converting: 'Converting to text...',
    notAllow: 'microphone not authorized',
  },
  promptEditor: {
    placeholder: 'Enter @ to invoke the command, Shift+Enter to change the line',
    context: {
      item: {
        title: 'Context',
        desc: 'Insert context template',
      },
      modal: {
        title: '{{num}} Knowledge in Context',
        add: 'Add Context ',
        footer: 'You can manage contexts in the Context section below.',
      },
    },
    history: {
      item: {
        title: 'Conversation History',
        desc: 'Insert historical message template',
      },
      modal: {
        title: 'EXAMPLE',
        user: 'Hello',
        assistant: 'Hello! How can I assist you today?',
        edit: 'Edit Conversation Role Names',
      },
    },
    variable: {
      item: {
        title: 'Variables & External Tools',
        desc: 'Insert Variables & External Tools',
      },
      outputToolDisabledItem: {
        title: 'Variables',
        desc: 'Insert Variables',
      },
      modal: {
        add: 'New variable',
        addTool: 'New tool',
      },
    },
    query: {
      item: {
        title: 'Query',
        desc: 'Insert user query template',
      },
    },
    existed: 'Already exists in the prompt',
  },
}

export default translation
