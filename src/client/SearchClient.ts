import { AxiosObj } from './AxiosObj'
import { SearchMatch, SearchRequest } from '../model/FuzzySearch'

export class SearchClient {
  static async postSearch(query: SearchRequest): Promise<SearchMatch[]> {
    return (await AxiosObj.post('/fuzzy/search', query, {})).data
  }
}
