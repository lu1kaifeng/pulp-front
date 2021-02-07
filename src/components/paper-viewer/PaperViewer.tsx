import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Container,
  makeStyles,
  TextField,
} from '@material-ui/core'
import { ZoomIn, ZoomOut } from '@material-ui/icons'
import { PdfViewer } from './pdf-viewer/PdfViewer'
import { QAClient } from '../../client/QAClient'

export const PaperViewer: React.FC<{ src: string; id: string }> = ({
  // eslint-disable-next-line react/prop-types
  src,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,react/prop-types
  id,
}) => {
  const [scale, SetScale] = useState(1)
  const useStyles = makeStyles((theme) => ({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }))

  const classes = useStyles()
  return (
    <Container>
      <TextField
        error
        id="filled-error"
        defaultValue=""
        variant="filled"
        onChange={async (event) => {
          console.log(await QAClient.postQuestion(id, event.target.value))
        }}
      />
      <PdfViewer src={src} scale={scale} />
      <ButtonGroup
        className={classes.fab}
        orientation="vertical"
        color="primary"
        aria-label="vertical contained primary button group"
        variant="contained"
      >
        <Button>
          <ZoomIn onClick={() => SetScale(scale + 0.25)} />
        </Button>
        <Button>
          <ZoomOut onClick={() => SetScale(scale - 0.25)} />
        </Button>
      </ButtonGroup>
    </Container>
  )
}

PaperViewer.defaultProps = {
  id: '1702.00045',
  src: 'https://arxiv.org/pdf/1702.00045.pdf',
}
