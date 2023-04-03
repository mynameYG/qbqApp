<template>
	<view class="carP">
		<view class="carP-inner">
			<view class="more" @tap="navToCarP">查看更多</view>
			<view class="title">附近停车场</view>
			<view class="map-wrap">
				<map class="maps" id="maps" ref="maps" :latitude="latitude" :longitude="longitude" :markers="covers"  scale="19" >
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'popup',
		props:{
			groupCode:""
		},
		data() {
			return {
				latitude:"",
				longitude:"",
				covers:[]
			}
		},
		mounted(){
			this.map = uni.createMapContext("maps", this);
			this.getLocation();
		},
		methods: {
			// 获取定位
			getLocation() {
				let _self = this;
				uni.getLocation({
				    type: 'gcj02',
					geocode:true,
				    success: function (res) {
						//console.log('res--------',res.address.length)
				        console.log('经度：' + res.longitude);
				        console.log('纬度：' + res.latitude);
						_self.longitude =  res.longitude;
						_self.latitude =  res.latitude;
						// _self.longitude =  113.543351;
						// _self.latitude =  34.793475;
						_self.covers = [];
						_self.covers.push({
							width: 25,
							height: 30,
							longitude:_self.longitude,
							latitude: _self.latitude,
							iconPath: '../../../static/img/location.png',
						});
						_self.map.moveToLocation({
							longitude:_self.longitude,
							latitude:_self.latitude
						})
						console.log('0')
						//_self.address = res.address.province + res.address.city +  res.address.district + res.address.street + (res.address.poiName || "");
						//console.log('_self.longitude',_self.longitude, _self.info.address)
					},
					fail() {
						uni.showToast({
							title: '找不到您的位置，请开启定位',
							icon: 'none'
						})
					}
				});
			},
			navToCarP(){
				this.jump(`/PStore/pages/store/carP?pageName=附近停车场`)
			}
		}
	}
</script>

<style lang="scss">
	.carP{
		padding:30upx;
		padding-bottom: 0;
		.carP-inner{
			padding:30upx;
			background-color:#fff;
			box-shadow:0 0 6px #e4e4e4;
			border-radius: 16upx;
			position: relative;
			.more{
				position: absolute;
				right: 30upx;
				color: #1B6EE6;
			}
		}
		.title{
			font-weight:600;
			font-size:30upx;
			color:#333;
		}
	}
	.map-wrap{
		margin:10px 0;
		overflow: hidden;
		height: 130px;
		position: relative;
	}
	/* #ifdef MP-WEIXIN */
		.maps{
			width: 100%;
			height: 100%
		}
	/* #endif */
	/deep/ uni-map{
		width: 100%;
		height: 100%
	}
</style>
