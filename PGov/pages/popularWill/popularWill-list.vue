<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view class="detail-wrap" v-for="(item,index) in list" :key="index"  @tap="navTo(item)">
						<view class="detail-title">{{item.title}}</view>
						<view class="detail-item flex">
							<text class="detail-label">提交时间</text>
							<text class="detail-text flex1">{{dateFilter(item.signDate,'dateminutes')}}</text>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">提交内容</text>
							<text class="detail-text flex1 text-ellipsis">{{item.content}}</text>
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
				loadMoreStatus: 0,
				enableScroll: true,
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				list: [],
				info:{},
				keyword:"",//搜索关键字
				imei:"",//手机唯一识别码
				willType:[]
			}
		},
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		onLoad(option) {
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		onShow(){
			// #ifdef MP-WEIXIN
			this.getWxCode().then(data =>{
				console.log('data-----',data)
				this.imei = data.code
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
		mounted(){
			let willType = uni.getStorageSync('willType');
			if(willType){
				this.willType = willType;
				console.log('this.willType',this.willType)
			}
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
				console.log('params',params)
				this.$http.get('/mobile/popularWill/infoList',params).then(res => {
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
					url:`/PGov/pages/popularWill/popularWill-detail?id=${item.id}&status=${item.receiveStatus}`
				})
			},
			navToAdd(){
				this.jump(`/PGov/pages/popularWill/popularWill-add`)
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
