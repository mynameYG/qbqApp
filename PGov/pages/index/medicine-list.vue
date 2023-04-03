<template>
	<view class="bg">
		<scroll-view v-if="list.length > 0"  class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadData('add')">
			<mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="loadData('refresh')">
				<view class="model-list p15 no-mt no-pt">
					<view class="list-item flex" v-for="item in list"  :key="item.info.id" @click="navTo(item)">
						<view class="flex1">
							<view class="title text-ellipsis">{{item.info.title}}</view>
							<view class="info flex1 text-ellipsis color999">{{dateFilter(item.info.createDate,'date')}}</view>
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
			if(option.channelCode){
				this.channelCode = option.channelCode;
			}
			if(option.listCode){
				this.listCode = option.listCode;
			}
			if(option.currentChannel){
				this.channelCode = option.currentChannel;
				this.listCode = option.currentChannel;
			}
			if(option.channelId){
				this.channelId = option.channelId
			}
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
				console.log('this.channelCode',this.channelCode)
				this.$http.get(`/mobile/party/channel/channelList/${this.channelCode}`).then(res => {
					res.forEach(item => {
						if(item.channelCode == this.listCode){
							console.log('item.id',item.id)
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
	.model-list .list-item{
		margin-top: 15px;
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
</style>
