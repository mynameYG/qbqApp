<template>
	<view class="index-main p15">
		<view class="index-ad" :style="{height:ImageHeight + 'px'}">
			 <!-- <image v-if="topSwiper.length > 0" :src="topSwiper[0].titlePictureUrl" style="width:100%;border-radius: 16upx;" mode="widthFix"></image> -->
			<view class="swiper">
			    <swiper :interval="3000" :duration="1000" :indicator-dots="false"
			     :current="topSwiperIndex" @change="topSwiperTab" :autoplay="true"
				 :circular='true'>
			        <swiper-item v-for="(item,index) in topSwiper" :key="index" @click="ToDetail(item)">
			            <view class="swiper-item">
			                <image :src="item.titlePictureUrl" mode="scaleToFill" @load="getImgHeight"></image>
			            </view>
			        </swiper-item>
			    </swiper>
			
			    <!-- 自定义指示点dots -->
			    <view class="dots">
			        <text>{{topSwiperIndex+1}}/{{topSwiper.length}}</text>
			    </view> 
			</view>
		</view>
		
		<view class="index-nav-wrap">
			<view class="index-nav-box clearfix whiteBg">
				<view class="index-nav-item tc" :style="{width:100/lie + '%'}" v-for="(item,index) in channelList" :key="index" @tap="navTo(item)">
					<view class="index-nav-bg flex flexmid" :style="{backgroundColor:item.colour , width:width + 'px' , height:width + 'px'}">
						<i class="iconfont flex1" :class="item.icon" ></i>
					</view>
					<view class="index-nav-text">{{item.name}}</view>
				</view>
			</view>
		</view>
	
		<view class="news-mid-wrap" v-if="newsList.length > 0">
			<view class="news-mid flex">
				<image class="mid-left" src="/static/img/news-img.png"></image>
				<swiper class="swiper news-swiper flex1" vertical=true autoplay=true circular=true interval="3000">
					<swiper-item v-for="(item,i) in newsList" :key="item.id" v-show="i < 2" @click="jump(`/PGov/pages/notice/notice-detail?id=${item.id}&title=${item.title}`)">
						<view class="swiper-item text-ellipsis news-item">
							{{item.title}}
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<view class="index-tab p15" v-if="list.length > 0" hidden>
			<view class="index-tab-inner">
				<view class="flex flexmid">
					<view class="index-tab-title flex1">
						<text class="index-tab-title-item" v-for="(item,index) in TabList" :key="index" :class="{current:current==index}" :data-current="index" @tap="tabChange">{{item.title}}</text>
					</view>
					<text class="things-more" @click="toNext()"><text class="iconfont icon-gengduo"></text></text>
				</view>
			
				<view class="index-tab-list">
					<!-- 通知公告 start -->
					<view v-if="current == 0">
						<notice :noticeList="list" type="notice"  @detailLink="detailLink"></notice>
					</view>
					<!-- 通知公告 end -->
				</view>
			
			</view>
			
		</view>
		
		<!-- 新增商家内容 start-->
		<store groupCode=""  typeCode="" showList="4" type="home"></store>
		<store groupCode="health"  typeCode="" showList="4"></store>
		<store groupCode="school"  typeCode="" showList="4"></store>
		<store groupCode="culture"  typeCode="" showList="4"></store>
		<store groupCode="oldLife"  typeCode="" showList="4"></store>
		
		<!-- 新增商家内容 end -->
		
	</view>
</template>

