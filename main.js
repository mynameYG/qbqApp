import Vue from 'vue'

import App from './App'
import store from './store'
import http from '@/util/http'
import hasPermission from '@/util/hasPermission'
import config from '@/config.js'
import attachmentCheck from '@/components/attachment/attachment-check.vue'
import attachmentUpload from "@/components/attachment/attachment-upload.vue"
import tkiFileManager from "@/components/tki-file-manager/tki-file-manager.vue"
import uniSearchBar from '@/components/uni-components/uni-search-bar/uni-search-bar.vue'

// #ifdef MP-WEIXIN
//引入腾讯地图SDK
import TMap from '@/common/qqmap-wx-jssdk.js'
Vue.prototype.TMap = TMap
// #endif
Vue.component("attachmentCheck", attachmentCheck)
Vue.component("attachmentUpload", attachmentUpload)
Vue.component("tki-file-manager", tkiFileManager)
Vue.component("uni-search-bar", uniSearchBar)
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$config = config
Vue.prototype.$http = http

Vue.mixin({
	methods: {
		hasPermission,
		fileUrl(url, width) {
			return width ? config.serverHost + url + "?_max_width=" + width : config.serverHost + url
		},
		fileRUrl(url) {
			return config.url('/r/' + url);
		}
	}
})

import util from '@/util/util.js'
for(var p in util){
	Vue.prototype[p] = util[p]
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
