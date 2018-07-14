import React, { Component,PureComponent } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


//为组件提供api指针
import api from './api';
Component.prototype.$api = api;
PureComponent.prototype.$api=api;



// Map.prototype.map=function(fn){
//     let arr=[];
//     this.forEach(function(value,key,map){
//         arr.push(fn(value,key,map));
//     })
//     return arr;
// }



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
