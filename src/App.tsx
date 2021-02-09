import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Paper } from './pages/Paper'

const App: React.FC = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/paper/:paperId" component={Paper} />
        </Switch>
    </BrowserRouter>
  )
}

export default App
