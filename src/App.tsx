import React,{Suspense} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const About = React.lazy(() => import('./pages/About'))
const Home = React.lazy(() => import('./pages/Home'))
const Paper= React.lazy(() => import('./pages/Paper'))
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/paper/:paperId" component={Paper} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
