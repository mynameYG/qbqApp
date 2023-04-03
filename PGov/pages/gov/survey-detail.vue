<template>
	<view class="yh-bg">
		<view class="whiteBg-opacity p15 radius6">
			<!-- <view class="field-title fs16">{{title}}</view> -->
			<view class="art-con">
				<view class="tc bold fs15 mb5">基本情况</view>
				<p>鹤壁市城乡一体化示范区于2012年8月经省政府批准成立，位于鹤壁市区以南、淇县县城以北、南水北调中线工程以东、钜新线以西，总规划面积130平方公里，包括60平方公里的城市居住和生态功能区、25平方公里的高新技术产业开发区、45平方公里的生态高效农业发展区。示范区直管区域40平方公里，下辖古城、淇水湾2个办事处、19个行政村，人口6万人。</p>
				<p>按照省委〔2013〕14号文件要求，城乡一体化示范区是城乡统筹、“三化”协调发展的试验区，是“一二三产复合，经济生态人居融合”的功能区，将成为鹤壁市人口集中、产业集聚、土地集约的样板区和全省统筹协调发展的示范区。</p>
				<view class="tc bold fs15 mb5">发展现状</view>
				<p>在产业发展上，按照市委、市政府战略部署，我们始终坚持“招商选资不动摇”、“招大引强不动摇”、“招名牌引品牌不动摇”、“发展高科技工业、现代农业和现代服务业不动摇”等四个不动摇，广泛开展了 “大招商、招大商”活动，引进了一批大项目、好项目。按照产业定位和功能分区，示范区规划了三个片区：一是淇水湾片区，主要发展第三产业，重点发展企业总部、电子商务、现代教育、现代医疗、互联网+等为核心的现代服务业。二是淇河南片区，主要发展第二产业，重点发展金属镁精深加工、汽车零部件、电子信息等高科技项目为主的先进制造业。三是高速东片区，主要发展第一产业，重点发展都市生态农业、旅游观光农业、休闲创意农业等现代农业。</p>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				id:"",
				unread:"",
				news:{},
				file: [],
				previewImgList:[],
				content:"",
				title:""
			}
		},
		onLoad(option) {
			this.id = option.id;
		},
		mounted() {
			/* this.init(); */
		},
		methods: {
			init() {
				this.$http.get(`/mobile/life/notice/${this.id}`).then(res => {
					this.news = res.notice;
					this.content = res.notice.content;
					for (var i = 0; i < res.attachs.length; i++) {
						if(res.attachs[i].fileType == 'image' || this.matchType(res.attachs[i].filename) == 'image'){
							this.previewImgList.push(this.fileUrl(res.attachs[i].url))
						}
						this.file.push({
							url:this.fileUrl(res.attachs[i].url),
							fileName:res.attachs[i].filename,
							fileType:this.matchType(res.attachs[i].filename)
						})
					}
					
					if (this.unread === 'true') {
						let pages = getCurrentPages();
						if(pages.length > 1){
							// 获取上一级页面，即pageA的page对象
							let callback = pages[pages.length - 2].$vm['loadData'];
							callback && callback('refresh');
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.art-con {
		font-size: 14px;
		line-height: 24px;
		/deep/ img {
			max-width: 100%;
			height:auto!important;
			max-height: auto;
			margin-top:15px;
		}
		p{
			text-indent: 2em;
		}
	}
	.field-title{
		font-weight: 600;
	}
	.field-light{
		text-align: right;
		color:#999;
		font-size:12px;
	}
</style>
