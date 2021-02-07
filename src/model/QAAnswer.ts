export interface Meta {
  name: string
}

export interface Answer {
  answer: string | null
  score?: number
  probability: number
  context: string
  offset_start: number
  offset_end: number
  document_id: string
  meta: Meta
}

export interface QAAnswer {
  query: string
  answers: Answer[]
  question: string
}
