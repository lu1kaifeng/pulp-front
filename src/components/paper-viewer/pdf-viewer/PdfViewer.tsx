import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { Container } from '@material-ui/core'
import { range } from 'lodash'
import './PaperViewer.scss'

// eslint-disable-next-line react/prop-types
export const PdfViewer: React.FC<{ scale: number; src: string }> = ({
  // eslint-disable-next-line react/prop-types
  scale,
  // eslint-disable-next-line react/prop-types
  src,
}) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null)
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
          {range(1, pageNumber + 1).map((p) => {
            return <Page className="page" scale={scale} pageNumber={p} />
          })}
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
