import React, { PropsWithChildren } from 'react'
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
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);


export const QAInput: React.FC<PropsWithChildren<{ onClose: () => void }>> = ({
                                                                                // eslint-disable-next-line react/prop-types
  onClose,
}) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} square component="form" className={classes.root}>
  <IconButton className={classes.iconButton} aria-label="menu" onClick={onClose}>
    <ChevronRightIcon />
    </IconButton>
    <InputBase
  className={classes.input}
  placeholder="Ask A Question"
  inputProps={{ 'aria-label': 'Ask A Question' }}
  />
  <IconButton type="submit" className={classes.iconButton} aria-label="search">
    <SearchIcon />
    </IconButton>
    </Paper>
);
}
