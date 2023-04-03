<template>
	<view class="shop-info" v-if="List.length > 0">
		<view class="shop-info-inner">
			<view class="shop-module-title">
				<i class="icon"></i>
				预约列表
			</view>
			<view class="shop-info-body">
				<view v-if="List.length > 0" class="list-item flex flexmid" v-for="(item,index) in List" :key='index'
					@tap="navToDetail(item)"
				>
					<view class="title flex1 text-ellipsis">{{item.title}}</view>
					<view class="iconfont icon-you"></view>
				</view>
				<view class="color999" v-else>暂无内容</view>
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
				
			}
		},
		methods: {
			navToDetail(item){
				this.jump(`/PStore/pages/store/yuyue-detail?id=${this.detailId}&pageName=${item.title}`)
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
</style>
