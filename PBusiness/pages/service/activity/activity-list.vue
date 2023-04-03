<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0"  class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="p15 list-wrap">
					<view class="detail-wrap" v-for="(item,index) in list" :key="item.id"  @tap="navTo(item.id)">
						<view class="detail-title">{{item.name}}</view>
						<view class="detail-item flex">
							<text class="detail-label">活动地点</text>
							<text class="detail-text flex1">{{item.address|| '-'}}</text>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">活动时间</text>
							<text class="detail-text flex1">{{dateFilter(item.beginDate,'date')}}至{{dateFilter(item.endDate,'date')}}</text>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">截止报名时间</text>
							<text class="detail-text flex1">{{dateFilter(item.endDate,'date') || '-'}}</text>
						</view>
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
				loadMoreStatus: 0,
				enableScroll: true,
				q: {
					instructorId:"",
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
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
		mounted() {
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
				let params = {
					page: this.q.pageNo,
					pageSize: this.q.pageSize
				};
				this.$http.get('/mobile/party/benefit/activityList', params).then(res => {
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
					url: `/PBusiness/pages/service/activity/activity-detail?id=${item}`
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
