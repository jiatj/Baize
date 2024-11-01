import type {
  Node as ReactFlowNode,
} from 'reactflow'

export type Dataset = {
  id: string
  name: string
  type: string
}

export type RoleName = {
  user: string
  assistant: string
}

export enum VarType {
  string = 'string',
  number = 'number',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any',
}


export type Var = {
  variable: string
  type: VarType
  children?: Var[] // if type is obj, has the children struct
  isParagraph?: boolean
  isSelect?: boolean
  options?: string[]
  required?: boolean
}

export type NodeOutPutVar = {
  nodeId: string
  title: string
  vars: Var[]
  isStartNode?: boolean
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
}


export type Branch = {
  id: string
  name: string
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export type ToolDefaultValue = {
  provider_id: string
  provider_type: string
  provider_name: string
  tool_name: string
  tool_label: string
  title: string
}

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _singleRunningStatus?: NodeRunningStatus
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: string[]
  _isEntering?: boolean
  _showAddVariablePopup?: boolean
  _holdAddVariablePopup?: boolean
  _iterationLength?: number
  _iterationIndex?: number
  isIterationStart?: boolean
  isInIteration?: boolean
  iteration_id?: string
  selected?: boolean
  title: string
  desc: string
  type: BlockEnum
  width?: number
  height?: number
} & T & Partial<Pick<ToolDefaultValue, 'provider_id' | 'provider_type' | 'provider_name' | 'tool_name'>>

export type Node<T = {}> = ReactFlowNode<CommonNodeType<T>>

export type Option = {
  value: string
  name: string
}

export type MenuOption = {
  id: string
  value: string
  name: string
  icon?: string
  icon_background?: string
}

export type MenuBlockType = {
  show?: boolean
  menu?: MenuOption[]
  onSelect?: (selectItem: any) => void
}

export type MenuTextMatch = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

export type ValueSelector = string[] // [nodeId, key | obj key path]
