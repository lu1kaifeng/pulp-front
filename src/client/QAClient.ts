import { AxiosObj } from './AxiosObj'
import { QAQuery } from '../model/QAQuery'

export class QAClient {
  static async postQuestion(paperId: string, question: string) {
    const query: QAQuery = { id: paperId, question }
    return (await AxiosObj.post('/qa/question', { query }, {})).data
  }
}
