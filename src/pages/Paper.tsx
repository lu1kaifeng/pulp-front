import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { PaperNavbar } from '../components/paper-viewer/PaperNavbar'
import { PaperViewer } from '../components/paper-viewer/PaperViewer'

export const Paper: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  console.log(paperId)
  return (
    <Fragment>
      <PaperNavbar >
        <PaperViewer id={paperId} src={`https://arxiv.org/pdf/${paperId}.pdf`} />
      </PaperNavbar>
    </Fragment>
  )
}
