<template>
	<view class="popup-wrap" v-if="popup">
		<view class="popup-box">
			<view class="popup-close" @click="cancle">
				<text class="iconfont icon-guanbi"></text>
			</view>
			<view class="popup-con">
				<view class="detail-item flex tc">
					<text class="coupon-title detail-label flex1 no-mr">领取优惠券</text>
				</view>
				<template v-if="couponList.length > 0">
					<view class="detail-item coupon-list-item" v-for="(item,index) in couponList" :key="index" :style="{height:ImageHeight + 'px'}">
						<view class="coupon-info flex flexmid">
							<view class="text"><text class="num"><text class="fh">&yen;</text>{{item.money}}</text>{{item.coupon}}</view>
							<view class="btn-wrap" @tap="lingqu">
								<view class="btn">立即领取</view>
							</view>
						</view>
						<image class="bg-img" src="@/PStore/static/img/coupon-list.png"  @load="getImgHeight">
					</view>	
				</template>
				<view v-else class="detail-item">
					<view class="emptyText">暂无优惠券</view>
				</view>
			<!-- 	<view class="popup-btn flex flexmid">
					<view class="popup-btn-item flex1">
						<button class="popup-cancle" @click="cancle">取消</button>
					</view>
					<view class="popup-btn-item flex1">
						<button class="popup-confirm" @click="confirm">确定</button>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'popup',
		props:{
			info:"",
			detailId:{
				type: String,
				default: () => ''
			}
		},
		data() {
			return {
				popup: false,
				ImageHeight:0,
				ImageWidth:0,
				couponList:[]
			}
		},
		mounted(){
			this.getInfo();
		},
		methods: {
			init(){
				this.popup = true;
			},
			cancle() {
				this.popup = false;
			},
			getImgHeight(e){
				let scale = e.detail.width/e.detail.height;
				const getSystemInfo = uni.getSystemInfoSync();
				let windowWidth = getSystemInfo.windowWidth;
				let windowHeight = Math.round((windowWidth - 100)/scale);
				if(windowHeight > this.ImageHeight){
					this.ImageHeight = windowHeight;
					this.ImageWidth = Math.round(this.ImageHeight * scale);
					console.log('this.ImageWidth’',this.ImageWidth)
				}
			},
			getInfo(){
				this.$http.get(`/app/collection/article/${this.detailId}`).then(res =>{
					
					// this.couponList = res.filter('优惠券')
					this.couponList = res.filter((item) =>{
						return /优惠券$/.test(item.title)
					});
					this.couponList.forEach(item => {
						let match = item.title.match(/^(\d+)(.*)/)
						item.money = match[1];
						item.coupon = match[2];
					})
					console.log(this.couponList);
				})
			},
			lingqu(e){
				setTimeout(()=>{
					this.popup = false;
					uni.showToast({title: "领取成功",icon: 'none'});
				},1000)
			},
			confirm() {
				var params = {};
				params = {
					id:this.info.infoId,
					evaluateResult:this.evaluateResult,
					evaluateContent:this.evaluateContent
				}
				console.log('params',params) 
				this.$http.put(`${this.info.putUrl}?id=${this.info.infoId}&evaluateResult=${this.evaluateResult}&evaluateContent=${this.evaluateContent}`).then(res =>{
					uni.showToast({title: "评价成功",icon: 'none'});
					this.popup = false;
					this.$emit('refresh')
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	@import '@/PStore/common/popup.scss';
	.popup-box{
		padding-top: 40px;
		background: url('@/PStore/static/img/coupon.png') no-repeat top center;
		background-size: contain;
		.popup-close{
			background-color: transparent;
			.iconfont{
				color:#fff
			}
		}
		
	}
	.popup-con{
		padding-top: 0;
		box-shadow: none;
	}
	.coupon-title{
		font-size:20px!important;
		font-weight: 600;
		color:#FFC469!important;
	}
	
	.coupon-list-item{
		margin-top: 20upx;
		position: relative;
		uni-image{
			height: 100%;
			width: 100%;
		}
		.coupon-info{
			position: absolute;
			top:50%;
			left:0;
			transform: translateY(-50%);
			padding:0 30upx;
			padding-right: 0;
			z-index: 1;
			width: 100%;
			color:#fff;
			.text{
				font-size: 40upx;
			}
			.num{
				margin-right: 20upx;
				font-size:60upx;
				font-weight: 600;
				letter-spacing: -7upx;
				vertical-align: -6upx;
			}
			.fh{
				margin-right: 10upx;
				font-size: 26upx;
			}
			.btn-wrap{
				position: absolute;
				right:0;
				top:50%;
				width: 35%;
				transform: translateY(-50%);
				text-align: center;
			}
			.btn{
				display: inline-block;
				background-color: #fff;
				color: #F3A000;
				font-size:30upx;
				padding:8upx 20upx;
				border-radius: 28upx;
				overflow: hidden;
				vertical-align: -8upx;
			}
		}
	}
</style>
