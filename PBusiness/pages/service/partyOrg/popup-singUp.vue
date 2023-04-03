<template>
	<view class="popup-wrap" v-if="popup">
		<view class="popup-box">
			<view class="popup-close" @click="cancle">
				<text class="iconfont icon-guanbi"></text>
			</view>
			<view class="popup-con detail-wrap no-mt">
				<view class="detail-item flex tc">
					<text class="detail-label flex1 no-mr p15 color333">确定认领吗？</text>
				</view>
				<view class="popup-btn flex flexmid">
					<view class="popup-btn-item flex1">
						<button class="popup-cancle" @click="cancle">取消</button>
					</view>
					<view class="popup-btn-item flex1">
						<button class="popup-confirm" @click="confirm">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'popup',
		props:{
			info:""
		},
		data() {
			return {
				popup: false,
				imei:"",//用户唯一识别码
			}
		},
		mounted(){
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code
				uni.setStorageSync('vinfo', data.code);
			})
			// #endif
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			/* plus.nativeUI.toast("info.clientid" + plus.push.getClientInfo().clientid); */
			// #endif
		},
		methods: {
			init(){
				this.popup = true;
			},
			cancle() {
				this.popup = false;
			},
			confirm() {
				var params = {};
				params = {
					microWishId:this.info,
					claimantUser:this.$store.state.user.ext.id,
					claimantUserName:this.$store.state.user.ext.name,
					phone:this.$store.state.user.ext.mobile,
					imei:this.imei
				}
				// console.log('params',params) 
				// return false
				this.$http.put(`/mobile/party/wish/claimant?microWishId=${this.info}&claimantUser=${params.claimantUser}&claimantUserName=${params.claimantUserName}&phone=${params.phone}&imei=${params.imei}`).then(res =>{
					uni.showToast({title: "认领成功",icon: 'none'});
					setTimeout(() => {
						this.popup = false;
						// this.$emit('refresh')
						this.pageBack('loadData', 'refresh'); 
					}, 1000)
				}).catch(err => {
					err && uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	@import '@/PStore/common/popup.scss';
	/deep/.w-picker .w-picker-cnt{
		-webkit-transform: translateY(200%);
		transform: translateY(200%);
	}
</style>
