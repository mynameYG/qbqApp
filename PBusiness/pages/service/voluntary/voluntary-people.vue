<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0"  class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="p15 list-wrap">
					<view class="detail-wrap" v-for="(item,index) in list" :key="item.info.id"  @tap="navTo(item)">
						<view class="detail-title text-ellipsis no-mb">{{item.info.title}}</view>
						<!-- <view class="detail-item flex">
							<text class="detail-label">联系电话</text>
							<text class="detail-text flex1" @tap.stop="call(item.phone)">{{item.phone}}</text>
						</view> -->
					</view>
				</view>
				<mix-load-more :status="loadMoreStatus"></mix-load-more>
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
					instructorId:"",
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tabList:[],
				list: [],
				infoId:"",
				keyword:""//搜索关键字
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
			this.channelCode = option.channelCode;
			this.listCode = option.listCode;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		mounted() {
			this.getChannel();
			//this.loadData('add');
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
			getChannel(){
				this.$http.get(`/mobile/party/channel/channelList/${this.channelCode}`).then(res => {
					res.forEach(item => {
						if(item.channelCode == this.listCode){
							this.channelId = item.id;
						}
					}) 
					console.log('tabList', this.channelId);
					this.loadData("add");
				})	
			},
			getList() {
				let params = {
					channelId:this.channelId,
					page: this.q.pageNo,
					pageSize: this.q.pageSize
				};
				this.$http.get(`/mobile/party/channel/infoList`,params).then(res => {
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
			navTo(item) {
				uni.navigateTo({
					url: `/PBusiness/pages/service/voluntary/model-detail?id=${item.info.id}&channelCode=sbhr&name=${item.info.title}`
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
	.datail-sign{
		position: absolute;
		right:10px;
		top:-8px;
		color: #FBCB92;
		/deep/ text{
			font-size:50px;
		}
	}
</style>
