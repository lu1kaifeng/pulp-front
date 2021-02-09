import { AxiosObj } from './AxiosObj'
import { QAQuery } from '../model/QAQuery'
import { QAAnswer } from '../model/QAAnswer'
import { PaperMeta } from '../model/PaperMeta'

export class QAClient {
  static async postQuestion(paperId: string, question: string): Promise<QAAnswer> {
    const query: QAQuery = { id: paperId, question }
    return (await AxiosObj.post('/qa/question', { query }, {})).data
  }

  static async getPaperMeta(paperId: string): Promise<PaperMeta> {
    return (await AxiosObj.get(`/paper/${paperId}`, {})).data
  }
}
