<template>
	<view>
		<view class="shop-info mb15" v-if="noticeList.length > 0">
			<view class="shop-info-inner" >
				<view class="shop-module-title">
					<i class="icon"></i>
					通知公告
				</view>
				<view class="shop-info-body no-mt">
					<view class="list-item flex flexmid" v-for="(item,index) in noticeList" :key='index'
						@tap="navToDetail(item,'notice')"
					>
						<view class="title flex1 text-ellipsis">{{item.title}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="shop-info mb15" v-if="activityList.length > 0">
			<view class="shop-info-inner" >
				<view class="shop-module-title">
					<i class="icon"></i>
					活动公告
				</view>
				<view class="shop-info-body no-mt">
					<view class="list-item flex flexmid" v-for="(item,index) in activityList" :key='index'
						@tap="navToDetail(item,'activity')"
					>
						<view class="title flex1 text-ellipsis">{{item.title}}</view>
						<view class="iconfont icon-you"></view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			List: {
				type: Array,
				default: () => []
			},
			detailId:{
				type: String,
				default: () => ''
			}
		},
		data() {
			return {
				noticeList:[],
				activityList:[]
			}
		},
		mounted(){
			this.getInfo();
		},
		methods: {
			getInfo(){
				this.$http.get(`/app/collection/article/${this.detailId}`).then(res =>{
					
					this.activityList = res.filter((item) =>{
						return /活动/.test(item.title)
					});
					this.noticeList = res.filter((item) =>{
						return /通知/.test(item.title)
					});
				})
			},
			navToDetail(item,type){
				this.jump(`/PStore/pages/store/book-detail?pageName=${item.title}&id=${item.id}&type=${type}`)
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
</style>
