import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PaperNavbar } from '../components/paper-viewer/PaperNavbar'
import { PaperMeta } from '../model/PaperMeta'
import { QAClient } from '../client/QAClient'



export default function Paper() {
  const { paperId } = useParams<{ paperId: string }>()
  const [paperMeta, setPaperMeta] = useState<PaperMeta | null>(null)
  useEffect(() => {
    (async ()=>{
      setPaperMeta(await QAClient.getPaperMeta(paperId))
    })()
  }, [paperId])
  return (
    <Fragment>
      <PaperNavbar id={paperId} meta={paperMeta}/>

    </Fragment>
  )
}
