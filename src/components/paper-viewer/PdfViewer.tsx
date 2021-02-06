import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { Container } from '@material-ui/core'
import { range } from 'lodash'
import styles from './PaperViewer.module.scss'

// eslint-disable-next-line react/prop-types
export const PdfViewer: React.FC<{ scale: number }> = ({ scale }) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null)
  // eslint-disable-next-line no-console
  useEffect(() => {
    const fetchData = async () => {
      const arrBuf = new Uint8Array(
        await (
          await fetch('https://arxiv.org/pdf/1701.00145.pdf')
        ).arrayBuffer()
      )
      setPdfFile(arrBuf)
    }
    fetchData()
  }, [])

  return (
    <Container fixed>
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
            return <Page scale={scale} className={styles.page} pageNumber={p} />
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
}
