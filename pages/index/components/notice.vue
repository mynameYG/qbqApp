<template>
	<view>
		<view class="notice-item mb10 flex" v-for="(item, i) in noticeList" :key="i" v-show="i < 3" @click="navTo(item)">
			<view class="flex1">
				<view class="field-title text-ellipsis"><text class="iconfont icon-tongzhi"></text>{{item.title}}</view>
				<view class="field-con flex1 text-ellipsis">{{dateFilter(item.releaseDate || item.createTime,'date')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'notice',
		props: {
			noticeList: {
				type: Array,
				default: () => []
			},
			type:""
		},
		data() {
			return {
				
			}
		},
		methods:{
			navTo(item){
				this.$emit("detailLink", item ,this.type);
			}
		}
	}
</script>

<style lang="scss">
	$font12: 24upx;
	$font13: 26upx;
	$font14: 28upx;
	$font15: 30upx;
	$font16: 32upx;
	$font17: 34upx;
	$font18: 36upx;
	$color333: #333;
	$color666: #666;
	$color999: #999;
	$colorfff: #fff;
	$colormain: #1B6EE6;
	.notice-item{
		padding-left: 20upx;
		padding-right: 20upx;
		.iconfont {
			margin-right:12upx;
			color:#BFBFBF;
			font-size: $font14;
		}
		.icon-point,.icon-falvfagui{
			vertical-align: 6upx;
		}
	}
	.field-title {
		font-size: $font14;
		color: $color333;
		line-height: 48upx;
	}
	.field-con {
		padding-left: 38upx;
		font-size: $font12;
		color: $color666;
		line-height: 48upx;
	}
	.field-light {
		font-size: $font14;
		color: $color999;
		line-height: 48upx;
	}
	
</style>