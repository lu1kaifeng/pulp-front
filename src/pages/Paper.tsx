import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PaperNavbar } from '../components/paper-viewer/PaperNavbar'
import { PaperViewer } from '../components/paper-viewer/PaperViewer'
import { PaperMeta } from '../model/PaperMeta'
import { QAClient } from '../client/QAClient'

export const Paper: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const [paperMeta, setPaperMeta] = useState<PaperMeta | null>(null)
  useEffect(() => {
    (async ()=>{
      setPaperMeta(await QAClient.getPaperMeta(paperId))
    })()
  }, [paperId])
  return (
    <Fragment>
      <PaperNavbar meta={paperMeta} >
        <PaperViewer id={paperId} src={`https://arxiv.org/pdf/${paperId}.pdf`} />
      </PaperNavbar>
    </Fragment>
  )
}
