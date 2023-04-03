<template>
	<view class="bg">
		<!-- <view class="p15">
			<uni-search-bar placeholder="输入关键字查询" bgColor="#fff"  radius="20" @input="input"></uni-search-bar>
		</view> -->
		<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="model-list pl15 pr15">
					<view class="list-item flex" v-for="item in list"  :key="item.id" @click="navTo(item)">
						<image v-if="item.coverUrl" class="list-img" :src="fileUrl(item.coverUrl)" mode=""></image>
						<view class="flex1">
							<view class="title text-ellipsis-2">{{item.title}}</view>
							<view class="info flex1 text-ellipsis color999">{{dateFilter(item.releaseDate,'date')}}</view>
						</view>
					</view>
				</view>
				<mix-load-more class="pb10" :status="loadMoreStatus"></mix-load-more>
			</mix-pulldown-refresh>
		</scroll-view>
		
		
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
				this.$http.get('/mobile/life/notice', params).then(res => {
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
				this.jump(`/PGov/pages/notice/notice-detail?id=${item.id}&title=${item.title}`)
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
	.model-list .list-item{
		margin-bottom: 15px;
		padding:20px 15px;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0 0 6px #e4e4e4;
	}
	.model-list .list-item .title{
		margin-bottom: 5px;
		max-height: 48px;
		font-weight: 500;
		font-size:14px;
	}
	.model-list .list-item .info{
		margin-bottom: 6px;
		font-size:13px;
	}
	.model-list{
		margin-top: 15px;
		.list-img{
			margin-right: 10px;
			width:100px;
			height: 76px;
			border:1px solid #f8f8f8
		}
	}
</style>
