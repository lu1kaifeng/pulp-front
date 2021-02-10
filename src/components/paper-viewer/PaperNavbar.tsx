import React, { useState } from 'react'
import clsx from 'clsx'
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import SearchIcon from '@material-ui/icons/Search'
import { Skeleton } from '@material-ui/lab'
import { PaperMeta } from '../../model/PaperMeta'
import { QAInput } from './qa-component/QAInput'
import { QAAnswerView } from './qa-component/QAAnswerView'
import { Answer } from '../../model/QAAnswer'

const drawerWidthLeft = 240
const drawerWidthRight = 300

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    title: {
      flexGrow: 1,
    },
    appBarShiftLeft: {
      width: `calc(100% - ${drawerWidthLeft}px)`,
      marginLeft: drawerWidthLeft,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    appBarShiftRight: {
      width: `calc(100% - ${drawerWidthRight}px)`,
      marginRight: drawerWidthRight,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    rightMenuButton: {
      float: 'right',
    },
    toolBar: {
      width: '100%',
    },
    hide: {
      display: 'none',
    },
    drawerLeft: {
      width: drawerWidthLeft,
      flexShrink: 0,
    },
    drawerPaperLeft: {
      width: drawerWidthLeft,
    },
    drawerRight: {
      width: drawerWidthRight,
      flexShrink: 0,
    },
    drawerPaperRight: {
      width: drawerWidthRight,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 0),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidthRight,
      marginLeft: -drawerWidthLeft,
    },
    contentShiftLeft: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    contentShiftRight: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
  })
)

export function PaperNavbar({
  children,
  meta,
  id,
  onHighLight
}: React.PropsWithChildren<{ meta: PaperMeta | null ,id: string,onHighLight:(a: Answer)=>void}>) {
  const classes = useStyles()
  const theme = useTheme()
  const [openLeft, setOpenLeft] = React.useState(false)
  const [question,setQuestion] = useState<string | null>(null)
  const [openRight, setOpenRight] = React.useState(false)

  const handleDrawerOpenLeft = () => {
    setOpenLeft(true)
  }

  const handleDrawerCloseLeft = () => {
    setOpenLeft(false)
  }
  const handleDrawerOpenRight = () => {
    setOpenRight(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDrawerCloseRight = () => {
    setOpenRight(false)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShiftLeft]: openLeft,
          [classes.appBarShiftRight]: openRight,
        })}
      >
        <Toolbar className={classes.toolBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpenLeft}
            edge="start"
            className={clsx(classes.menuButton, openLeft && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {meta == null ? <Skeleton /> : meta.meta.title}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpenRight}
            edge="end"
            className={clsx(classes.rightMenuButton, openRight && classes.hide)}
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawerLeft}
        variant="persistent"
        anchor="left"
        open={openLeft}
        classes={{
          paper: classes.drawerPaperLeft,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerCloseLeft}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <Divider />
        <List>
          <ListItem>
            <Typography variant="body2" gutterBottom>
              {meta?.text}
            </Typography>
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShiftLeft]: openLeft,
          [classes.contentShiftRight]: openRight,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
      <Drawer
        className={classes.drawerRight}
        variant="persistent"
        anchor="right"
        open={openRight}
        classes={{
          paper: classes.drawerPaperRight,
        }}
      >
        <div className={classes.drawerHeader}>
          <QAInput onClose={handleDrawerCloseRight} onSearch={(q)=>setQuestion(q)} />
        </div>

        <Divider />
          <QAAnswerView onHightLight={onHighLight} id={id} question={question}/>
      </Drawer>
    </div>
  )
}
