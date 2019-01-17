import React, { Component } from 'react';
import './App.scss';
import { HashRouter, Route } from 'react-router-dom';
import { FixedLoading } from './components';
// 按路由拆分代码
import Loadable from 'react-loadable';
const loadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <FixedLoading tip="页面加载中..." size="large"></FixedLoading>;
  } else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    return null;
  }
};
const Login = Loadable({
  loader: () => import('./views/Login/Login'),
  loading: loadingComponent
});
const Register = Loadable({
  loader: () => import('./views/Register'),
  loading: loadingComponent
});
const Projects = Loadable({
  loader: () => import('./views/Projects/Projects'),
  loading: loadingComponent
});
const Api = Loadable({
  loader: () => import('./views/Api'),
  loading: loadingComponent
});
const Home = Loadable({
  loader: () => import('./views/Home/Home'),
  loading: loadingComponent
});
const Feedback = Loadable({
  loader: () => import('./views/Feedback/Feedback'),
  loading: loadingComponent
});
const ProjectMenbers = Loadable({
  loader: () => import('./views/ProjectMenbers'),
  loading: loadingComponent
});
const Handbook = Loadable({
  loader: () => import('./views/Handbook/Handbook'),
  loading: loadingComponent
});
class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Route exact path="/" component={Login}></Route>
        </HashRouter>
        <HashRouter><Route path="/register" component={Register}></Route></HashRouter>
        <HashRouter><Route path="/home" component={Home}></Route></HashRouter>
        <HashRouter><Route path="/projects" component={Projects}></Route></HashRouter>
        <HashRouter><Route path="/handbook" component={Handbook}></Route></HashRouter>
        <HashRouter><Route exact path="/project/:id" component={Api}></Route></HashRouter>
        <HashRouter><Route path="/project/:id/menber/:pname" component={ProjectMenbers}></Route></HashRouter>
        <HashRouter><Route path="/feedback" component={Feedback}></Route></HashRouter>
      </div>
    );
  }
}
export default App;
