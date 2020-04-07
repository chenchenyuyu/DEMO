import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Vr from './pages/vr/index';
import Lobes from './pages/vr/lobes/index';

import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Vr} />
        <Route exact path="/lobes" component={Lobes} />
      </Switch>
    </Router>
  );
}
export default App;
