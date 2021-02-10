import React, { PropsWithChildren, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ChevronRightIcon from '@material-ui/icons/ChevronRight'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0px 0px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);


export const QAInput: React.FC<PropsWithChildren<{ onClose: () => void,onSearch:(q:string)=>void }>> = ({
                                                                                // eslint-disable-next-line react/prop-types
  onClose,onSearch
}) => {
  const classes = useStyles();
  const [question,setQuestion] = useState<string | null>(null)
  return (
    <Paper elevation={0} square component="div" className={classes.root}>
  <IconButton aria-label="menu" onClick={onClose}>
    <ChevronRightIcon />
    </IconButton>
    <InputBase
  className={classes.input}
  value={question}
  placeholder="Ask A Question"
  inputProps={{ 'aria-label': 'Ask A Question' }}
  onChange={(e)=>{setQuestion(e.target.value)}}
  />
  <IconButton disabled={question===null || question.trim().length === 0} onClick={()=>onSearch(question!!)} aria-label="search">
    <SearchIcon />
    </IconButton>
    </Paper>
);
}
