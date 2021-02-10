import React, { useEffect, useState } from 'react'
import { Document, Page,pdfjs } from 'react-pdf'
import { Box, Container} from '@material-ui/core'
import { range } from 'lodash'
import './PaperViewer.scss'
import ReactDOM from 'react-dom'
import { Answer} from '../../../model/QAAnswer'
import { SearchClient } from '../../../client/SearchClient'

pdfjs.GlobalWorkerOptions.workerSrc =require('pdfjs-dist/build/pdf.worker.min.js').default
// eslint-disable-next-line react/prop-types
export const PdfViewer: React.FC<{ scale: number; src: string;answer: Answer|null }> = ({
  // eslint-disable-next-line react/prop-types
  scale,
  // eslint-disable-next-line react/prop-types
  src,
                                                                                            // eslint-disable-next-line react/prop-types
  answer
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
  }, [src])

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
                    textSpans.push({ page: p, span: textSpan })
                    loadedPage += 1
                    if (pageNumber !== 0 && loadedPage === pageNumber) {
                      console.log(textSpans)
                      let text = ''
                      // @ts-ignore
                      const pos = []
                      // eslint-disable-next-line no-restricted-syntax
                      for (const pp of textSpans) {
                        // eslint-disable-next-line no-restricted-syntax,guard-for-in
                        for (let i = 0; i < pp.span.length; i += 1) {
                          const preLen = text.length
                          text+=pp.span[i].innerText.replace(/\W/g, ' ') // second console output
                          pos.push({
                            start: preLen,
                            end: text.length,
                            span: pp.span[i],
                          })
                        }
                      }


                      // eslint-disable-next-line react/prop-types
                      const searches = answer!==null?[answer].map((m)=>{
                        return m.context !== null ? m.context.replace(/\W/g, ' ') : ''
                      }) :[]
                      console.log(searches)
                      // eslint-disable-next-line no-restricted-syntax
                      for(const toSearch of searches) {
                        SearchClient.postSearch({ max_l_dist: 32, query: [toSearch], text }).then((response)=>{
                          const from = response[0].start
                          const to = response[0].end
                          const toHightlight = []
                          if(from !== -1) {


                            // @ts-ignore
                            // eslint-disable-next-line no-restricted-syntax
                            for (const ss of pos) {
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
                          // eslint-disable-next-line no-restricted-syntax
                          for(const spa of toHightlight){
                            spa.innerHTML = `<mark>${spa.innerHTML}</mark>`
                          }
                        })


                      }

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
}

PdfViewer.defaultProps = {
  scale: 1.0
}
