<template>
	<view>
		<!-- #ifdef APP-PLUS || H5 -->
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">
			{{ list.key }}
			</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
			<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
				<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">
					<text>{{ list.key }}</text>
				</text>
			</view>
		<!-- #endif -->
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list clearfix">
			<view class="index-nav-item tc" v-for="(item, index) in list.items" :key="index"  @click="navTo(item)">
				<view class="index-nav-bg">
					<i class="iconfont" :class="item.icon"></i>
				</view>
				<view class="index-nav-text">{{ item.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			},
			navTo(item){
				//console.log('item',item)
				if(!item.url){
					this.tips();
					return;
				}
				if(item.type == 'webPage'){
					this.jumpWebPage(item.url)
					return;
				}
				uni.navigateTo({
					url: item.url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: #ffffff;
		/* #ifndef APP-NVUE */
		// display: flex;
		/* #endif */
		// flex-direction: column;
	/* 	border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #e5e5e5; */
	}

	.uni-indexed-list__item {
		font-size: 16;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: 15px;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 15px;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #e5e5e5;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #fff;
	}

	.uni-indexed-list__title {
		flex:1;
		padding: 6px 12px;
		line-height: 24px;
		font-size: 12px;
		position: relative;
		text-align: center;
	}
	/deep/.uni-indexed-list__title span{
		background: #fff;
		padding:0 10px;
		position: relative;
		z-index: 0;
		font-size: 13px;
		font-weight: 550;
	}
	// #ifdef MP-WEIXIN
	/deep/ .uni-indexed-list__title text{
		background: #fff;
		padding:0 10px;
		position: relative;
		z-index: 0;
		font-size: 13px;
		font-weight: 550;
	}
	// #endif
	.uni-indexed-list__title::before{
		position: absolute;
		left:5%;
		top:50%;
		margin-top: -0.5px;
		content:"";
		width:90%;
		height: 1px;
		background-color: #EAEAEA;
	}
	.index-nav-item{
		margin-bottom: 10px;
		float: left;
		width: 33.33%;
		.index-nav-bg{
			.iconfont{
				color:#1B6EE6;
				font-size: 26px;
			}
		}
	}
	.index-nav-bg{
		display: inline-block;
		width:30px;
		height: 30px;
		border-radius: 50%;
		color: #fff;
		position: relative;
		i.iconfont{
			margin-top: 10px;
			display: block;
			font-size:26px;
			font-weight:500;
		}
	}
	.index-nav-text{
		line-height: 25px;
		font-size: 14px;
		color: #333;
	}
</style>