export interface SearchRequest {
  text: string
  query: string[]
  max_l_dist: number
}

export interface SearchMatch {
  start: number
  end: number
  matched: string
}
