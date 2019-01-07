import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HttpUtils from './utils/HttpUtils';
import * as serviceWorker from './serviceWorker';
import 'toastr/build/toastr.css';
import { message } from 'antd';
window.http = new HttpUtils(App);
message.config({
  duration: 2
});
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
