// // import './assets/index.css'
// // import './assets/index.less'
require('!style-loader!css-loader!less-loader!./assets/index.less');
require('!style-loader!css-loader!./assets/index.css');
// console.log('callme');
import Vue from 'vue'
import App from './app'

new Vue({
    render: h => h(App)
}).$mount('#app')