<script>
	import channel from '@/common/channel.js'
	// import notice from './components/notice.vue'
	import store from './components/store-index.vue'
	export default {
		components:{
			// notice,
			store
		},
		data() {
			return {
				ImageHeight:130,
				// channelList: channel,
				channelList: [],
				lie:"",//列数
				width:0,
				topSwiperIndex: 0,
				topSwiper: [] ,
				current:0,
				TabList:[
					{
						type:"notice",
						title:"通知公告"}
				],
				list:[],
				newsList:[]
			}
		},
		onShow(){
			
			//获取本地存储
			let channelList = uni.getStorageSync('channelList');
			let lie = uni.getStorageSync('lie');
			let width = uni.getStorageSync('width');
			if(channelList && lie && width){
				this.channelList = channelList;
				this.lie = lie;
				this.width = width;
			}
			// console.log(this.lie ,this.width ,this.channelList)
			let _self = this;
			this.getNoticeList();
			this.getChannel();
			const storageKey = 'IMAGE_CACHE_INFO'
			let topSwiperStore = uni.getStorageSync(storageKey);
			let topSwiperStoreArr = [];
			if(topSwiperStore){
				for(var i in topSwiperStore){
					let item = {
						id:i,
						titlePictureUrl:topSwiperStore[i]
					}
					topSwiperStoreArr.push(item)
				}
			}
			this.topSwiper = topSwiperStoreArr;
			this.getBanner();
			
		},
		onLoad() {
			let pageName = this.$config.projectName;
			if(pageName){
				uni.setNavigationBarTitle({
					title: pageName
				})
			}
		},
		methods:{
			getImgHeight(e){
				let scale = e.detail.width/e.detail.height;
				const getSystemInfo = uni.getSystemInfoSync();
				let windowWidth = getSystemInfo.windowWidth;
				let windowHeight = Math.round((windowWidth - 30)/scale);
				if(windowHeight > this.ImageHeight){
					this.ImageHeight = windowHeight;
				}
			},
			getChannel(){
				let getJson = `/mobile/channel/info/channels`;
				// if(process.env.NODE_ENV === 'development'){
				// 	getJson = getJson + `?version=0`
				// }
				this.$http.get(getJson).then(res =>{
					console.log('res',res)
					if(res.channelListVo){
						this.channelList = [];
						this.channelList = res.channelListVo;
						this.lie = res.lie;
						
						const getSystemInfo = uni.getSystemInfoSync();
						this.width = (getSystemInfo.windowWidth / this.lie) * 0.5;
						
						uni.setStorageSync('channelList', this.channelList);
						uni.setStorageSync('lie', this.lie);
						uni.setStorageSync('width', this.width);
					}
				})
			},
		    topSwiperTab(e) {
		        var that = this;
		        this.topSwiperIndex = Number(e.target.current);
		    },
			tabChange(e){
				this.current = e.target.dataset.current || e.currentTarget.dataset.current;
			},
			getBanner(){
				let _this = this;
				this.$http.get(`/mobile/indexSetting/app/list`).then(res =>{
					res.forEach((item) =>{
						item.titlePictureUrl =  _this.fileUrl(item.titlePictureUrl);
						_this.getFileCache(item.titlePictureUrl,item.id);
					})
					this.topSwiper = res;
					// console.log('this.topSwiper',this.topSwiper)
				})
			},
			getFileCache(filePath, fileId,title) {
				let _this = this;
				const storageKey = 'IMAGE_CACHE_INFO'
				return new Promise((resolve, reject) => {
					try {
						// #ifdef H5
						// h5不进行缓存，直接下载
						uni.downloadFile({
							url: filePath,
							success: (res) => {
								if (res.statusCode === 200) {
									console.log('下载成功');
									return resolve(res.tempFilePath);
									// _this.saveFilePath(res.tempFilePath,fileId);
								}
							}
						});
						// #endif
						// #ifndef H5
						// 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
						// const cacheFileInfo = uni.getStorageSync(storageKey);
						let cacheFileInfo = Object.assign({}, uni.getStorageSync(storageKey));
						// console.log('cacheFileInfo---',cacheFileInfo[fileId])
						if(cacheFileInfo[fileId]){
							return resolve(cacheFileInfo)
						}
						// 如果没有，执行下载，并存储起来后
						uni.downloadFile({
							url: filePath,
							success: function(res) {
								var filePath = res.tempFilePath;
								resolve(filePath);
								_this.saveFilePath(filePath,fileId,storageKey);
							}
						});
									
						// #endif			
									
					} catch (e) {
						console.error('getImageCache():::', e);
						reject('下载失败'); // 出现异常，这里可以做一些异常处理
					}
				})
			},
			// 将文件下载至本地并存储
			saveFilePath(tempFilePath,fileId,storageKey) {
				uni.saveFile({
					tempFilePath,
					success: ({
						savedFilePath
					}) => {
						console.log('保存---',savedFilePath)
						// 因为请求是异步的，不能保证存储的时间，所以这里总是重新获取缓存内容
						let storageInfo = Object.assign({}, uni.getStorageSync(storageKey));
						storageInfo[fileId] = savedFilePath;
						uni.setStorageSync(storageKey, storageInfo);
					}
				})
			},
			getNoticeList(){
				this.$http.get(`/mobile/life/notice`).then(res =>{
					//console.log('res',res)
					this.list = res.list;
					this.newsList = res.list;
				})
			},
			ToDetail(item){
				if(item.type.value == 'url'){
					this.jumpWebPage(`outSideUrl&url=${item.url}&title=${item.title}`)
				}else{
					if(item.type.value == 'picture'){
						return
					}
					uni.navigateTo({
						url:`/PGov/pages/index/scenic/scenic-detail?id=${item.id}&title=${item.title}`,
					})	
				}
			},
			navTo(item){
				channel.render(item)
			},
			navToWy(){
				let hasLogin = this.$store.state.hasLogin;
				if(hasLogin){
					let userType = this.$store.state.user.ext.type;
					if(userType && userType.value == 'proprietor'){
						this.jump('/PProperty/pages/service/property')
					}else{
						uni.showToast({
							title: '此功能只针对业主开放',
							icon: 'none'
						});
					}
					console.log('321',this.$store.state.user.ext.type.value)
					// 
				}else{
					this.jump('/PProperty/pages/login/login')
				}
			},
			toNext(){
				let jsons = {
					0 : '/PGov/pages/notice/notice-index',
					1 : '/pages/index/task/task',
					/* 2 : '/pages/index/info/info-submission?tab=0', */
					2 : '/pages/apply/submitspecialup/submitspecialup',
				}
				uni.navigateTo({
					url:jsons[this.current],
				})
			},
			detailLink(item){
				let jsons = {
					0 : `/PGov/pages/notice/notice-detail?id=${item.id}&title=${item.title}`,
				}
				uni.navigateTo({
					url:jsons[this.current],
				})
			}
		}

	}
