<template>
	<view class="map-wrap">
		<!-- #ifdef H5 -->
		<web-view ref="webView" :src="`/static/newMap.html?url=${url}&mapCenter=${mapCenter}&pageName=${name}&functionParam=${functionParam}`" class="webview"></web-view>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<web-view ref="webView" :src="imp" class="webview"></web-view>
		<!-- #endif -->
	
	</view>
</template>	
<script>
	export default {
		data() {
			return {
				id:"",
				longitude:this.$config.longitude,
				latitude:this.$config.latitude,
				destinationLat:"",
				destinationLng:"",
				markers: [],
				imp:'',
				mapCenter:[],
				url:"",
				name:"",
				functionParam:""
			}
		},
		
		onLoad(option) {
			console.log(option);
			this.name = option.name;
			this.functionParam = option.functionParam;
			this.currentLocation();
			this.url = this.$config.url(`/app/collection/list`);
			let sessionData = this.$store.state.user.token ? this.$store.state.user.token : '';
		},
		
		mounted() {
			
		},
		
		methods: {
			currentLocation(){
				var self = this;
				uni.getLocation({
					type: 'gcj02',
					success: function (res) {
						self.mapCenter = `${res.longitude},${res.latitude}`;
						console.log(self.mapCenter);
						// 34.793684, 113.544368
						self.destinationLat = res.latitude;
						self.destinationLng	= res.longitude;
						var center = self.gcj2bdString(self.mapCenter,"BAIDU");
						self.imp=`/static/newMap.html?url=${self.url}&mapCenter=${[center]}&pageName=${self.name}&functionParam=${self.functionParam}`
					}
				});
			},
			gcj2bdString(value, mapType) {
				console.log('value',value)
				if (mapType == 'BAIDU') {
					var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
					var ll = value.split(",");
					var x = ll[1], y = ll[0];
					console.log(x,y);
					var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
					var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
					return (z * Math.cos(theta) + 0.0065) + ',' + (z * Math.sin(theta) + 0.006);
				} else if (mapType == GAODE) {
					return value;
				}
			}
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
