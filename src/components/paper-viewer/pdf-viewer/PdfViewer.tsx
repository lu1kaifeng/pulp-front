import React, { RefObject, useEffect, useState } from 'react'
import { Document, Page,pdfjs } from 'react-pdf'
import { Box, Container} from '@material-ui/core'
import { range } from 'lodash'
import './PaperViewer.scss'
import ReactDOM from 'react-dom'
import { Answer} from '../../../model/QAAnswer'
import { SearchClient } from '../../../client/SearchClient'
import {minBy} from 'lodash'
pdfjs.GlobalWorkerOptions.workerSrc =require('pdfjs-dist/build/pdf.worker.min.js').default
// eslint-disable-next-line react/prop-types
export const PdfViewer: React.FC<{ scale: number; src: string; onRenderSuccess:(helper: PdfTextHighLightHelper)=>void }> = React.memo(({
  // eslint-disable-next-line react/prop-types
  scale,
  // eslint-disable-next-line react/prop-types
  src,
                                                                                                                                                  onRenderSuccess,// eslint-disable-next-line react/prop-types
}) => {
  const [pageNumber, setPageNumber] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let loadedPage = 0
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null)
  const pageRefs: any[] = []
  const textSpans: any[] = []
  // eslint-disable-next-line no-console
  useEffect(() => {
    const fetchData = async () => {
      const arrBuf = new Uint8Array(await (await fetch(src)).arrayBuffer())
      setPdfFile(arrBuf)
    }
    fetchData()
  }, [])

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
    textLayers.forEach(layer => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { style } = layer;
      style.left="50%"
    });
  }

  return (
    <Box display="flex" justifyContent="center">
    <Container className="react-pdf">
      {pdfFile !== null ? (
        <Document
          file={{ data: pdfFile }}
          renderMode="svg"
          onLoadSuccess={(pdf) => {
            setPageNumber(pdf.numPages)
          }}
        >
          {pageNumber !== 0 ? (
            range(1, pageNumber + 1).map((p) => {
              return (
                <Page
                  renderAnnotationLayer={false}
                  className="page"
                  ref={(ref) => {
                    pageRefs[p] = ref
                  }}
                  scale={scale}
                  onLoadSuccess={removeTextLayerOffset}
                  onRenderSuccess={() => {
                    // eslint-disable-next-line @typescript-eslint/naming-convention

                    // @ts-ignore
                    // eslint-disable-next-line react/no-find-dom-node
                    const textSpan = ReactDOM.findDOMNode(
                      pageRefs[p]
                      // @ts-ignore
                    )!!.getElementsByClassName(
                      'react-pdf__Page__textContent'
                    )[0].children
                    console.log(pageRefs)
                    textSpans.push({ page: p, span: textSpan })
                    loadedPage += 1
                    if (pageNumber !== 0 && loadedPage === pageNumber) {
                        onRenderSuccess(new PdfTextHighLightHelper(textSpans))
                      }
                  }}
                  pageNumber={p}
                />
              )
            })
          ) : (
            <div />
          )}
        </Document>
      ) : (
        <div />
      )}
    </Container>
    </Box>
  )
},(prevProps, nextProps)=>prevProps.src === nextProps.src && prevProps.scale === nextProps.scale)

PdfViewer.defaultProps = {
  scale: 1.0
}
export type PageSpan = {page:number,span:HTMLCollection}
export type SubStringPosition = {start:number,end:number,span: Element}
export type HighLightHandle = {span:Element,original:string}[]
export class PdfTextHighLightHelper {
  private pos: SubStringPosition[] = []
  private readonly text: string = ''

  constructor(pageSpans: PageSpan[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pp of pageSpans) {
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (let i = 0; i < pp.span.length; i += 1) {
        const preLen = this.text.length
        this.text += pp.span[i].textContent!!.replace(/\W/g, ' ') // second console output
        this.pos.push({
          start: preLen,
          end: this.text.length,
          span: pp.span[i],
        })
      }

    }
  }

  public async highLight(answer: Answer):Promise<HighLightHandle> {
    if(answer !== null && answer.context !== null){
      const toSearch = answer.context.replace(/\W/g, ' ')
      const response = await SearchClient.postSearch({ max_l_dist: 32, query: [toSearch], 'text': this.text })
      const from = response[0].start
      const to = response[0].end
      const toHightlight = []
      if (from !== -1) {
        for (const ss of this.pos) {
          if (ss.start > from && ss.end < to) {
            toHightlight.push(ss.span)
          }
          if (ss.start < from && ss.end > from) {
            toHightlight.push(ss.span)
          }
          if (ss.start < to && ss.end > to) {
            toHightlight.push(ss.span)
          }
        }
      }
      const handle: HighLightHandle = []
      for (const spa of toHightlight) {
        handle.push({ original: spa.innerHTML, span: spa })
        spa.innerHTML = `<mark>${spa.innerHTML}</mark>`
      }
      // @ts-ignore
minBy(toHightlight,(m:Element)=>m.getBoundingClientRect().top).scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      })
      return handle
    }
    return []
  }
  public removeHighLight(handle: HighLightHandle){
    for (const spa of handle) {
      spa.span.innerHTML = spa.original
    }
  }
}
