import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Gltf from './pages/vr/gltf/index';
import Lobes from './pages/vr/lobes/index';
import Com from './pages/com/index';
import Vr from './pages/vr/index';
import Vtp from './pages/vr/vtp/index';
import VolumeRender from './pages/volume/volumeRender/index';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Vr} />
        <Route exact path="/gltf" component={Gltf} />
        <Route exact path="/vtp" component={Vtp} />
        <Route exact path="/lobes" component={Lobes} />
        <Route exact path="/com" component={Com} />
        <Route exact path="/volumeRender" component={VolumeRender} />
      </Switch>
    </Router>
  );
}
export default App;