</script>

<style lang="scss">
	.index-main{
		min-height: 100vh;
		background-color: #F2F2F2;
	}
	.index-ad{
		margin-bottom: 10px;
		width: 100%;
		// height: 200px;
		height: calc(100vh / 5.6);
		// min-height: 200px;
		position: relative;
		border-radius: 16upx;
		overflow: hidden;
		.dots{
			padding:4upx 20upx;
			border-radius: 30upx;
			overflow: hidden;
			position: absolute;
			bottom:20upx;
			right: 20upx;
			color:#fff;
			background: rgba(0,0,0,.5);
			font-size:12px;
		}
		.swiper{
		    width: 100%;
		    height: 100%;
			/deep/uni-swiper{
				height: 100%;
			}
			.swiper-item,uni-image{
				width: 100%;
				height: 100%;
				border-radius: 16upx;
			}
		}
	}
	.news-mid-wrap{
		margin-bottom: 20upx;
		border-radius: 16upx;
		overflow: hidden;
		padding: 0px 30upx;
		background-color: #fff;
		// background-color: rgba($color: #1B6EE6, $alpha: 0.1);
	}
	.news-mid {
		padding:14upx 0;
		.mid-left {
			width: 46upx;
			height: 46upx;
			padding: 2upx 20upx 0 0;
		}
	
		.news-swiper {
			height: 60upx;
			line-height: 60upx;
			.news-item {
				font-size: 26upx;
				color: #333;
				padding-right: 30upx;
				// background-color: #F5E5E6;
			}
		}
	}
	
	.index-nav-wrap{
		.index-nav-box{
			margin: 20upx 0;
			padding-top: 30upx;
			border-radius: 16upx;
			width: 100%;
			.index-nav-bg{
				// display: inline-block;
				max-width: 100upx;
				max-height: 100upx;
				border-radius: 50%;
				color: #fff;
				position: relative;
				// margin-bottom: 10upx;
				margin:0 auto 20upx;
				i.iconfont{
					// margin-top: 20upx;
					display: block;
					font-size:44upx;
					// line-height: 100upx;
					font-weight:500;
				}
				text{
					width: 6px;
					height: 6px;
					background-color: #FF0000;
					border-radius: 50%;
					position: absolute;
					top: 0;
					right: -10px;
				}
			}
			.index-nav-text{
				line-height: 30upx;
				font-size: 28upx;
				color: #333;
			}
		}
		.index-nav-item{
			float: left;
			width: 25%;
			margin-bottom: 30upx;
		}
		/* .index-nav-item:nth-child(16n+1){
			.index-nav-bg{
				background: linear-gradient(to bottom, #F9717B 0, #F55B59 100%);
			}
		}
		.index-nav-item:nth-child(16n+2){
			.index-nav-bg{
				background: linear-gradient(to bottom, #ACE756 0, #56D027 100%);
			}
		}
		.index-nav-item:nth-child(16n+3){
			.index-nav-bg{
				background: linear-gradient(to bottom, #8F8FF9 0, #7A7AEE 100%);
			}
		}
		.index-nav-item:nth-child(16n+4){
			.index-nav-bg{
				background: linear-gradient(to bottom, #F9717B 0, #F55B59 100%);
			}
		}
		.index-nav-item:nth-child(16n+5){
			.index-nav-bg{
				background: linear-gradient(to bottom, #79DEC0 0, #5FC1A3 100%);
			}
		}
		.index-nav-item:nth-child(16n+6){
			.index-nav-bg{
				background: linear-gradient(to bottom, #7AB2F9 0, #2A76F9 100%);
			}
		}
		.index-nav-item:nth-child(16n+7){
			.index-nav-bg{
				background: linear-gradient(to bottom, #FABD4F 0, #F99A29 100%);
			}
		}
		.index-nav-item:nth-child(16n+8){
			.index-nav-bg{
				background: linear-gradient(to bottom, #FBA2A7 0, #FC5C65 100%);
				background: linear-gradient(to bottom, #2FD8CB 0, #2AC3B5 100%);
			}
		}
		.index-nav-item:nth-child(16n+9){
			.index-nav-bg{
				background: linear-gradient(to bottom, #ACE756 0, #56D027 100%);
			}
		}
		.index-nav-item:nth-child(16n+10){
			.index-nav-bg{
				background: linear-gradient(to bottom, #8F8FF9 0, #7A7AEE 100%);
			}
		}
		.index-nav-item:nth-child(16n+11){
			.index-nav-bg{
				background: linear-gradient(to bottom, #2FD8CB 0, #2AC3B5 100%);
			}
		}
		.index-nav-item:nth-child(16n+12){
			.index-nav-bg{
				background: linear-gradient(to bottom, #FABD4F 0, #F99A29 100%);
			}
		}
		.index-nav-item:nth-child(16n+13){
			.index-nav-bg{
				background: linear-gradient(to bottom, #F9717B 0, #F55B59 100%);
			}
		}
		.index-nav-item:nth-child(16n+14){
			.index-nav-bg{
				background: linear-gradient(to bottom, #FABD4F 0, #F99A29 100%);
			}
		}
		.index-nav-item:nth-child(16n+15){
			.index-nav-bg{
				background: linear-gradient(to bottom, #ACE756 0, #56D027 100%);
			}
		}
		.index-nav-item:nth-child(16n+16){
			.index-nav-bg{
				background: linear-gradient(to bottom, #7AB2F9 0, #2A76F9 100%);;
			}
		} */
	}
	
	.index-tab-inner{
		width: 100%;
		padding:0 10px 15px;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0 0 6px #E4E4E4;
	}
	.index-tab-title{
		white-space: nowrap;
		overflow-x: auto;
		.index-tab-title-item{
			display: inline-block;
			height: 90upx;
			padding: 0 20upx;
			text-align: center;
			line-height: 90upx;
			font-size: 28upx;
			font-weight: normal;
			color: #666;
			position: relative;
		}
		.index-tab-title-item.current {
			font-size: 30upx;
		    color: #000;
		}
		.index-tab-title-item.current:after {
		    width: 78%;
		}
		.index-tab-title-item:after {
			content: '';
			width: 0;
			height: 0;
			border-bottom: 4px solid #1B6EE6;
			position: absolute;
			left: 50%;
			bottom: 14px;
			-webkit-transform: translateX(-50%);
			transform: translateX(-50%);
			-webkit-transition: .3s;
			transition: .3s;
			opacity: .8;
		}
	}
</style>
