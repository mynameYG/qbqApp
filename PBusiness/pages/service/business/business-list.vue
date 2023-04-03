<template>
	<view class="bg">
		<!-- <view class="p15">
			<uni-search-bar placeholder="输入关键字查询" bgColor="#fff"  radius="20" @input="input"></uni-search-bar>
		</view> -->
		<scroll-view  v-if="list.length > 0" class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<template v-if="channelName == 'yjjy'">
					<view class="pl15 pr15">
						<view class="detail-wrap" v-for="(item,index) in list" :key="item.id"  @tap="navTo(item)">
							<view class="detail-title"><text style="font-weight: 500;font-size: 14px;margin-right:5px;">[{{item.type.title}}]</text>{{item.title}}</view>
							<view class="detail-item flex">
								<text class="detail-label">上报时间</text>
								<text class="detail-text flex1">{{dateFilter(item.submitDate,'date')}}</text>
							</view>
							<view class="detail-item flex">
								<text class="detail-label">处理状态</text>
								<text v-if="item.replyStatus" class="detail-text flex1 success">已处理</text>
								<text v-else class="detail-text flex1 warning">等待处理</text>
							</view>
						</view>
					</view>
				</template>
				<template v-else-if="channelName == 'rczd'">
					<view class="pl15 pr15">
						<view class="detail-wrap" v-for="(item,index) in list" :key="item.id"  @tap="navTo(item)">
							<view class="detail-title">{{item.title}}</view>
							<view class="detail-item flex">
								<text class="detail-label">发布企业</text>
								<text class="detail-text flex1">{{item.enterpriseName || '-'}}</text>
							</view>
							<view class="detail-item flex">
								<text class="detail-label">发布时间</text>
								<text class="detail-text flex1">{{dateFilter(item.releaseDate,'date')}}</text>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="model-list p15 no-mt">
						<view class="list-item flex" v-for="item in list"  :key="item.id" @click="navTo(item)">
							<view class="flex1">
								<view class="title text-ellipsis">{{item.title}}</view>
								<view class="info flex1 text-ellipsis color999">{{dateFilter(item.releaseDate || item.submitDate,'date')}}</view>
							</view>
						</view>
					</view>
				</template>
				<mix-load-more class="pb10" :status="loadMoreStatus"></mix-load-more>
			</mix-pulldown-refresh>
		</scroll-view>
		<template v-else>
			<view class="emptyPage">
				<view class="img"></view>
				<view>暂无内容，去其他页面看看吧</view>
			</view>
		</template>
		<text class="fixed-btn-rightBottom" v-if="channelName == 'yjjy'" @click="jump('/PBusiness/pages/service/business/advice-add')">提报</text>
	</view>
</template>
<script>
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		data() {
			return {
				id:"",
				channelId:"",
				channelName:"",
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
		onLoad(opt){
			this.channelId = opt.channelId;
			this.id = opt.channelId;
			if(opt.pageName){
				uni.setNavigationBarTitle({
					title: opt.pageName
				})
			}
			if(opt.currentChannel == 'yjjy'){
				this.channelName = opt.currentChannel;
			}else{
				this.channelName = opt.channelName;
			}
			console.log('name--------',this.channelName)
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
				let jsonUrl = {
					'busHuanjing' : '/mobile/business/environment/list',
					'rczd' : `/mobile/business/zhida/${this.id}`,
					'zwzdZhfw' :`/mobile/business/zhida/${this.id}`,////智慧化政务服务
					'fwzd' :`/mobile/business/zhida/${this.id}`,////服务直达
					'yjjy' :`/mobile/business/advice/list` ,//意见建议
					'rczd' : `/mobile/pub/ent/recruit/list` ,//人才直达
				}
				this.$http.get(jsonUrl[this.channelName],params).then(res => {
					// console.log('res---',res)
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
				if(this.channelName == 'yjjy'){
					uni.navigateTo({
						url:`/PBusiness/pages/service/business/advice-detail?id=${item.id}&channelId=${this.channelId}&channelName=${this.channelName}&name=${item.title}`
					})
					return false
				}
				if(this.channelName == 'rczd'){
					uni.navigateTo({
						url:`/PBusiness/pages/service/business/busssiness-rc-detail?id=${item.id}&channelId=${this.channelId}&channelName=${this.channelName}&name=${item.title}`
					})
					return false
				}
				if(this.channelName == 'zwzdZhfw' || this.channelName == 'fwzd'){
					this.channelName = 'zhida'
				}
				uni.navigateTo({
					url:`/PBusiness/pages/service/business/business-detail?id=${item.id}&channelId=${this.channelId}&channelName=${this.channelName}&name=${item.title}`
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
		padding:15px;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0 0 6px #e4e4e4;
	}
	.model-list .list-item .title{
		margin-bottom: 6px;
		font-weight: 500;
		font-size:14px;
	}
	.model-list .list-item .info{
		margin-bottom: 6px;
		font-size:13px;
	}
	.model-list{
		margin-top: 15px;
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
