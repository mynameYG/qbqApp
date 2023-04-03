<template>
	<view>
		<view class="search-box">
			<uni-search-bar ref="search" placeholder="输入关键字查询" bgColor="#fff"  radius="10" @input="input"></uni-search-bar>
		</view>
			<mescroll-body ref="mescrollRef" @init="mescrollInit" top="102" @down="downCallback" @up="upCallback">
				<carP v-if="groupCode == 'municipal'" :groupCode="groupCode"></carP>
				<view v-if="list.length > 0" class="store-list pl15 pr15 pt15">
					<view class="shop-list-item" v-for="(item,index ) in list" :key="index"  @tap="navToDetail(item)">
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
			</mescroll-body>
	</view>
</template>
<script>
	
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import carP from '../../components/carP.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				groupCode:"",
				q: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				list: [],
				searchTitle:""//搜索关键字
			}
		},
		components: {
			carP
		},
		onLoad(option){
			this.groupCode = option.code;
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}
		},
		watch: {
			searchTitle(newVal, oldVal) {
				this.searchTitle = newVal;
				this.delay(() => {
					this.search();
				}, 300);
			}
		},
		methods: {
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
					this.list = [];
				}
				let mapType = this.$config.mapType;
				let urljson = `/app/collection/list?group=${this.groupCode}&title=${this.searchTitle}&mapType=${mapType}&page=${this.q.pageNo}&pageSize=${this.q.pageSize}`;
				if(this.groupCode == 'municipal'){
					urljson = `/app/collection/list?type=016&title=${this.searchTitle}&mapType=${mapType}&page=${this.q.pageNo}&pageSize=${this.q.pageSize}`
				}
				this.$http.get(urljson).then(res => {
					this.mescroll.endByPage(res.list.length, Math.ceil(res.total / res.pageSize))
					this.q.total = res.total;
					var changeData = [];
					changeData = res.list;
					this.list = this.list.concat(changeData);
					this.q.pageNo++;
					// console.log('Math.ceil(res.total / res.pageSize)',res.list.length,res.pageSize,this.q.pageNo,Math.ceil(res.total / res.pageSize))
					// let hasNext = this.q.pageNo <= Math.ceil(res.total / res.pageSize) ? true : false;
					// console.log('hasNext',hasNext)
					// this.mescroll.endSuccess(res.list.length, hasNext);
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
					// uni.showToast({title: err,icon: 'none'})
				});
			},
			//获取图片地址
			getImgDaohang(){
				return require("@/static/img/store-location.png");
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
			}
		}
	}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	@import '@/PStore/static/css/store.scss';
	.search-box{
		padding: 15px;
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
