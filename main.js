import Vue from 'vue'
import App from './App'
import api from 'mock/index.js' //模拟数据
import store from './store'

import basics from './pages/basics/home.vue'
Vue.component('basics', basics)

import components from './pages/component/home.vue'
Vue.component('components', components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin', plugin)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(api[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	json,
	prePage
};
app.$mount()
