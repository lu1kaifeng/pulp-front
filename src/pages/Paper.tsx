import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PaperNavbar } from '../components/paper-viewer/PaperNavbar'
import { PaperMeta } from '../model/PaperMeta'
import { QAClient } from '../client/QAClient'
import { PaperViewer } from '../components/paper-viewer/PaperViewer'
import { Answer } from '../model/QAAnswer'


export const Paper: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const [paperMeta, setPaperMeta] = useState<PaperMeta | null>(null)
  const [highLight,setHighLight] = useState<Answer | null>(null)
  useEffect(() => {
    (async ()=>{
      setPaperMeta(await QAClient.getPaperMeta(paperId))
    })()
  }, [paperId])
  return (
    <Fragment>
      <PaperNavbar id={paperId} meta={paperMeta} onHighLight={(a)=>setHighLight(a)} >
        <PaperViewer id={paperId} src={`https://arxiv.org/pdf/${paperId}.pdf`}  onRenderSuccess={(h)=>{if(highLight !== null)h.highLight(highLight)}}/>
      </PaperNavbar>
    </Fragment>
  )
}
