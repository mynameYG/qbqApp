<template>
	<view class="bg">
		<scroll-view  v-if="list.length > 0"  class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="model-list p15 no-mt">
					<view class="list-item flex" v-for="item in list"  :key="item.id" @click="navTo(item)">
						<view class="flex1">
							<view class="title text-ellipsis">{{item.title}}</view>
							<view class="info flex1 text-ellipsis color999">{{dateFilter(item.releaseDate,'date')}}</view>
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
				// let params = {
				// 	channelId:this.channelId,
				// 	page: this.q.pageNo,
				// 	pageSize: this.q.pageSize
				// };
				this.$http.get(`/mobile/channel/info/${this.channelId}`).then(res => {
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
			navTo(item) {
				uni.navigateTo({
					url: `/PBusiness/pages/service/articleModel/articleModel-detail?id=${item.id}&channelId=${this.channelId}&name=${item.title}`
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
		font-size:28upx;
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
	.model-list{
		margin-top: 30upx;
	}
</style>
