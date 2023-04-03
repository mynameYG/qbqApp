<template>
	<view class="onePage">
		<view class="operate-btn">
			<view class="operate-item" v-for="(item,i) in areas" :key="i" @click="jump(`/PProperty/pages/service/clapper-type?areas=${item.value}`)">
				<text class="operate-text">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				areas:[],
			}
		},
		mounted(){
			this.init()
		},
		methods: {
			init(){
				this.getArea();
			},
			getArea(){
				this.$http.get(`/mobile/event/areas`).then(res => {
					this.areas = res;
				})
			}
		}
	}
</script>

<style lang="scss">
	.onePage{
		overflow: hidden;
		.operate-btn{
			width: 60%;
			margin:0 auto;
		}
		.operate-item{
			height: 86px;
			margin-top: 30px;
			position: relative;
			border-radius: 10px;
			overflow: hidden;
			&:nth-child(1){
				background: url(../../static/img/clapper-bg1.png) no-repeat center;
				background-size: 100% 100%;
			}
			&:nth-child(2){
				background: url(../../static/img/clapper-bg2.png) no-repeat center;
				background-size: 100% 100%;
			}
			.operate-text{
				position: absolute;
				top:50%;
				left:50%;
				transform: translate(-50%,-50%);
			}
		}
	}
</style>
