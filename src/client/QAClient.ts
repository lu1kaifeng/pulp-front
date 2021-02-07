import { AxiosObj } from './AxiosObj'
import { QAQuery } from '../model/QAQuery'
import { QAAnswer } from '../model/QAAnswer'

export class QAClient {
  static async postQuestion(paperId: string, question: string): Promise<QAAnswer> {
    const query: QAQuery = { id: paperId, question }
    return (await AxiosObj.post('/qa/question', { query }, {})).data
  }
}
