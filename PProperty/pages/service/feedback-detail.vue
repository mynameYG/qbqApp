<template>
	<view class="detail-info-wrap">
		<view class="detail-info">
			<view class="detail-wrap no-mb">
				<view class="detail-head">
					<view class="mb5 bold">{{info.title}}</view>
					<view class="color999" style="font-size:12px;">提报时间：{{dateFilter(info.reportDate,'dateminutes') || '-'}}</view>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">类型</text>
					<text class="detail-text flex1">{{info.type.title || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">内容</text>
					<text class="detail-text flex1">
						{{info.content || '-'}}
					</text>
				</view>
			</view>
		</view>
		
		<!-- 处理结果 -->
		<view class="detail-info" v-if="info.replyDate">
			<view class="detail-wrap no-mb">
				<view class="detail-item flex">
					<text class="detail-label">回复时间</text>
					<text class="detail-text flex1">{{dateFilter(info.replyDate,'dateminutes') || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">回复内容</text>
					<text class="detail-text flex1">
						<text class="textarea-auto">
							{{info.replyContent || '-'}}
						</text>
					</text>
				</view>
			</view>
		</view>
		
		
		<!-- 评价结果 -->
		<view class="detail-info" v-if="info.evaluateResult">
			<view class="detail-wrap no-mb">
				<view class="detail-item flex">
					<text class="detail-label">评价时间</text>
					<text class="detail-text flex1">{{dateFilter(info.evaluateDate,'dateminutes') || '-'}}</text>
				</view>
				<view class="detail-item flex">
					<text class="detail-label">评价结果</text>
					<!-- <text class="detail-text flex1">{{dateFilter(info.evaluateDate,'dateminutes') || '-'}}</text> -->
					<view class="detail-text flex1">
						<radio-group >
							<label class="radio vedio-radio">
								<radio value="satisfied" disabled="disabled" :checked="info.evaluateResult == 'satisfied'" color="#1B6EE6" style="transform: scale(0.7);" />
								满意
							</label>
							<label class="radio vedio-radio">
								<radio value="commonly" disabled="disabled" :checked="info.evaluateResult == 'commonly'" color="#1B6EE6" style="transform: scale(0.7);" />
								一般
							</label>
							<label class="radio vedio-radio">
								<radio value="dissatisfied" disabled="disabled" :checked="info.evaluateResult == 'dissatisfied'" color="#1B6EE6" style="transform: scale(0.7);" />
								不满意
							</label>
						</radio-group>
					</view>
				</view>
				<view class="detail-item flex" v-if="info.evaluateContent">
					<text class="detail-label">评价内容</text>
					<text class="detail-text flex1">
						<text class="textarea-auto">
							{{info.evaluateContent || '-'}}
						</text>
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			id:"",
			info:{
				type:{
					title:""
				}
			},
		}
	},
	onLoad(option) {
		this.id = option.id;
	},
	mounted(){
		this.getInfo();
	},
	methods:{
		getInfo(){
			let _self = this;
			this.$http.get(`/mobile/tenement/feedback/${this.id}`).then(res => {
				console.log('re',res)
				this.info =  res;
				
			}).catch(err => {
				uni.showToast({title: err,icon: 'none'})
			});
		}
	}
}
</script>

<style lang="scss">
	@import '@/PStore/common/detail.scss';//公共样式
	.detail-info-wrap{
		overflow: hidden;
		padding-bottom: 20px;
		background-color: #FAFAFA;
		min-height: calc(100vh - 44px);
		// #ifdef APP-PLUS
		min-height: 100vh;
		// #endif
	}
	.detail-wrap .detail-item .detail-label{
		min-width: 60px;
	}
	.detail-info{
		padding:15px;
		padding-bottom: 0;
		.detail-head{
			margin-bottom: 15px;
			padding-bottom: 15px;
			border-bottom:1px solid #F2F2F2;
			font-size:15px;
		}
	}
	/deep/ uni-map{
		width: 100%;
		height: 100%
	}
	.logo-cover{
		position: absolute;
		width:100px;
		height: 26px;
		bottom:1px;
		right:2px;
		background-color: #fff;
	}
	.atts-wrap{
		display: -webkit-box;
		display: -moz-box;
		display: box;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flexbox;
		display: flex;
		flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		-webkit-flex-wrap: wrap;
		-webkit-box-lines: multiple;
		padding-left:70px
	}
	/deep/.atts-wrap .atts-tt{
		width: 60px;
		margin-right: 10px;
		margin-left: -70px;
	}
	/deep/.atts-wrap .atts-item{
		width: 62px;
		margin-right: 10px;
	}
	/deep/.atts-wrap .atts-name{
		display: none;
	}
</style>
