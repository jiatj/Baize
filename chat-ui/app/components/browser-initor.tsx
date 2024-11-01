'use client'

/*
Record构建一个键值对象，这个类是模拟storage
globalThis 不同环境中，统一的全局变量插件
*/
class StorageMock {
  data: Record<string, string>

  constructor() {
    this.data = {} as Record<string, string>
  }

  setItem(name: string, value: string) {
    this.data[name] = value
  }

  getItem(name: string) {
    return this.data[name] || null
  }

  removeItem(name: string) {
    delete this.data[name]
  }

  clear() {
    this.data = {}
  }
}

let localStorage, sessionStorage

try {
  localStorage = globalThis.localStorage
  sessionStorage = globalThis.sessionStorage
}
catch (e) {
  localStorage = new StorageMock()
  sessionStorage = new StorageMock()
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorage,
})

Object.defineProperty(globalThis, 'sessionStorage', {
  value: sessionStorage,
})

//浏览器启动器 为子组件globalThis添加localStorage和sessionStorage属性
const BrowerInitor = ({
  children,
}: { children: React.ReactElement }) => {
  return children
}

export default BrowerInitor
