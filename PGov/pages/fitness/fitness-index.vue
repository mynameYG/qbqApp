<template>
	<view class="bg">
		<!-- <view class="p15">
			<uni-search-bar placeholder="输入关键字查询" bgColor="#fff"  radius="20" @input="input"></uni-search-bar>
		</view> -->
		<scroll-view v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view class="detail-wrap" v-for="item in list" :key="item.id" @click="navTo(item)">
						<view class="detail-title flex flexmid">
							<view class="flex1 text-ellipsis">{{item.name || '-'}}</view>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">场地地址</text>
							<text class="detail-text flex1 text-ellipsis">{{item.address}}</text>
						</view>
						<!-- <view class="detail-btn" v-if="item.status.value == 'dispatch'">
							<view class="btn-item"  @tap.stop="close(item.id)">关闭</view>
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
		onShow(){
			this.refresh();
		},
		mounted() {
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
			getList() {
				let params = {
					page: this.q.pageNo,
					pageSize: this.q.pageSize
				};
				this.$http.get('/mobile/appoint/areas',params).then(res => {
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.list = this.list.concat(changeData);
					console.log('this.list',this.list)
					this.loadMoreStatus = this.list.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			navTo(item) {
				uni.navigateTo({
					url:`/PGov/pages/fitness/fitness-detail?id=${item.id}&title=${item.name}`
				})
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
