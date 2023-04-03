<template>
	<view class="bg">
		<!-- <view class="p15">
			<uni-search-bar placeholder="输入关键字查询" bgColor="#fff"  radius="20" @input="input"></uni-search-bar>
		</view> -->
		<scroll-view  v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="pl15 pr15 list-wrap">
					<view class="detail-wrap" v-for="item in list" :key="item.id" @click="navTo(item)">
						<view class="detail-item flex">
							<text class="detail-label">
								<!-- #ifndef MP-WEIXIN -->
								<image class='icon' src="../../../static/img/title.png"/>
								<!-- #endif -->
								<!-- #ifdef  MP-WEIXIN-->
								<text class="title-icon"></text>
								<!-- #endif -->
							</text>
							<text class="detail-text flex1 text-ellipsis">{{item.name || '-'}}</text>
						</view>
						<view class="detail-item flex">
							<text class="detail-label">
								<!-- #ifndef MP-WEIXIN -->
								<image class='icon' src="../../../static/img/phone.png"/>
								<!-- #endif -->
								<!-- #ifdef  MP-WEIXIN-->
								<text class="phone-icon"></text>
								<!-- #endif -->
							</text>
							<text class="detail-text text-ellipsis" @tap.stop="call(item.contact)">{{item.contact || '-'}}</text>
						</view>
					</view>
				</view>
				<mix-load-more class="mt10 pb10" :status="loadMoreStatus"></mix-load-more>
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
				channelName:""
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
		onLoad(opt){
			this.channelName = opt.channelName;
			console.log('name',this.channelName)
			if(opt.pageName){
				uni.setNavigationBarTitle({
					title: opt.pageName
				})
			}
		},
		onShow(){
			// this.refresh();
		},
		mounted() {
			this.loadData('add');
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
				this.$http.get(`/mobile/gos/content/list`,params).then(res => {
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
					url:`/PGov/pages/gov/gov-jgszDetail?id=${item.id}&channelName=${this.channelName}&name=${item.name}`
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
		.detail-item{
			.detail-label{
				margin-right: 0;
			}
			.icon{
				margin-right:5px;
				width: 20px;
				height: 20px;
				vertical-align: -4px;
			}
			.title-icon,.phone-icon{
				background: url(../../../static/img/title.png) no-repeat center;
				background-size: 100%;
				width: 20px;
				height: 20px;
				display: block;
				line-height: 26px;
				margin-top: 3px;
			}
			.phone-icon{
				background: url(../../../static/img/phone.png) no-repeat center;
				background-size: 100%;
			}
		}
	}
</style>
