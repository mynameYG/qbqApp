<template>
	<view class="bg">
		<view class="my-header-wrap no-road">
			<view class="my-header-box">
				<view class="my-photo">{{integral}}</view>
				<view class="fs12 tc" style="color:#fff">总积分</view>
			</view>
		</view>
		<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view>积分明细</view>
					<view class="detail-wrap no-all-p">
						<view class="detail-item flex flexmid mb10" v-for="item in list" :key="item.id" >
							<view class="time">{{dateFilter(item.createDate,'dateminutes') || '-'}}</view>
							<view class="flex1 text-ellipsis tc">{{item.moduleTitle || '-'}}</view>
							<view v-if="item.type.value == 'increase'" class="num text-ellipsis tr warning">+{{item.integral || '-'}}</view>
							<view v-else class="num text-ellipsis tr success">-{{item.integral || '-'}}</view>
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
				integral:"",
				
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
			this.getInfo();
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
				this.$http.get('/mobile/integral/list',params).then(res => {
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
			// 刷新列表
			refresh(){
				this.loadData('refresh');
			},
			getInfo(){
				this.$http.get('/mobile/integral/info').then(res => {
					this.integral = res.integral;
				}).catch(err => {
					uni.showToast({title: err,icon: 'none'})
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	.bg{
		background-color: #fff;
		overflow:hidden;
	}
	/*我的*/
	.my-header-wrap{
	    width: 100%;
	    min-height: 178px;
	    background: url(../../../static/img/my-bg.png) #fff no-repeat center;
	    background-size:100% 100%;
		padding: 15px 15px 10px;
		.my-header-box{
		    width: 100%;
		    position:relative;  
			  .my-title{
			  	font-size:17px;
				font-weight: 600;
				color:#fff;
				text-align: center;
				.icon-bianji{
					position: absolute;
					top:0;
					right:15px;
					font-weight: 500;
					margin-top: 2px;
					font-size:18px;
				}
			  }
		}
		.my-photo{
			display: block;
			margin:15px auto 5px;
			width: 90px;
			height: 90px;
			line-height: 90px;
			text-align: center;
			border: 3px solid #fff;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
			font-size: 24px;
			color:#fff;
			font-weight: 600;
		}
		.my-name{
			float:left;
		    font-size: 16px;
		    color:#fff;
			font-weight: 600;
		    text-align: left;
		    padding: 0 10px;
		    margin: 20px auto 0;
			width: calc(100% - 70px);
			text-shadow:0px 0px 2px rgba(0, 0, 0, 0.3);
		}
		.my-header-total{
			margin-top: 15px;
			width: 100%;
			min-height: 178px;
			border-radius: 5px;
			box-shadow: 0px 0px 10px rgba(43, 160, 247, 0.298039215686275);
			background-color: #fff;
		}
	}
	
	
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
		box-shadow: none;
		font-size: 12px;
		.time{
			font-size: 12px;
			color:#999;
		}
		.num{
			font-weight: 600;
		}
	}
	.detail-wrap .detail-item{
		padding:5px 0;
	}
	.panel-scroll-box{
		// #ifdef APP-PLUS
		height: calc(100vh - 148px);
		// #endif
		// #ifndef APP-PLUS
		height: calc(100vh - 192px);
		// #endif
	}
</style>
