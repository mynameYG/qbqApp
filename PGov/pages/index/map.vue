<template>
	<view class="map-wrap">
		<!-- #ifdef H5 || APP-PLUS -->
		<web-view ref="webView" :src="imp" class="webview"></web-view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- 搜索 -->
		<map id="map"  class="map" :latitude="latitude" :longitude="longitude" :markers="markers"
		scale="15" 
		:circles="circles"
		@markertap="markertap"
		>
		</map>
		<view v-if="viewshow" class="showData">
			<view class="uni-flex uni-row">
				<view class="text-ellipsis">
					<text style="font-weight: 600;">{{marker.customData.title || ''}}</text>
				</view>
				<view class="iconfont icon-guanbi"  @click="closeshow"></view>
			</view>
			<view class="uni-flex uni-row text-ellipsis" style="-webkit-flex: 1;flex: 1;">
				<text>电话：</text>
				<text>{{marker.customData.phone || ''}}</text>
			</view>
			<view class="uni-flex uni-row text-ellipsis" style="-webkit-flex: 1;flex: 1;">
				<text>地址：</text>
				<text>{{marker.customData.address || ''}}</text>
			</view>
			<text class='more' v-if="moreDome" @tap="more(marker)">更多信息>></text>
			<text class="daohang" @tap="daohang(marker)">到这去>></text>
			<!-- <view class="uni-flex uni-row" style="-webkit-flex: 1;flex: 1;">
				<text>作者：</text>
				<text>{{marker}}</text>
			</view> -->
		</view>
		
		
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
				// #ifdef MP-WEIXIN
				mapObj: {},
				circles:[],
				marker:{},
				viewshow: false,
				moreDome:false,
				//#endif
			}
		},
		onLoad(option) {
			console.log('onLoad')
			let url = this.$config.url(`/app/collection`);
			url = encodeURIComponent(url);
			let sessionData = this.$store.state.user.token ? this.$store.state.user.token : '';
			this.imp = `/static/indexMap.html?url=${url}&session=${sessionData}&mapCenter=${this.$config.mapCenter}&pageName=${option.pageName}&inputText=${option.type}
					&channelName=${option.channelName}&destinationLat=${option.destinationLat}&destinationLng=${option.destinationLng}&address=${option.address}&phone=${option.phone}
			`;
			// #ifdef MP-WEIXIN
			this.marker = {
				lng:option.destinationLng - 0,
				lat:option.destinationLat - 0,
				customData:{
					title:option.pageName,
					phone:option.phone?option.phone:"",
					address:option.address?option.address:""
				}
			}
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
			// #endif
			
		},
		onShow(){
			// #ifdef MP-WEIXIN
			tMap =new this.TMap({key:'Y74BZ-B33CU-LDOVJ-2FAJI-4BMDE-2DB4D'});
			console.log('tMap',tMap)
			// #endif
		},
		mounted() {
			// #ifdef MP-WEIXIN
			// this.getUserLocation();
			this.addMarker();
			// #endif
		},
		methods: {
		// #ifdef MP-WEIXIN
			//获取用户位置
			getUserLocation() {
				let _self = this;
				uni.getLocation({
					type: 'gcj02',
					geocode:true,
					success: function (res) {
						console.log('res--------',res)
						// console.log('经度：' + res.longitude);
						// console.log('纬度：' + res.latitude);
						_self.longitude =  res.longitude;
						_self.latitude =  res.latitude;
						_self.markers = [];
						_self.markers.push({
							id:'01my',
							width: 25,
							height: 25,
							longitude: _self.longitude,
							latitude: _self.latitude,
							iconPath: '../../../static/img/locationMy.png',
						});
						_self.addCircles(_self.latitude,_self.longitude);
					},
					fail() {
						uni.showToast({
							title: '找不到您的位置，请开启定位',
							icon: 'none'
						})
					}
				});
			},
			addCircles(lat,lng){
				this.circles = [{
					latitude:lat,
					longitude: lng,
					radius: 1200,
					strokeWidth: 3,
					strokeStyle:"dashed",
					color: '#ff0000',
					fillColor:"transparent"
				},
				{
					latitude:lat,
					longitude: lng,
					radius: 800,
					strokeWidth: 3,
					strokeStyle:"dashed",
					color: '#0084ff',
					fillColor:"transparent"
				},
				{
					latitude:lat,
					longitude: lng,
					radius: 500,
					strokeWidth: 3,
					strokeStyle:"dashed",
					color: '#ff7200',
					fillColor:"transparent"
				}]
			},
			numFilter(value) {
				// 截取当前数据到小数点后三位
				let tempVal = parseFloat(value).toFixed(7)
				let realVal = tempVal.substring(0, tempVal.length - 1)
				return realVal
			},
			markertap(e) {
				this.viewshow = !this.viewshow;
			},
			addMarker(){
				let _this = this;
				console.log('this.marker',this.marker)
				this.markers.push({	//往里面添加循环数据
						id: 0,
						latitude: this.marker.lat - 0,
						longitude: this.marker.lng - 0,
						iconPath: "../../../static/img/location.png",
						width: 25,
						height: 30,
						customData: {
							title: this.marker.customData.title,
							phone: this.marker.customData.phone,
							address: this.marker.customData.address
						}
				});
				
				this.mapObj = uni.createMapContext("map", this);   // 得到map对象
				let marker = this.markers.find(item => {return item.id == 0});
				this.mapObj.moveToLocation({
					latitude: marker.latitude,
					longitude: marker.longitude
				});	//移动到当前定位地点
				setTimeout(() =>{
					this.viewshow = true;
				},1500)
			},
			closeshow() {
				this.viewshow = !this.viewshow;
				this.lastMarker = {};
				this.markerChangeColour();
			},
			daohang(marker){
				console.log('marker',marker)
				this.toMapAPP(marker.lat,marker.lng,marker.customData.title,marker.customData.address)
			},
			//打开第三方地图
			toMapAPP(latitude,longitude,name,address){
				// console.log(JSON.stringify(arguments));
				console.log('latitude' +latitude +'longitude' + longitude + 'name' +name)
				uni.openLocation({
					latitude: latitude - 0,
					longitude: longitude - 0,
					scale: 18,
					name:name,//地址名称
					address:address//地址详情
				})
			}
		// #endif
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
	// #ifdef MP-WEIXIN
	.map{
		width: 100%;
		height: 100vh;
	}
	.map-search{
		position: fixed;
		top:0;
		left:0;
		width:100%;
		z-index: 99;
		padding:10px;
		box-sizing: border-box;
		font-size:13px;
		background: rgba(255,255,255,.8);
	}
	.map-search input{
		display: inline-block;
		border: 1px solid #e4e4e4;
		padding: 4px 3px;
		border-radius: 5px;
		width: 75px;
		height: 25px;
		line-height: 25px;
		margin-right: 2px;
		font-size: 12px;
		box-sizing: border-box;
		background-color: #fff;
	}
	.map-search button{
		display: inline-block;
		background: #1B6EE6;
		color: #fff;
		border: 0;
		width:56px;
		height: 25px;
		line-height: 25px;
		border-radius: 3px;
		margin-right: 3px;
		font-size: 12px;
	}
	.typeWrap{
		z-index: 999;
		position: fixed;
		top: 46px;
		right: 10px;
		padding-bottom: 28px;
		.btn{
			position: absolute;
			bottom:0;
			left:0;
			min-height: 16px;
			margin-top: 0;
			border: 0;
			width: 70px;
			text-align: center;
			padding: 14px 0;
			border-radius: 3px;
			box-shadow: 0 0 6px #e4e4e4;
			background: url(../../../static/img/icon-up.png) #fff no-repeat center;
			background-size: 20px;
			font-size:0;
		}
	}
	.btn.down{
		transform: rotate(180deg);
		transition: all .3s ease;
	}
	.typeScroll{
		width: 70px;
		// #ifdef APP-PLUS ||  MP-WEIXIN
		max-height: calc(100vh - 378px);
		// #endif
		overflow-y: auto;
		.item{
			margin-top: 0;
			border: 0;
			width: 70px;
			text-align: center;
			padding: 6px 0;
			margin-bottom: 2px;
			border-radius: 3px;
			box-shadow: 0 0 6px #e4e4e4;
			background: #fff;
			font-size: 12px;
		}
		.current{
			color:#fff;
			background-color: #1B6EE6;
		}
	}
	.typeScroll.up{
		transition: all .3s ease;
		height: 38px;
		overflow: hidden;
	}
	.map_bottom {
		height: 90rpx;
		.map_text {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0px;
			margin: 20rpx 0;
			background: #fff;
			padding: 0 15px;
			width: 600rpx;

			.row1 {
				display: flex;
				align-items: center;
				text {
					margin: 5px 0;
					display: block;
					font-size: 16px;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.h1 {
					margin: 15px 0;
					font-size: 18px;
				}

				.h2 {
					margin-left: 15rpx;
					font-size: 14px;
					color: grey;
				}
			}
		}
	}
	#content{
		position: fixed;
		bottom:0;
		min-height: 33px;
		left:0;
		width:100%;
		z-index: 99;
		opacity: 1;
	}
	.icon:before{
		content: "";
		position: absolute;
		top:-10px;
		left:50%;
		width:30px;
		margin-left: -15px;
		height: 4px;
		border-radius: 3px;
		background-color: rgba(153,153,153,.6)
	}
	#result-list{
		width:100%;
		margin:0;
		padding:0;
		box-sizing: border-box;
		overflow:hidden;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
		border-radius: 5px;
		} 
	#result-list .list-item {
		position: relative;
		width:100%;
		border-bottom:1px solid #FAFAFA
	}
	#result-list .list-item .inner{
		padding:15px;
		padding-top: 8px;
		padding-bottom: 8px;
		background-color: #fff;
		font-size:12px;
	}
	#result-list .list-item.current .inner{
		background-color: #fff0f0;
	}
	#result-list .list-item  .inner view{
		margin:0;
		padding:0;
		line-height:1.6;
		color: #666;
	}
	#result-list .list-item  .inner .title{
		font-weight: 600;
	}
	#result-list .list-item .inner .distance{
		position: absolute;
		top:9px;
		right:10px;
	}
	#content.result #result-list{
			height: 0;
			transition:all 0.3s ease;
		}
		.result:before{
			position: absolute;
			top:-13px;
			left:50%;
			border-radius: 3px;
			content: '';            
			display: block;    
			margin-left:-7px;
			width:15px;            
			height:15px;    
			background-color: transparent;
			border-right: 4px solid rgba(153,153,153,.6);            
			border-top:4px solid rgba(153,153,153,.6);            
			-webkit-transform: rotate(315deg); /*箭头方向可以自由切换角度*/            
			transform: rotate(315deg);
		}
	.search-result{
		margin:0;
		padding:10px 15px;
		font-size: 12px;
		background:rgba(255,255,255,.6);
		text-align: center;
	}
	.search-result .inputText{
		display: inline-block;
		vertical-align: -3px;
		// #ifdef MP-WEIXIN
		vertical-align: -4px;
		 // #endif
		color:#1B6EE6;
		font-weight: 600;
		max-width: 90px;
		overflow: hidden;
	}
	.num{
		color:#1B6EE6;
		font-weight: 600;
	}
	
	.showData {
		padding-bottom:5px;
		top: 50%;
		position: absolute;
		left: 50%;
		width: 60%;
		color: #000000;
		background-color: #ffffff;
		font-size: 12px;
		transform: translate(-60%,-138%);
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
		}
	.showData:before{
		position:absolute;
		content:'';
		bottom:0;
		left: 60%;
		position: absolute;
		height: 0;
		width: 0;
		border: solid transparent;
		pointer-events: none;
		border-width: 7px;
		margin-left: -8px;
		border-top-color: #fff;
		top: 100%;
	}
	.showData .daohang {
		padding-right: 10px;
		float:right;
		font-size:14px;
		color:#1B6EE6;
		text-align:right;
	}
	.showData .more{
		float:left;
		display: inline-block;
		padding-left: 10px;
		font-size:14px;
		color:#1B6EE6;
		text-align:left;
	}	
	.showData .iconfont{
		position: absolute;
		top: 2px;
		right: 3px;
	}
	.uni-row{
		width: 90%;
		margin: 5px auto!important;
		line-height:20px
	}
	.uni-row > text:last-child {
		color: gray;
		width: 67%;
	}
	.close{
		width: 15px;
		height:15px;
		margin-top: -10rpx;
		margin-right:-30rpx;
	}
	// #endif
</style>
