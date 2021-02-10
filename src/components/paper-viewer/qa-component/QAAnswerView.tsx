import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import { range } from 'lodash'
import Skeleton from '@material-ui/lab/Skeleton'
import { Answer, QAAnswer } from '../../../model/QAAnswer'
import { QAClient } from '../../../client/QAClient'

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails)

export const QAAnswerView: React.FC<{
  id: string
  question: string | null
  // eslint-disable-next-line react/prop-types
}> = ({ id, question }) => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1')
  const [answer, setAnswer] = useState<QAAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    ;(async () => {
      if (question !== null) {
        setLoading(true)
        setAnswer(await QAClient.postQuestion(id, question))
        setLoading(false)
      } else {
        setAnswer(null)
      }
    })()
  }, [question])
  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false)
  }

  return !loading ? (
    <div>
      {answer !== null
        ? answer.answers.map((m: Answer, index: number) => {
            return (
              <Accordion
                square
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>
                    {m.answer !== null ? m.answer : 'No Answer'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{m.context}</Typography>
                </AccordionDetails>
              </Accordion>
            )
          })
        : (<div/>)
          }
    </div>
  ) : (
    <React.Fragment>
      {range(0, 5).map((i) => {
      return (
        <Skeleton  key={i}>
        <Accordion
          square>
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography>sSpatial Aggregation of Holistically-Nested Convolutional Neural Networks</Typography>
          </AccordionSummary>

        </Accordion>
        </Skeleton>
      )})}
    </React.Fragment>
  )
}
