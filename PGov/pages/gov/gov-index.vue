<template>
	<view class="bg">
		<view class="my-nav p15 whiteBg no-pb">
			<view class="my-item flex flexmid arrow" @tap="jump(`/PGov/pages/gov/survey-detail?pageName=机构概况`)">
				<text class="iconfont icon-xinxigongkai"></text>
				<text class="my-text flex1">机构概况</text>
			</view>
			<view class="my-item flex flexmid arrow" @tap="jump(`/PGov/pages/gov/gov-list?channelName=jgsz&pageName=机构设置`)">
				<text class="iconfont icon-jigoushezhi"></text>
				<text class="my-text flex1">机构设置</text>
			</view>
			<view class="my-item flex flexmid arrow" @tap="jumpWebPage('hnzwfw')">
				<text class="iconfont icon-wuyezhanshi"></text>
				<text class="my-text flex1">河南政务服务网</text>
			</view>
			<view class="my-item flex flexmid arrow" @tap="jumpWebPage('sfqgw')">
				<text class="iconfont icon-wuyezhanshi"></text>
				<text class="my-text flex1">示范区官方网站</text>
			</view>
		</view>
	</view>
</template>

<script>
	
</script>

<style lang="scss">
	.my-item{
	    width: 100%;
	    padding: 12px 0;
		border-bottom: 1px solid #f8f8f8;
		.iconfont{
			font-size: 18px;
			margin-right: 10px;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 50%;
			color:#fff;
		}
		&:last-child{
			border-bottom: 0;
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
