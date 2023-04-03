<template>
	<view class="bg p15 channelPage">
		<view class="channel-banner" :style="{height:ImageHeight + 'px'}">
			<image :src="getBanner()" @load="getImgHeight"></image>
		</view>
		<view class="index-nav-wrap">
			<view class="index-nav-box clearfix whiteBg">
				<view class="index-nav-item tc" :style="{width:100/lie + '%'}" v-for="(item,index) in channelList" :key="index" @tap="JumpLink(item)">
					<view class="index-nav-bg flex flexmid" :style="{background:item.colour , width:width + 'px' , height:width + 'px'}">
						<i class="iconfont flex1" :class="item.icon" ></i>
					</view>
					<view class="index-nav-text">{{item.title || item.name}}</view>
				</view>
			</view>
		</view>
		<view v-for="(item,index) in channelList" :key="index" v-if="index < 2"  class="news-model mb15 p15 whiteBg">
			<view class="news-title">{{item.title || item.name}}</view>
			<view class="news-list">
				<template v-if="index == 0">
					<template v-if="OneList.length > 0" >
						<view v-for="(child,i) in OneList" :key="i" v-if="i < 2"
							@tap="navToDetail(child,item)"
						class="news-list-item text-ellipsis arrow">{{child.name || child.title}}</view>
						<view class="more" @tap="JumpLink(item)">查看更多</view>
					</template>
					<view class="emptyText" v-else>暂无内容</view>
				</template>
				<template v-if="index == 1">
					<template v-if="TwoList.length > 0" >
						<view v-for="(child,i)  in TwoList" :key="i" v-if="i < 2"
						@tap="navToDetail(child,item)"
						class="news-list-item text-ellipsis arrow">{{child.name || child.title}}</view>
						<view class="more" @tap="JumpLink(item)">查看更多</view>
					</template>
					<view class="emptyText" v-else>暂无内容</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import channelUrlJson from '@/common/channel_Url.js'
	export default {
		data() {
			return {
				ImageHeight:100,
				code:"",
				width:"",
				lie:"",
				channelList: [],
				OneList:[],
				TwoList:[],
			}
		},
		onLoad(option){
			this.code = option.code.split('?')[0];
			if(this.code == 'zwfw'){
				uni.setNavigationBarTitle({
					title:"政务服务"
				})
			}
		},
		mounted(){
			if(this.code == 'zwfw'){
				this.getChannel();
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
			getBanner(){
				return require(`@/static/img/banner_${this.code}.png`);
			},
			getChannel(){
				let _self = this;
				this.$http.get(`/mobile/channel/info/all`).then(res =>{
					res.forEach(item => {
						if(item.biz == this.code){
							this.$http.get(`/mobile/channel/info/channels/${item.id}`).then(res =>{
								_self.channelList = res;
								_self.getOneList();
								_self.getTwoList();
								if(res.length < 6){
									_self.lie = res.length;
								}else{
									_self.lie = 5
								}
								
								const getSystemInfo = uni.getSystemInfoSync();
								_self.width = (getSystemInfo.windowWidth / _self.lie) * 0.5;
							})
						}
					})
				})
			},
			getOneList(){
				console.log('channelList',this.channelList[0])
				this.$http.get(`/mobile/channel/info/${this.channelList[0].id}`).then(res =>{
					this.OneList = res.list
				})
			},
			getTwoList(){
				this.$http.get(`/mobile/channel/info/${this.channelList[1].id}`).then(res =>{
					this.TwoList = res.list
				})
			},
			JumpLink(c){
				console.log('c',c)
				if(c.childrenChannel){
					this.jump(`/PBusiness/pages/service/articleModel/articleModel-channel-${c.channelStyle.code}?pageName=${c.name}&channelId=${c.id}&childrenChannel=${c.childrenChannel}&channelIcon=${c.icon}`)
				}else{
					this.jump(`/PBusiness/pages/service/articleModel/articleModel-infoList-s?pageName=${c.name}&channelId=${c.id}&childrenChannel=${c.childrenChannel}&channelIcon=${c.icon}`)
				}
			},
			navToDetail(child,channel){
				uni.navigateTo({
					url: `/PBusiness/pages/service/articleModel/articleModel-detail?id=${child.id}&pageName=${child.title}&channelId=${this.tabId}`
				});
			}
		}

	}
</script>

<style lang="scss">
	.index-nav-box{
		.index-nav-item:nth-child(4n+1){
			.index-nav-bg{
				background: linear-gradient(#ffb934 0px, #fa3 100%);
			}
		}
		.index-nav-item:nth-child(4n+2){
			.index-nav-bg{
				background: linear-gradient(#fe442b 0px, #fc3425 100%);
			}
		}
		.index-nav-item:nth-child(4n+3){
			.index-nav-bg{
				background: linear-gradient(#5feafe 0px, #2ab3fc 100%);
			}
		}
		.index-nav-item:nth-child(4n+4){
			.index-nav-bg{
				background: linear-gradient(#fc3964 0px, #f82b53 100%);
			}
		}
	}
	.my-item:nth-child(1) .iconfont{
		font-size: 16px;
		background-color: #F88799;
	}
	.my-item:nth-child(2) .iconfont{
		font-size: 16px;
		background-color:#62C6FF;
	}
	.my-item:nth-child(3) .iconfont{
		background-color:#CC9CFD;
	}
	.my-item:nth-child(4) .iconfont{
		background-color:#7A7AEE;
	}
	.my-item:nth-child(5) .iconfont{
		background-color:#28C689;
	}
	.my-item:nth-child(6) .iconfont{
		background-color:#56D027;
	}
	.my-text{
	    font-size: 14px;
	    color:#333;
	    line-height: 26px;
	}

</style>
