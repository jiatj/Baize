export function textToEditorState(text: string) {
  const paragraph = text.split('\n')

  return JSON.stringify({
    root: {
      children: paragraph.map((p) => {
        return {
          children: [{
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: p,
            type: 'custom-text',
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        }
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  })
}
