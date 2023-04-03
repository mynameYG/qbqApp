<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view class="detail-wrap" v-for="(item,index) in list" :key="index"  @tap="navTo(item)">
						<view class="detail-title">{{item.title}}</view>
						<view class="detail-item flex">
							<text class="detail-label">提交时间</text>
							<text class="detail-text flex1">{{dateFilter(item.createDate,'date')}}</text>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">提交内容</text>
							<text class="detail-text flex1">{{item.content}}</text>
						</view>
						<!-- <view class="detail-btn" v-if="item.status.value == 'handled' && item.imei == imei && !item.evaluateResult">
							<view class="btn-item"  @tap.stop="evaluate(item.id)" @refresh="refresh">评价</view>
						</view> -->
					</view>
				</view>
				<mix-load-more class="pb10 mt10" :status="loadMoreStatus"></mix-load-more>
			</mix-pulldown-refresh>
		</scroll-view>
		<template v-else>
			<view class="emptyPage">
				<view class="img"></view>
				<view>暂无内容，去其他页面看看吧</view>
			</view>
		</template>
		<text class="fixed-btn-rightBottom" @tap="navToAdd">新增</text>
		
		<!-- 评价 -->
		<!-- <popup ref="popup" :info="info" @refresh="refresh"></popup> -->
	</view>
</template>
<script>
	// import popup from "../components/popup-evaluate.vue"
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		data() {
			return {
				id:"",
				channelCode:"",
				pageName:"",
				loadMoreStatus: 0,
				enableScroll: true,
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				list: [],
				info:{},
				imei:"",//手机唯一识别码
				
			}
		},
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		onLoad(option) {
			this.id = option.id;
			if(option.channelCode){
				let code = option.channelCode.split('_');
				console.log('code',code)
				this.channelCode = code[1];
			}
			if(option.pageName){
				this.pageName = option.pageName;
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		onShow(){
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code;
				uni.setStorageSync('vinfo', data.code);
				this.refresh();
			})
			// #endif
			// #ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			var vinfo = info.clientid;
			uni.setStorageSync('vinfo', vinfo);
			this.imei = vinfo;
			/* plus.nativeUI.toast("info.clientid" + plus.push.getClientInfo().clientid); */
			// #endif
			// #ifndef MP-WEIXIN
			this.refresh();
			// #endif
		},
		mounted() {
		},
		methods: {
			//评价
			evaluate(item){
				this.info ={
					infoId:item,
					putUrl:'/mobile/business/complaint/evaluate'
				}
				// this.infoId = item;
				this.$refs.popup.init();
			},
			// 滚动加载
			loadData(type) {
				if (type === 'add') {
					if (this.loadMoreStatus === 2) {
						return;
					}
					this.loadMoreStatus = 1;
				}
				if (type === 'refresh') {
					this.list = [];
					this.q.pageNo = 1;
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
					this.loadMoreStatus = 1;
				}
				this.getList();
			},
			getList() {
				let params = {
					imei:this.imei,
					page: this.q.pageNo,
					pageSize: this.q.pageSize
				};
				let getJson = {
					'gwgx':"/mobile/perception/infoList",
					'hyb':"/mobile/echo/infoList"
				}
				this.$http.get(getJson[this.channelCode],params).then(res => {
					console.log('res',res)
					if(res.length > 0){
						// this.q.total = res.total;
						/* var changeData = [];
						changeData = res.list;
						this.list = this.list.concat(changeData); */
						this.list = res;
						console.log('this.list',this.list)
						this.loadMoreStatus = this.list.length >= this.q.total ? 2 : 0;
						this.q.pageNo++;
					}
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			navTo(item) {
				uni.navigateTo({
					url:`/PGov/pages/says/says-detail?id=${item.id}&pageName=${this.pageName}&channelCode=${this.channelCode}`
				})
			},
			navToAdd(){
				this.jump(`/PGov/pages/says/says-add?channelCode=${this.channelCode}&channelId=${this.id}&pageName=${this.pageName}`)
			},
			// 刷新列表
			refresh(){
				this.loadData('refresh');
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	.detail-wrap{
		margin-top: 15px;
		margin-bottom: 0;
		overflow: inherit;
	}
	.detail-title{
		border-bottom: 1px solid #F2F2F2;
		.time{
			margin:6px 0;
		}
	}
	.detail-wrap .detail-item .detail-label{
		min-width: 56px;
	}
	.title-model{
		margin:10px 0;
		font-size:12px;
		font-weight: 500;
		.label{
			margin-right: 10px;
			padding:2px 5px;
			color:#333;
			background-color: #F2F2F2;
		}
	}
	.fixed-btn-rightBottom{
		bottom:30px;
	}
</style>
