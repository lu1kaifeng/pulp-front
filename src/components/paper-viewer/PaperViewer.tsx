import React, { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'

export const PaperViewer: React.FC = () => {
  const [pageNumber] = useState(1)
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
      // eslint-disable-next-line global-require
    }
    fetchData()
  }, [])
  return (
    <div>
      {pdfFile !== null ? (
        <Document file={{ data: pdfFile }} options={{workerSrc: "pdf.worker.js"}}>
          <Page pageNumber={pageNumber} />
        </Document>
      ) : (
        <div />
      )}
    </div>
  )
}
