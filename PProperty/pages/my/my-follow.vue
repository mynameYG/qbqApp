<template>
	<view class="bg">
		<scroll-view  v-if="list.length > 0"  class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="model-list p15 no-mt">
					<view class="list-item flex" v-for="item in list"  :key="item.id" @click="navTo(item)">
						<view class="flex1">
							<view class="title text-ellipsis">{{item.title}}</view>
							<view class="info flex1 text-ellipsis color999">{{dateFilter(item.followDate,'dateminutes')}}</view>
							<view class="info-btn" @tap.stop="unfollow(item)">取消关注</view>
						</view>
					</view>
				</view>
				<mix-load-more class="pb10" :status="loadMoreStatus"></mix-load-more>
			</mix-pulldown-refresh>
		</scroll-view>
		<template v-else>
			<view class="emptyPage">
				<view class="img"></view>
				<view>暂无内容，去其他页面看看吧</view>
			</view>
		</template>
		
	</view>
</template>
<script>
	
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		data() {
			return {
				channelCode:"",
				listCode:"",
				channelId:"",
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
			}
		},
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		watch:{
			keyword(newVal, oldVal){
				this.keyword = newVal;
				this.delay(() => {
					this.search();
				}, 300);
			}
		},
		onLoad(option){
			this.channelId = option.channelId;
			this.channelCode = option.channelCode;
			this.listCode = option.listCode;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted() {
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
			this.loadData('add');
		},
		methods: {
			input(res) {
				this.keyword = res.value
			},
			search(){
				this.q.pageNo = 1;
				this.list = [];
				this.loadMoreStatus = 1;
				this.loadData("add");
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
				if(process.env.NODE_ENV === 'development'){
					this.imei = '5659d16f2a842deb31a77930aa8419bf';
				}
				this.$http.get(`/mobile/follow/list?imei=${this.imei}`).then(res => {
					console.log('res',res)
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.list = this.list.concat(changeData);
					this.loadMoreStatus = this.list.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			unfollow(item){
				this.$http.post(`/mobile/follow/cancleFollow/${item.id}`).then(res =>{
					uni.showToast({
						icon:"none",
						title:"取消成功"
					})
					this.refresh();
				})
			},
			navTo(item) {
				console.log('item',item)
				uni.navigateTo({
					url: `/${item.url}?id=${item.infoId}&pageName=${item.title}`
				});
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
	.scroll-wrap.scroll-wrap-tab-search,.panel-scroll-box{
		// #ifdef APP-PLUS || MP-WEIXIN
		height:100vh;
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		height: calc(100vh - 44px);
		// #endif
	}
	.detail-wrap{
		overflow: inherit;
	}
	.model-list .list-item{
		margin-bottom: 30upx;
		padding:30upx;
		background-color: #fff;
		border-radius: 18upx;
		box-shadow: 0 0 6px #e4e4e4;
		position: relative;
		font-size:28upx;
		.info-btn{
			position: absolute;
			bottom:30upx;
			right:30upx;
			background-color: #1B6EE6;
			color:#fff;
			padding: 6upx 18upx;
			border-radius: 10upx;
			font-size:24upx;
		}
	}
	.model-list .list-item .title{
		margin-bottom: 12upx;
		font-weight: 500;
		font-size:28upx;
	}
	.model-list .list-item .info{
		margin-bottom: 12upx;
		font-size:26upx;
	}
</style>
