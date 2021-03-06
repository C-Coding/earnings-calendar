import React, { Component,PureComponent } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import 'moment/locale/zh-cn';

//为组件提供api指针
import api from './api';
Component.prototype.$api = api;
PureComponent.prototype.$api=api;



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
