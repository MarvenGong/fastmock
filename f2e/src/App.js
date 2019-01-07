import React, { Component } from 'react';
import './App.scss';
import { HashRouter, Route } from 'react-router-dom';

import PageLayout from './views/Layout/Layout';
import Login from './views/Login/Login';
import Register from './views/Register';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Route path="/login" component={Login}></Route>
        </HashRouter>
        <HashRouter>
          <Route path="/register" component={Register}></Route>
        </HashRouter>
        <HashRouter>
          <Route path="/" component={PageLayout}></Route>
        </HashRouter>
      </div>
    );
  }
}

export default App;
