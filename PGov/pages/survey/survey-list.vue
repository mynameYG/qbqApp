<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view class="detail-wrap clearfix detail-wrap-adImg" v-for="item in list" :key="item.id" @click="navTo(item)">
						<view v-if="item.titleImgUrl" class="detail-adImg" :style="{width:width + 'px', height:width/1.35 + 'px'}">
							<image :src="fileUrl(item.titleImgUrl)" mode=""></image>
						</view>
						<view class="flex1">
							<view class="detail-title flex">
								<view class="flex1 text-ellipsis-2">{{item.title || '-'}}</view>
							</view>
							<view class="detail-item flex">
								<text class="detail-text color999 flex1 text-ellipsis">
									{{dateFilter(item.createTime,'date') || '-'}}
								</text>
							</view>
						</view>
						<view class="detail-badge" :class="item.signUped">
							<view v-if="item.signUped == 'notStarted'">未开始</view>
							<view v-if="item.signUped == 'end'">已结束</view>
							<view v-if="item.signUped == 'inProgress'">进行中</view>
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
				loadMoreStatus: 0,
				enableScroll: true,
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				list: [],
				info:{},
				width:"",
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
			const getSystemInfo = uni.getSystemInfoSync();
			this.width = (getSystemInfo.windowWidth) * 0.25;
			
		},
		methods: {
			numFilter(value) {
				// 截取当前数据到小数点后二位
				let tempVal = parseFloat(value).toFixed(2)
				/* let realVal = tempVal.substring(0, tempVal.length - 1) */
				return tempVal
			},
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
				this.$http.get('/mobile/survey/list',params).then(res => {
					console.log('res---',res)
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					res.list.forEach(item =>{
						item.signUped = 'notStarted';
						let dateA = (new Date()).getTime();
						let endTime = this.dateFilter(item.endDate,'date') + ' 23:00:00';
						let endDate = new Date(endTime.replace(/-/g,"/")).getTime();
						
						let startTime = this.dateFilter(item.startDate,'date');
						let startDate = new Date(startTime.replace(/-/g,"/")).getTime();
						if(dateA - startDate > 0){
							if(dateA - endDate <= 0){
								item.signUped = 'inProgress'
							}else{
								item.signUped = 'end'
							}
						}else{
							item.signUped = 'notStarted'
						}
					})
					
					this.list = this.list.concat(changeData);
					this.loadMoreStatus = this.list.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			},
			navTo(item) {
				uni.navigateTo({
					url:`/PGov/pages/survey/survey-detail?id=${item.id}&status=${item.signUped}&pageName=${item.title}`
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
	.scroll-wrap.scroll-wrap-tab-search,.panel-scroll-box{
		// #ifdef APP-PLUS || MP-WEIXIN
		height:100vh;
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		height: calc(100vh - 44px);
		// #endif
		box-sizing: border-box;
	}
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
	.detail-wrap .detail-badge{
		top: 0;
		right:0;
		bottom: inherit;
		font-size:12px;
		width: auto;
		height: auto;
		padding: 4px 6px;
		min-width: 52px;
		max-width: 52px;
		background-color: #D6D6D6;
		color:#fff;
		border-radius: 0 18upx;
	}
	.detail-wrap .inProgress{
		background-color: #05A81C;
	}
	.detail-wrap .notStarted{
		background-color: #FFA31A;
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
