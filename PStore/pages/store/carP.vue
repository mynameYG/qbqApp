<template>
	<view class="map-wrap">
		<!-- #ifdef H5 || APP-PLUS -->
		<web-view ref="webView" :src="imp" class="webview"></web-view>
		<!-- #endif -->
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	var tMap;
	// #endif 
	export default {
		data() {
			return {
				id:"",
				longitude:this.$config.longitude,
				latitude:this.$config.latitude,
				markers: [],
				imp:'',
			}
		},
		onLoad(option) {
			let url = this.$config.url(`/app/collection`);
			url = encodeURIComponent(url);
			let sessionData = this.$store.state.user.token ? this.$store.state.user.token : '';
			this.imp = `/static/carP.html?url=${url}&session=${sessionData}&mapCenter=${this.$config.mapCenter}`+
			`&pageName=${option.pageName || ''}&destinationLat=${option.destinationLat || ''}&destinationLng=${option.destinationLng || ''}`+
			`&address=${option.address || ''}&phone=${option.phone || ''}`;
		}
	}
</script>

<style lang="scss">
	.map-wrap{
		width: 100%;
		// #ifdef APP-PLUS || MP-WEIXIN
		height: 100vh;
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		height: calc(100vh - 94px);
		// #endif
		position: relative;
	}
	.webview{
		width:100%;
		height: 100vh;
		overflow: hidden;
	}
	.iframe{
		width:100%;
		height: 100vh;
		overflow: hidden;
	}
</style>
