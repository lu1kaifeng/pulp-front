import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Container,
  makeStyles,
} from '@material-ui/core'
import { ZoomIn, ZoomOut } from '@material-ui/icons'
import { PdfViewer } from './pdf-viewer/PdfViewer'
import { QAAnswer } from '../../model/QAAnswer'

export const PaperViewer: React.FC<{ src: string; id: string }> = ({
  // eslint-disable-next-line react/prop-types
  src,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,react/prop-types
  id,
}) => {
  const [scale, SetScale] = useState(1)
  const [answer] = useState<QAAnswer|null>(null)
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
      <PdfViewer answer={answer} src={src} scale={scale} />
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

