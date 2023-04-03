<template>
	<view  v-if="storeList.length > 0">
		<view class="store-list clearfix">
			<template v-if="storeList.length > 0">
				<view class="shop-list-item flex flexmid" v-for="(item,index ) in storeList" :key="index" v-if="!showList || index < showList" @tap="navToDetail(item)">
					<view class="shop-list-item-inner">
						<view class="shop-logo">
							<image :src="fileUrl(item.url || '')">
						</view>
						<view class="shop-body">
							<h3 class="shop-name text-ellipsis">{{item.title ||''}}</h3>
							<view class="shop-address text-ellipsis">{{item.address ||''}}</view>
							
							<view class="daohang" @tap.stop="toMap(item)">
								<image  class="icon" :src="getImgDaohang()"  alt="">
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- <template v-else>
				<view class="empty">
					<view>数据正在整理中~请先去看看其他内容吧</view>
				</view>
			</template> -->
		</view>
	</view>

</template>

<script>
	export default {
		props:{
			groupCode:"",
			typeCode:"",
			showList:""
		},
		data() {
			return {
				storeList:[],
				showMore:false,
				storeName:""
			}
		},
		mounted(){
			this.getStoreList()
		},
		methods:{
			//获取图片地址
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			getStoreList(){
				let mapType = this.$config.mapType;
				this.groupCode = this.groupCode || "";
				this.typeCode = this.typeCode || "";
				this.$http.get(`/app/collection/list?group=${this.groupCode}&type=${this.typeCode}&mapType=${mapType}`).then(res =>{
					this.storeName = res.list[0].type.alias1;
					if(res.total > 5){
						this.showMore = true
					}else{
						this.showMore = false
					}
					this.storeList = res.list;
					
				})
			},
			navToDetail(item){
				uni.navigateTo({
					url:`/PStore/pages/store/store-detail?id=${item.id}&pageName=${item.title}`
				})
			},
			toMap(item){
				//跳转到地图页
				this.jump(`/PGov/pages/index/map?pageName=${item.title}
				&destinationLat=${item.lat}&destinationLng=${item.lng}
				&address=${item.address || ''}&phone=${item.phone || ''}`)
			},
			toMapMore(item){
				uni.navigateTo({
					url:`/PGov/pages/index/mapChannel?type=${item.groupType}&pageName=${item.groupName}&curTypeCode=${item.type}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.empty{
		padding:20px;
		color:#999;
		font-size:12px;
		text-align: center;
	}
	.shop-list-item-inner{
		position: relative;
		.shop-address{
			padding-right: 60upx;
		}
	}
	.daohang{
		position: absolute;
		bottom:4upx;
		right:20upx;
		.icon{
			width: 60upx;
			height: 60upx;
			vertical-align: -0.15em;
			fill: currentColor;
			overflow: hidden;
		}
	}
</style>
