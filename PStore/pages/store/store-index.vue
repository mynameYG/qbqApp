<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
		<view class="store-ad" :style="{height:ImageHeight + 'px'}">
				<view class="swiper" :style="{height:ImageHeight + 'px'}">
					<swiper :interval="3000" :duration="1000" :indicator-dots="false"
					 :current="topSwiperIndex" @change="topSwiperTab" 
					 :circular='true'>
						<swiper-item v-for="(item,index) in topSwiper" :key="index">
							<view class="swiper-item">
								<image :src="getImgBanner(item.typeCode)"  mode="scaleToFill" @load="getImgHeight"></image>
							</view>
						</swiper-item>
					</swiper>
					<!-- 自定义指示点dots -->
					<view class="dots-warp">
						<view class="dots" :class=" topSwiperIndex == index ? 'current' : '' " v-for="(item,index) in topSwiper" :key="index">
						</view>
					</view>
				</view>
			</view>
				
			<view class="store-nav">
				<view class="index-nav-box clearfix">
					<view class="index-nav-item tc"  v-for="(item,index) in storeChannelList" :key="index" @tap="navToList(item)">
						<view class="index-nav-item-inner">
							<view class="index-nav-bg">
								<i class="iconfont" :class="item.icon" :style="{color:item.color }">
									<!-- <image :src="getImgNav(item.tagCode)" mode="aspectFill"></image> -->
								</i>
							</view>
							<view class="index-nav-text">{{item.name}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="storeChannelList.length > 0" class="search-box" :class="{'search-fixed':searchFixed}" >
				<uni-search-bar ref="search" placeholder="输入关键字查询" bgColor="#fff"  radius="10" @input="input"></uni-search-bar>
			</view>
			<view class="store-list-scrollWrap">
				<template v-if="storeList.length > 0">
					<view class="store-list pr15 pl15 pt10 clearfix">
						<view class="shop-list-item flex flexmid" v-for="(item,index ) in storeList" :key="index"  @tap="navToDetail(item)">
							<view class="shop-list-item-inner">
								<view class="shop-logo">
									<image :src="fileUrl(item.url, 280)" alt="">
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
					</view>
			</template>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				ImageHeight:"",
				loadMoreStatus: 0,
				enableScroll: true,
				topSwiperIndex: 0,
				topSwiper: [{
					typeCode:"019"
				},{
					typeCode:"025"
				},{
					typeCode:"027"
				},{
					typeCode:"028"
				}
				],
				NavIndex:0,
				storeChannelList:[],
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				storeList:[],
				curType:{},
				showMore:false,
				searchTitle:"",//搜索关键字
				searchFixed:false
			}
		},
		onPageScroll(res){
			//console.log('==========',res.scrollTop);//距离页面顶部距离
			if(res.scrollTop >= 363){
				this.searchFixed = true
			}else{
				this.searchFixed = false
			}
		},
		mounted(){
			// this.getAllType();
			// this.getStoreList()
			//this.loadData('refresh');
			this.init();
		},
		watch: {
			searchTitle(newVal, oldVal) {
				this.searchTitle = newVal;
				this.delay(() => {
					this.search();
				}, 300);
			}
		},
		methods:{
			input(res) {
				this.searchTitle = res.value
			},
			search(){
				let page = {
					num : 1 
				}
				this.upCallback(page)
			},
			/*下拉刷新的回调 */
			downCallback() {
				// this.$refs.search.cancel();
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			upCallback(page){
				if(page.num == 1){
					this.q.pageNo = 1;
					this.storeList = [];
				}
				let mapType = this.$config.mapType;
				this.$http.get(`/app/collection/list?mapType=${mapType}&page=${this.q.pageNo}&title=${this.searchTitle}&pageSize=${this.q.pageSize}`).then(res =>{
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.storeList = this.storeList.concat(changeData);
					this.loadMoreStatus = this.storeList.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
					this.mescroll.endByPage(res.list.length, Math.ceil(res.total / res.pageSize))
				})
			},
			init(){
				this.getMapAllType(data =>{
					this.storeChannelList = data.code;
					this.storeChannelList.forEach((item) =>{
						let json = item.flag1.split(',');
						item.color = json[1];
						item.icon = json[2]
					})
				})
			},
			getImgHeight(e){
				let scale = e.detail.width/e.detail.height;
				const getSystemInfo = uni.getSystemInfoSync();
				let windowWidth = getSystemInfo.windowWidth;
				let windowHeight = Math.round((windowWidth - 30)/scale);
				if(windowHeight > this.ImageHeight){
					this.ImageHeight = windowHeight;
				}
			},
			//获取图片地址
			getImgDaohang(){
				return require("@/static/img/store-location.png");
			},
			//获取图片地址
			getImgBanner(icon){
			   return require("@/static/img/store-banner-"+icon+".png");
			},
			getImgUrl(icon){
			   return require("@/static/img/store-icon-"+icon+".png");
			},
			getImgNav(icon){
			   return require("@/static/img/store-nav-"+icon+".png");
			},
			topSwiperTab(e) {
			    var that = this;
			    this.topSwiperIndex = Number(e.target.current);
			},
			getAllType(){
				this.$http.get(`/app/collection/type`).then(res=>{
					let typeList = res;
					let tempArr = [];
					let Data = [];
					let DataOther = [];
					for (let i = 0; i < typeList.length; i++) {
						if(typeList[i].sort){
							if (tempArr.indexOf(typeList[i].sort) === -1) {
							  Data.push({
							    tagName: typeList[i].alias1,
								tagCode:typeList[i].sort,
							    dataInfo: [typeList[i]]
							  });
							  tempArr.push(typeList[i].sort);
							} else {
							  for (let j = 0; j < Data.length; j++) {
							    if (Data[j].tagName == typeList[i].sort) {
							      Data[j].dataInfo.push(typeList[i]);
							      break;
							    }
							  }
							}
						}else{
							if (tempArr.indexOf(typeList[i].sort) === -1) {
							  DataOther.push({
							    tagName: typeList[i].sort,
							    dataInfo: [typeList[i]]
							  });
							  tempArr.push(typeList[i].sort);
							} else {
							  for (let j = 0; j < DataOther.length; j++) {
							    if (DataOther[j].tagName == typeList[i].sort) {
							      DataOther[j].dataInfo.push(typeList[i]);
							      break;
							    }
							  }
							}
						}
					  
					 }
					Data = Data.concat(DataOther);
					this.storeChannelList = Data;
					// console.log('this.storeChannelList',this.storeChannelList)
					/* this.getStoreList(this.storeChannelList[0],0) */
				})
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
					this.storeList = [];
					this.q.pageNo = 1;
					this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
					this.loadMoreStatus = 1;
				}
				this.getStoreList();
			},
			getStoreList(item, index){
				this.NavIndex = index;
				this.curType = item;
				let mapType = this.$config.mapType;
				this.$http.get(`/app/collection/list?mapType=${mapType}&page=${this.q.pageNo}&title=${this.searchTitle}&pageSize=${this.q.pageSize}`).then(res =>{
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.storeList = this.storeList.concat(changeData);
					this.loadMoreStatus = this.storeList.length >= this.q.total ? 2 : 0;
					this.q.pageNo++;
				})
			},
			navToDetail(item){
				uni.navigateTo({
					url:`/PStore/pages/store/store-detail?id=${item.id}&pageName=${item.title}`
				})
			},
			navToList(item){
				uni.navigateTo({
					url:`/PStore/pages/store/store-list?code=${item.code}&pageName=${item.name}`
				})
			},
			toMapMore(item){
				uni.navigateTo({
					url:`/PGov/pages/index/mapChannel?type=${item.groupType}&pageName=${item.groupName}&curTypeCode=${item.type}`
				})
			},
			toMap(item){
				//跳转到地图页
				this.jump(`/PGov/pages/index/map?pageName=${item.title}
				&destinationLat=${item.lat}&destinationLng=${item.lng}
				&address=${item.address || ''}&phone=${item.phone || ''}`)
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/static/css/store.scss';
	.search-box{
		padding:10rpx 30rpx;
	}
	.search-fixed{
		position: fixed;
		background-color: #fff;
		width: 100%;
		// #ifdef APP-PLUS
		top: 0px;
		// #endif
		// #ifndef APP-PLUS
		top: 44px;
		// #endif
		z-index: 999;
		padding:30rpx;
	}
	/deep/.uni-searchbar__box{
		border:1px solid #ECEEEE;
		box-shadow: 0 0 6px #e4e4e4;
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
