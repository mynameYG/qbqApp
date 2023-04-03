<template>
	<view class="bg">
		<view class="example-body">
			<view class="grid-box" v-for="(item, index) in types" :index="index" :key="index" @tap="jump(`/PProperty/pages/service/clapper-add?area=${area}&type=${item.code}`)">
				<view class="grid-item-box">
					<text class="text">{{ item.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				types:[],
				area:"",
			}
		},
		onLoad(opt){
			this.area = opt.areas;
			console.log('this.area',this.area)
		},
		mounted(){
			this.init()
		},
		methods: {
			init(){
				this.getTypes();
			},
			getTypes(){
				this.$http.get(`/mobile/event/types?area=${this.area}`).then(res => {
					this.types = res;
					//console.log('this.types',this.types)
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		// background-color: #ffffff;
	}

	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}


	.example-body {
		flex-direction: column;
		padding: 15px;
		padding-left: 5px;
		// background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #1B6EE6;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}


	.image {
		width: 50rpx;
		height: 50rpx;
	}

	.text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
	.grid-box{
		float:left;
		padding-left: 10px;
		margin-bottom: 10px;
		width:33.33%;
		color:#fff;
		.grid-item-box{
			background-color:#27A9E3;
		}
		&:nth-child(1){
			.grid-item-box{
				background-color:#27A9E3;
			}
		}
		&:nth-child(2){
			.grid-item-box{
				background-color:#28B779;
			}
		}
		&:nth-child(3){
			.grid-item-box{
				background-color:#FFB848;
			}
		}
		&:nth-child(4){
			.grid-item-box{
				background-color:#DA542E;
			}
		}
		&:nth-child(5){
			.grid-item-box{
				background-color:#2255A4;
			}
		}
		&:nth-child(6){
			.grid-item-box{
				background-color:#28B779;
			}
		}
		&:nth-child(7){
			.grid-item-box{
				background-color:#27A9E3;
			}
		}
		&:nth-child(8){
			.grid-item-box{
				background-color:#F74D4D;
			}
		}
		&:nth-child(9){
			.grid-item-box{
				background-color:#1F262D;
			}
		}
		&:nth-child(10){
			.grid-item-box{
				background-color:#FFB848;
			}
		}
		&:nth-child(11){
			.grid-item-box{
				background-color:#28B779;
			}
		}
		&:nth-child(12){
			.grid-item-box{
				background-color:#27A9E3;
			}
		}
		&:nth-child(13){
			.grid-item-box{
				background-color:#2255A4;
			}
		}
		&:nth-child(14){
			.grid-item-box{
				background-color:#DA542E;
			}
		}
		
	}
	.grid-dynamic-box {
		margin-bottom: 15px;
	}
	.grid-item-box {
		flex: 1;
		/* position: relative;
*/
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}
</style>
