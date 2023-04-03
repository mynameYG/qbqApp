<template>
	<view class="bg" :class="info.type && info.type.flag == 'tips'? 'store-detail-wrap' : ''">
		<view class="shop-banner" v-if="info.url">
			<image class="shop-banner-img" :src="fileUrl(info.url)" mode="center">
		</view>
		<!--基本信息-->
		<!-- <view class="shop-info mb15 mt15">
			<view class="shop-info-inner">
				<view class="shop-module-title">
					<i class="icon"></i>
					简介
				</view>
				<view class="shop-info-body"> -->
					<!-- <jyf-parser v-if="info.detail" class="art-con" :html="info.detail" :domain="fileUrl('/r')"></jyf-parser> -->
			<!-- 		<view>
						入住则有“入住管理”、“床位管理”和“预约床位”的服务，并有“床位呼叫”、“预警管理”等设备，一旦发生特殊状况，老人可在第一时间得到妥善照料。
					</view>
				</view>
			</view>
		</view> -->
		<view class="shop-info mb15 mt15">
			<view class="shop-info-inner">
				<view class="list-item">
					<view class="list-item-li flex flexmid" v-for="(item,index) in list" :key="index">
						<view class="time">
							{{item.time}}<br/>
							<text>{{item.date}}</text>
						</view>
						<view class="flex1 tc">剩余{{item.num}}</view>
						<view class="btn" @tap="yuyue(index)">立即预约</view>
					</view>
				</view>
			</view>
		</view>
		
		<popupYuyue  ref="popup" @yuyueSuccess='yuyueSuccess'></popupYuyue>
	</view>
</template>

<script>
	import popupYuyue from "../../components/popupYuyue.vue"
	export default {
		components:{
			popupYuyue
		},
		data() {
			return {
				id:"",
				info:{},
				imei:"",
				url:{},
				list:[],
				curr_index: 0
			}
		},
		onLoad(option) {
			this.id = option.id;
			console.log('this.id',this.id)
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted(){
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			console.log('vinfo'+this.imei)
			// #endif
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				uni.setStorageSync('vinfo', data.code);
				this.imei = data.code;
				console.log('this.imei----'+this.imei)
			})
			// #endif
			
			var timeArr = this.GetTime();
			timeArr.forEach((item, index) =>{
				var num_storage = uni.getStorageSync('yuyue_detail_'+this.id + item.date);
				if(num_storage == null || num_storage == undefined || num_storage == ''){
					num_storage = Math.floor(Math.random() * 20);
					uni.setStorageSync('yuyue_detail_'+this.id + item.date, num_storage)
				}
				let num = parseInt(num_storage);
				let listItem = {
					date:item.date,
					time:item.week,
					num: num
				}
				this.list.push(listItem)
			})
			this.getInfo();
		},
		methods:{
			 GetTime() {
				var date = new Date();
				var base = Date.parse(date); // 转换为时间戳
				var oneDay = 24 * 3600 *1000
				
				var daytimeArr = []
				for (var i = 0; i < 3 ; i++) { //后七天的时间
					var now = new Date(base);
					daytimeArr.push({
						date:this.dateFilter(now.getTime(),'day'),
						week:this.week(now.getDay())
					})
					base += oneDay;
				}
				return daytimeArr
			},
			week(h){
				var we = ['周日', '周一','周二','周三','周四','周五','周六']
				return we[h]
			},
			getInfo(){
				this.$http.get(`/app/collection/detail/${this.id}`).then(res =>{
					this.info = res;
				})
			},
			yuyue(index){
				if(this.list[index].num <= 0){
					uni.showToast({
						icon:"none",
						title:"已约满！"
					})
					return false
				}
				this.curr_index = index;
				this.$refs.popup.init();
				console.log('index',index)
			},
			yuyueSuccess(){
				this.list[this.curr_index].num = this.list[this.curr_index].num - 1;
				uni.setStorageSync('yuyue_detail_'+this.id + this.list[this.curr_index].date, this.list[this.curr_index].num);
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.list-item{
		padding:20upx 0; 
		.list-item-li{
			margin-bottom: 30upx;
		}
		.time{
			margin-right: 20upx;
			font-size:30upx;
			text{
				margin-top: 10upx;
				color:#999;
				font-size:24upx;
			}
		}
		.btn{
			float:right;
			padding: 6upx 18upx;
			background-color: #1B6EE6;
			color:#fff;
			border-radius: 10upx;
			font-size:24upx;
		}
	}
</style>
