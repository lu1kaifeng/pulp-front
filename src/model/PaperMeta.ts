export interface Version {
  version: string
  created: string
}

export interface Meta {
  id: string
  submitter: string
  authors: string
  title: string
  comments: string
  'journal-ref'?: any
  doi?: any
  'report-no'?: any
  categories: string
  license: string
  versions: Version[]
  update_date: string
  authors_parsed: string[][]
}

export interface PaperMeta {
  text: string
  id: string
  score?: any
  probability?: any
  question?: any
  meta: Meta
  embedding?: any
}
