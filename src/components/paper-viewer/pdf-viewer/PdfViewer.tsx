import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { Container } from '@material-ui/core'
import { range } from 'lodash'
import './PaperViewer.scss'
import ReactDOM from 'react-dom'

// eslint-disable-next-line react/prop-types
export const PdfViewer: React.FC<{ scale: number; src: string }> = ({
  // eslint-disable-next-line react/prop-types
  scale,
  // eslint-disable-next-line react/prop-types
  src,
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

  return (
    <Container className="react-pdf">
      {pdfFile !== null ? (
        <Document
          file={{ data: pdfFile }}
          renderMode="svg"
          onLoadSuccess={(pdf) => {
            setPageNumber(pdf.numPages)
          }}
          options={{ workerSrc: 'pdf.worker.js' }}
        >
          {pageNumber !== 0 ? (
            range(1, pageNumber + 1).map((p) => {
              return (
                <Page
                  className="page"
                  ref={(ref) => {
                    pageRefs[p] = ref
                  }}
                  scale={scale}
                  onRenderSuccess={() => {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    function find_csa(arr: string | any[], subarr: string | any[], from_index: number) {
                      // eslint-disable-next-line no-bitwise
                      let i = from_index >>> 0
                      const sl = subarr.length
                      const l = arr.length + 1 - sl

                      // eslint-disable-next-line no-labels,no-restricted-syntax,no-plusplus
                      loop: for (; i < l; i++) {
                        // eslint-disable-next-line no-plusplus
                        for (let j = 0; j < sl; j++)
                          if (arr[i + j] !== subarr[j])
                            // eslint-disable-next-line no-continue,no-labels
                            continue loop
                        return i
                      }
                      return -1
                    }
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
                      const text = []
                      const pos = []
                      // eslint-disable-next-line no-restricted-syntax
                      for (const pp of textSpans) {
                        console.log(pp)
                        // eslint-disable-next-line no-restricted-syntax,guard-for-in
                        for (let i = 0; i < pp.span.length; i += 1) {
                          const preLen = text.length
                          text.push(...pp.span[i].innerText.split(/\s+/)) // second console output
                          pos.push({
                            start: preLen,
                            end: text.length,
                            span: pp.span[i],
                          })
                        }
                      }
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      const to_search = 'Aggregation of Holistically-Nested Convolutional Neural Networks for Automated Pancreas Localization and'.split(
                        /\s+/
                      )
                      const from = find_csa(text,to_search,0)
                      const to = from + to_search.length
                      const toHightlight = []
                      // eslint-disable-next-line no-restricted-syntax
                      for(const ss of pos){
                          if(ss.start > from && ss.end < to){
                            toHightlight.push(ss.span)
                          }
                        if(ss.start < from && ss.end > from){
                          toHightlight.push(ss.span)
                        }
                        if(ss.start < to && ss.end > to){
                          toHightlight.push(ss.span)
                        }
                      }

                      // eslint-disable-next-line no-restricted-syntax
                      for(const spa of toHightlight){
                        spa.innerHTML = `<mark>${spa.innerHTML}</mark>`
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
  )
}

PdfViewer.defaultProps = {
  scale: 1.0,
  src: 'https://arxiv.org/pdf/1701.00145.pdf',
}
