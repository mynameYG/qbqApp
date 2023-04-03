<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>
<script>
	import webUrl from '@/PProperty/static/js/webUrl.js'
    export default {
        data() {
            return {
				url:"",
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		watch:{
			url(val){
				this.url = val
			}
		},
		onLoad(option){
			console.log('option',option)
			let _self = this;
			if(option.type == 'outSideUrl'){
				_self.url = option.url;
				uni.setNavigationBarTitle({
					title: option.title
				})
				return;
			}
			webUrl.forEach(item => {
				if(option.type == item.type){
					_self.url = item.url;
					uni.setNavigationBarTitle({
						title: item.title
					})
				}
			})
		}
    }
</script>
<style>
</style>
