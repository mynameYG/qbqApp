<template>
	<view class="map-wrap">
		<!-- #ifdef H5 || APP-PLUS -->
		<web-view ref="webView" :src="imp" class="webview"></web-view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- 搜索 -->
		<view class="map-search">
		<text style="vertical-align: 7px;font-size:12px;">关键字:</text><input type="text" v-model="InputText" id="txtTitle"><button id="searchBtn" @tap="searchTMap(InputText,'',typeIndex,latitude,longitude)">搜索</button><button @tap="closeWindow()">关闭</button>
		</view> 
		<map id="map"  class="map" :latitude="latitude" :longitude="longitude" :markers="markers"
		scale="15" 
		:circles="circles"
		@markertap="markertap"
		>
		</map>
		<view class="typeWrap" v-if="groupType != 'onlyOne' && typeNum > 1">
			<view class="typeScroll" :class="typeBtnclose?'up':''">
				<view class="item" :class="typeIndex == index?'current':''" v-for="(item,index) in typeList" :key="index" @tap="searchTMap(item.title,item.code,index,latitude,longitude)">{{item.title}}</view>
			</view>
			<view class="btn" :class="typeBtnclose?'down':''" v-if="typeNum > 5"  @tap="typeBtnclose = !typeBtnclose">收起</view>
		</view>
		<view id="content" :class="[{'icon':searchTitle != ''}, {'result':result}]" v-bind:style="{ height: height }">
			<view id="r-result" v-if="resultList.length > 0"  style="max-height:200px;overflow-y: scroll;">
				<view id='result-list'>
					<view class="list-item" :class="lastMarker.id == item.id?'current':''" v-for="item in resultList" :key="item.id" @click="markerShow(item)">
						<view class="inner">
							<view class="title text-ellipsis">{{item.title}}</view>
							<view class="phone text-ellipsis">电话：<text @tap.stop="call(item.phone)">{{item.phone || ''}}</text></view>
							<view class="address text-ellipsis">地址：{{item.address || ''}}</view>
							<view class="distance">{{item.distance}}</view>
						</view>
					</view>
				</view>
			</view> 
			<view v-if="searchTitle !=''" class="search-result">共找到"<span id="inputText" class="inputText text-ellipsis">{{searchTitle}}</span>"相关<span class="num">{{num}}</span>个结果</view>
		</view>
		
		<view v-if="viewshow" class="showData">
			<view class="uni-flex uni-row">
				<view class="text-ellipsis">
					<text style="font-weight: 600;">{{marker.customData.title || ''}}</text>
				</view>
				<view class="iconfont icon-guanbi"  @click="closeshow"></view>
			</view>
			<view class="uni-flex uni-row text-ellipsis" style="-webkit-flex: 1;flex: 1;">
				<text>电话：</text>
				<text>{{marker.customData.phone || ''}}</text>
			</view>
			<view class="uni-flex uni-row text-ellipsis" style="-webkit-flex: 1;flex: 1;">
				<text>地址：</text>
				<text>{{marker.customData.address || ''}}</text>
			</view>
			<text class='more' v-if="moreDome" @tap="more(marker)">更多信息>></text>
			<text class="daohang" @tap="daohang(marker)">到这去>></text>
			<!-- <view class="uni-flex uni-row" style="-webkit-flex: 1;flex: 1;">
				<text>作者：</text>
				<text>{{marker}}</text>
			</view> -->
		</view>
		
		
		<!-- #endif -->
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	var tMap;
	import mapJson from '@/PGov/static/js/mapJson.js'
	function GetDistance( lat1,  lng1,  lat2,  lng2){
	    var radLat1 = lat1*Math.PI / 180.0;
	    var radLat2 = lat2*Math.PI / 180.0;
	    var a = radLat1 - radLat2;
	    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	    s = s *6378.137 ;// EARTH_RADIUS;
	    s = Math.round(s * 10000) / 10000;
	    return s;
	}
	// #endif 
	export default {
		data() {
			return {
				id:"",
				longitude:"",
				latitude:"",
				markers: [],
				polyline:[{
					points: [],
					color: '#1D6AD6',
					width: 7,
					dottedLine: true,
					arrowLine: true
				}],
				polylinePoints:[],
				imp:'',
				// #ifdef MP-WEIXIN
				mapObj: {},
				mapJson:mapJson,
				circles:[],
				typeIndex:-1,
				InputText:"",
				typeList:[],
				groupType:"",
				typeNum:0,
				typeBtnclose:false,
				marker:{},
				lastMarker:{},
				TencentResult:[],
				resultList:[],
				num:0,
				searchTitle:"",
				viewshow: false,
				moreDome:false,
				flag: 0,
				lastX: 0,
				lastY: 0,
				result:false,
				height:"",
				curTypeCode:""//接收到的typecode
				//#endif
			}
		},
		onLoad(option) {
			console.log('onLoad',option)
			let url = this.$config.url(`/app/collection`);
			url = encodeURIComponent(url);
			let sessionData = this.$store.state.user.token ? this.$store.state.user.token : '';
			this.imp = `/static/mapChannel.html?url=${url}&session=${sessionData}
			&mapCenter=${this.$config.mapCenter}&pageName=${option.pageName}&groupType=${option.type}&curType=${option.curTypeCode}`;
			
			// #ifdef MP-WEIXIN
			if(option.pageName){
				uni.setNavigationBarTitle({
					title: option.pageName
				})
			}else{
				uni.setNavigationBarTitle({
					title:'线上地图'
				})
			}
			if(option.type){
				this.groupType = option.type
			}
			if(option.curTypeCode){
				this.curTypeCode = option.curTypeCode
			}
			this.mapObj = uni.createMapContext("map", this);   // 得到map对象
			// #endif
			
		},
		onShow(){
			// #ifdef MP-WEIXIN
			tMap =new this.TMap({key:'Y74BZ-B33CU-LDOVJ-2FAJI-4BMDE-2DB4D'});
			console.log('tMap',tMap)
			// #endif
		},
		mounted() {
			// #ifdef MP-WEIXIN
			this.getUserLocation();
			// #endif
		},
		methods: {
		// #ifdef MP-WEIXIN
		//获取用户位置
		getUserLocation() {
			let _self = this;
			uni.getLocation({
			    type: 'gcj02',
				geocode:true,
			    success: function (res) {
					console.log('res--------',res)
					_self.longitude =  res.longitude;
					_self.latitude =  res.latitude;
					// _self.longitude =  113.543351;
					// _self.latitude =  34.793475;
					
					// _self.longitude =  114.275748;
					// _self.latitude =  35.690643;
					console.log('经度：' + _self.longitude);
					console.log('纬度：' + _self.latitude);
					_self.markers = [];
					_self.markers.push({
						id:"01my",
						width: 25,
						height: 25,
						longitude: _self.longitude,
						latitude: _self.latitude,
						iconPath: '../../../static/img/locationMy.png',
					});
					_self.addCircles(_self.latitude,_self.longitude)
					_self.getTypeList(_self.latitude,_self.longitude);
				},
				fail() {
					uni.showToast({
						title: '找不到您的位置，请开启定位',
						icon: 'none'
					})
				}
			});
		},
		getTypeList(lat,lng){
			this.$http.get(`/app/collection/type`).then(res =>{
				// console.log('rs',res)
				//this.typeList = res
				let groupTypeList =[];
				res.forEach(item => {
					if(this.groupType && this.groupType !='null' && this.groupType !='onlyOne'){
						if(item.sort == this.groupType){
							this.typeNum++;
							this.typeList.push(item)
						}
					}else{
						this.typeNum++;
						this.typeList.push(item)
					}
				})
				
				let index = -1;
				if(this.curTypeCode){
					for(var item of this.typeList){
						index++;
						if(item.code == this.curTypeCode){
							console.log('index---',index,item)
							this.typeIndex = index;
							this.searchTMap(item.title,item.code,this.typeIndex,lat,lng)
							break;
						}
					}
				}else if(this.typeNum == 1){
					this.searchTMap(this.typeList[0].title,this.typeList[0].code,this.typeIndex,lat,lng)
				}
			})
		},
		addCircles(lat,lng){
			this.circles = [{
				latitude:lat,
				longitude: lng,
				radius: 1200,
				strokeWidth: 3,
				strokeStyle:"dashed",
				color: '#ff0000',
				fillColor:"transparent"
			},
			{
				latitude:lat,
				longitude: lng,
				radius: 800,
				strokeWidth: 3,
				strokeStyle:"dashed",
				color: '#0084ff',
				fillColor:"transparent"
			},
			{
				latitude:lat,
				longitude: lng,
				radius: 500,
				strokeWidth: 3,
				strokeStyle:"dashed",
				color: '#ff7200',
				fillColor:"transparent"
			}]
		},
		numFilter(value) {
			// 截取当前数据到小数点后三位
			let tempVal = parseFloat(value).toFixed(7)
			let realVal = tempVal.substring(0, tempVal.length - 1)
			return realVal
		},
		getList(code,TencentResult){
			let _this = this;
			this.$http.get(`/app/collection/list?title=${this.InputText}&type=${code}&mapType=${this.mapJson.mapType}`).then(res =>{
				let listData = res.list;
				console.log('TencentResult',listData,TencentResult);
				// 计算距离
				let start = {
					lng:this.longitude,
					lat:this.latitude
				}
				let listArr = [];
				if(listData.length > 0){
					let v = 0;
					for (var i = 0; i < listData.length; i++) {
						//计算离当前位置的距离;
						let end = {
							lng:this.numFilter(listData[i].lng) - 0,
							lat:this.numFilter(listData[i].lat) - 0
						}
						_this.Distance(start,end,listData[i]).then(data => {
							v++;
							data.list.distance = data.distance;
							listArr.push(data.list);
							if(v == listData.length){
								this.markerData(listArr,TencentResult);
							}
						})
					}
				}else{
					this.markerData('',TencentResult);
				}
			})
		},
		markerData(listArr,TencentResult){
			let _this = this;
			let listData  = [];
			if(listArr){
				listData = listArr;
				let newList = TencentResult.filter(function(item1) {
					     return listArr.every(function(item2) {
					       return _this.similar(item1.title,item2.title)*100 < _this.mapJson.similarity
					     })
					 })
				listData = listData.concat(newList); 
			}else{
				listData = TencentResult;
			}
				listData = listData.sort(_this.sortId);
				console.log('------------listData',listData) 
				let numShow = 0;
				_this.resultList = [];
				_this.markers = [];
				_this.markers.push({
					id:'01my',
					width: 25,
					height: 25,
					longitude: _this.longitude,
					latitude:_this.latitude,
					iconPath: '../../../static/img/locationMy.png',
				});
				for (var t = 0; t < listData.length; t++) {
					if(Math.round(listData[t].distance) < _this.mapJson.Maxdistance){
						numShow ++ ;
						listData[t].distance = _this.kmUnit(listData[t].distance);
						let resultItem = {
							id:t,
							origin:listData[t].origin,
							dataId:listData[t].id,
							lng:listData[t].lng,
							lat:listData[t].lat,
							title: listData[t].title,
							phone: listData[t].phone,
							address: listData[t].address,
							distance:listData[t].distance,
						}
						_this.resultList.push(resultItem);
						_this.markers.push({	//往里面添加循环数据
								id: t,
								origin:listData[t].origin,
								dataId:listData[t].id,
								latitude: listData[t].lat,
								longitude: listData[t].lng,
								iconPath: "../../../static/img/location.png",
								width: 25,
								height: 30,
								customData: {
									title: listData[t].title,
									phone: listData[t].phone,
									address: listData[t].address
								}
						});
						
						console.log('_this.markers',_this.markers)
					}
				}
				_this.num = numShow;
		},
		getArticle(currentId){
			let ArticleUrl = `/app/collection/article/${currentId}`
			this.$http.get(ArticleUrl).then(res =>{
				console.log('-------res',res)
				if(res.length > 0){
					this.moreDome = true;
					/* $('.marker-info').append("<a class='more'>更多信息>></a>") */
				}
			})
		},
		// 事件触发，调用接口
		searchTMap(searchText,searchCode,index,lat,lng){
			this.lastMarker = {};
			this.viewshow = false;
			if(!searchText){
				uni.showToast({
					icon:'none',
					title:"请输入搜索关键字"
				})
				return
			}
			let typeTitle = "";
			console.log('index',index,'searchText',searchText)
			if(index != undefined && index != -1){
				this.typeIndex = index;
				typeTitle = this.typeList[this.typeIndex].title
			}else if(index == -1){
				typeTitle = searchText
			}
		   var _this = this;
		   // 调用接口
		   let searchWords = this.InputText +' '+ typeTitle;
		   this.searchTitle = searchWords;
		   tMap.search({
		      keyword: searchWords,  //搜索关键词
		      location: `${lat},${lng}`,  //设置周边搜索中心点
			  page_size:20,
		      success: function (res) { //搜索成功后的回调
			  // console.log('res------',res)
		        _this.TencentResult = [];
		        for (var i = 0; i < res.data.length; i++) {
		           _this.TencentResult.push({ // 获取返回结果，放到mks数组中
		            title: res.data[i].title,
		            id: res.data[i].id,
					type:{
						code:searchCode
					},
					origin:'tencent',
					address:res.data[i].address? res.data[i].address :'',
					phone:res.data[i].tel ? res.data[i].tel :'',
		            lat: res.data[i].location.lat,
		            lng: res.data[i].location.lng,
					distance:res.data[i]._distance,
		            iconPath: "../../../static/img/location.png", //图标路径
		            width: 25,
		            height: 30
		          })
		        }
				// console.log('_this.TencentResult',_this.TencentResult)
		       /* _this.setData({ //设置markers属性，将搜索结果显示在地图中
		          markers: mks
		        }) */
				
				_this.getList(searchCode,_this.TencentResult);
				
		      },
		      fail: function (res) {
		        console.log(res);
		      },
		      complete: function (res){
		        console.log(res);
		      }
		  });
		},
		closeWindow(){
			this.typeIndex = -1;
			this.InputText = "";
			this.searchTitle = "";
			this.resultList = [];
			this.markers = [];
			this.markers.push({
				id:'01my',
				width: 25,
				height: 25,
				longitude: this.longitude,
				latitude: this.latitude,
				iconPath: '../../../static/img/locationMy.png',
			});
		},
		closeshow() {
			this.viewshow = !this.viewshow;
			this.lastMarker = {};
			this.markerChangeColour();
		},
		markertap(e) {//标记点点击事件
			if(this.marker.id == e.detail.markerId) {
				this.viewshow = !this.viewshow;
			} else {
				let marker = this.markers.find(item => {return item.id == e.detail.markerId});
				if(!marker) {
					this.viewshow = false;
					uni.showToast({
						title: '数据加载失败',
						icon:'none',
						duration: 3000
					});
				} else {
					if(marker.LanguageNews == 1) {
						this.viewshow = false;
						this.isShowSelect = false;
						this.$utils.showLoading('加载中');
						uni.navigateTo({
							url: '/pages/index/languageNews/languageNews?id=' + marker.LanguageNewsId
						});
						this.$utils.hideLoading();
					} else {
						this.moreDome = false;
						this.marker = marker;
						this.lastMarker = this.marker;
						this.viewshow = true;
						this.mapObj.moveToLocation({
							latitude: marker.latitude,
							longitude: marker.longitude
						});	//移动到当前定位地点
						if(this.marker.origin !=  this.mapJson.mapType){
							this.getArticle(this.marker.dataId);// 不是腾讯数据获取文章列表
						}
					}
				};
			}
			
			this.markerChangeColour();
		},
		markerShow(curr){
			this.moreDome = false;
			let marker = this.markers.find(item => {return item.id == curr.id});
			this.marker = marker;
			this.lastMarker = this.marker;
			this.viewshow = true;
			this.mapObj.moveToLocation({
				latitude: marker.latitude,
				longitude: marker.longitude
			});	//移动到当前定位地点
			this.markerChangeColour();
			if(curr.origin !=  this.mapJson.mapType){
				this.getArticle(curr.dataId);// 不是腾讯数据获取文章列表
			}
		},
		markerChangeColour() {//更改图标颜色
			if(this.viewshow) {
				this.marker.iconPath = '../../../static/img/location-lan.png';
				if(this.lastMarker) {
					this.markers.find(item => {
						if(item.id != '01my') {
							if(item.id == this.lastMarker.id){
								item.iconPath = '../../../static/img/location-lan.png';
							}else{
								item.iconPath = '../../../static/img/location.png';
							}
							
						}else{
							item.iconPath = '../../../static/img/locationMy.png';
						}
					});
				}
			} else {
				this.marker.iconPath = '../../../static/img/location.png';
			}
			
		},
		daohang(marker){
			this.toMapAPP(marker.latitude,marker.longitude,marker.customData.title,marker.customData.address)
		},
		more(marker){
			console.log('-------********marker',marker)
			uni.navigateTo({
				url: `/PGov/pages/index/mapChannel-itemInfo?curId=${marker.dataId}&pageName=${marker.customData.title}&destinationLat=${marker.lat}&destinationLng=${marker.lng}
				&address=${marker.customData.address}&phone=${marker.customData.phone}`,
			});
		},
		//打开第三方地图
		toMapAPP(latitude,longitude,name,address){
			// console.log(JSON.stringify(arguments));
			console.log('latitude' +latitude +'longitude' + longitude + 'name' +name)
		    uni.getLocation({
				success: res => {
					console.log('location success', res)
					uni.openLocation({
						latitude: latitude - 0,
						longitude: longitude - 0,
						scale: 18,
						name:name,//地址名称
						address:address,//地址详情
					})
				}
			})
		},
		Distance(startLocation,endLocation,listD){
			let promise = new Promise((resolve, reject) => {
				let distance = GetDistance(startLocation.lat,startLocation.lng,endLocation.lat,endLocation.lng)*1000 ;
				resolve({
					list: listD,
					distance: distance
				});
					/* tMap.calculateDistance({
						from: {
							latitude: startLocation.lat,
							longitude: startLocation.lng
						},
						to: [{
							  latitude:endLocation.lat,
							  longitude:endLocation.lng
							}], //终点坐标
						success: function(res) {//成功后的回调
							var res = res.result;
						  // callback({list:listD,distance: res.elements[0].distance});
						  // resolve(res.elements[0].distance);
						  resolve({
						  	list: listD,
						  	distance: res.elements[0].distance
						  });
						},
						fail: function(error) {
						  console.error('error',error);
						  
						  
						},
						complete: function(res) {
						  console.log('re',res);
						}
					}) */
			});
			return promise;
		},
		sortId(a,b){
			// console.log(a.distance,'a.distance',b.distance)
			let Adistance = a.distance;
			let Bdistance = b.distance;
			return Adistance - Bdistance
		},
		kmUnit(m){
			var v;
			if(typeof m === 'number' && !isNaN(m)){
				if (m >= 1000) {
					v = (m / 1000).toFixed(2) + '公里'
				} else {
					v = Math.round(m) + '米'
				}
			}else{
				v = '0米'
			}
			return v;
		},
		// 计算相似度
		similar(s, t, f) {
		        if (!s || !t) {
		            return 0
		        }
		        var l = s.length > t.length ? s.length : t.length
		        var n = s.length
		        var m = t.length
		        var d = []
		        f = f || 3
		        var min = function(a, b, c) {
		            return a < b ? (a < c ? a : c) : (b < c ? b : c)
		        }
		        var i, j, si, tj, cost
		        if (n === 0) return m
		        if (m === 0) return n
		        for (i = 0; i <= n; i++) {
		            d[i] = []
		            d[i][0] = i
		        }
		        for (j = 0; j <= m; j++) {
		            d[0][j] = j
		        }
		        for (i = 1; i <= n; i++) {
		            si = s.charAt(i - 1)
		            for (j = 1; j <= m; j++) {
		                tj = t.charAt(j - 1)
		                if (si === tj) {
		                    cost = 0
		                } else {
		                    cost = 1
		                }
		                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
		            }
		        }
		        let res = (1 - d[n][m] / l)
		        return res.toFixed(f)
		    },
			handletouchmove: function(event) {
				let _self = this;
				// console.log(event)
				if (this.flag !== 0) {
					return;
				}
				let currentX = event.touches[0].pageX;
				let currentY = event.touches[0].pageY;
				let tx = currentX - this.lastX;
				let ty = currentY - this.lastY;
				let text = '';
				this.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动';
						this.flag = 1;
					//    this.getList();  //调用列表的方法
					} else if (tx > 0) {
						text = '向右滑动';
						this.flag = 2;
					}
				}
				//上下方向滑动
				else {
					if (ty < 0) {
						text = '向上滑动';
						this.flag = 3;
						console.log('text',text)
						_self.result = false;
						_self.height = 'auto';
					//    this.getList();  //调用列表的方法
					} else if (ty > 0) {
						text = '向下滑动';
						this.flag = 4;
						const query = uni.createSelectorQuery().in(this);
						query.select('#content').boundingClientRect(data => {
							console.log('data',data.height,ty)
							let resultListH = data.height;
							let contHe = resultListH - ty;
							// _self.height = data.height;
							if(resultListH > 36){
								if(contHe < 160){
									_self.result = true;
									_self.height = 'auto';
								}else{
									_self.result = false;
									_self.height = contHe + 'px';
								}
							}
							
							
						}).exec(); 
					}
				}
				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX;
				this.lastY = currentY;
				// this.text = text;
				console.log('this.text',this.text)
			},
			handletouchstart: function(event) {
				// console.log(event)
				this.lastX = event.touches[0].pageX;
				this.lastY = event.touches[0].pageY;
			},
			handletouchend: function(event) {
				this.flag = 0;
				// this.text = '没有滑动';
			},
		
		// #endif
		}
	}
</script>

<style lang="scss">
	.map-wrap{
		width: 100%;
		// #ifdef APP-PLUS || MP-WEIXIN
		height: 100vh;
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		height: calc(100vh - 94px);
		// #endif
		position: relative;
	}
	.webview{
		width:100%;
		height: 100vh;
		overflow: hidden;
	}
	.iframe{
		width:100%;
		height: 100vh;
		overflow: hidden;
	}
	// #ifdef MP-WEIXIN
	.map{
		width: 100%;
		height: 100vh;
	}
	.map-search{
		position: fixed;
		top:0;
		left:0;
		width:100%;
		z-index: 99;
		padding:10px;
		box-sizing: border-box;
		font-size:13px;
		background: rgba(255,255,255,.8);
	}
	.map-search input{
		display: inline-block;
		border: 1px solid #e4e4e4;
		padding: 4px 3px;
		border-radius: 5px;
		width: 75px;
		height: 25px;
		line-height: 25px;
		margin-right: 2px;
		font-size: 12px;
		box-sizing: border-box;
		background-color: #fff;
	}
	.map-search button{
		display: inline-block;
		background: #1B6EE6;
		color: #fff;
		border: 0;
		width:56px;
		height: 25px;
		line-height: 25px;
		border-radius: 3px;
		margin-right: 3px;
		font-size: 12px;
	}
	.typeWrap{
		z-index: 999;
		position: fixed;
		top: 46px;
		right: 10px;
		padding-bottom: 28px;
		.btn{
			position: absolute;
			bottom:0;
			left:0;
			min-height: 16px;
			margin-top: 0;
			border: 0;
			width: 70px;
			text-align: center;
			padding: 14px 0;
			border-radius: 3px;
			box-shadow: 0 0 6px #e4e4e4;
			background: url(../../../static/img/icon-up.png) #fff no-repeat center;
			background-size: 20px;
			font-size:0;
		}
	}
	.btn.down{
		transform: rotate(180deg);
		transition: all .3s ease;
	}
	.typeScroll{
		width: 70px;
		// #ifdef APP-PLUS ||  MP-WEIXIN
		max-height: calc(100vh - 378px);
		// #endif
		overflow-y: auto;
		.item{
			margin-top: 0;
			border: 0;
			width: 70px;
			text-align: center;
			padding: 6px 0;
			margin-bottom: 2px;
			border-radius: 3px;
			box-shadow: 0 0 6px #e4e4e4;
			background: #fff;
			font-size: 12px;
		}
		.current{
			color:#fff;
			background-color: #1B6EE6;
		}
	}
	.typeScroll.up{
		transition: all .3s ease;
		height: 38px;
		overflow: hidden;
	}
	.map_bottom {
		height: 90rpx;
		.map_text {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0px;
			margin: 20rpx 0;
			background: #fff;
			padding: 0 15px;
			width: 600rpx;

			.row1 {
				display: flex;
				align-items: center;
				text {
					margin: 5px 0;
					display: block;
					font-size: 16px;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.h1 {
					margin: 15px 0;
					font-size: 18px;
				}

				.h2 {
					margin-left: 15rpx;
					font-size: 14px;
					color: grey;
				}
			}
		}
	}
	#content{
		position: fixed;
		bottom:0;
		min-height: 33px;
		left:0;
		width:100%;
		z-index: 99;
		opacity: 1;
	}
	.icon:before{
		content: "";
		position: absolute;
		top:-10px;
		left:50%;
		width:30px;
		margin-left: -15px;
		height: 4px;
		border-radius: 3px;
		background-color: rgba(153,153,153,.6)
	}
	#result-list{
		width:100%;
		margin:0;
		padding:0;
		box-sizing: border-box;
		overflow:hidden;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
		border-radius: 5px;
		} 
	#result-list .list-item {
		position: relative;
		width:100%;
		border-bottom:1px solid #FAFAFA
	}
	#result-list .list-item .inner{
		padding:15px;
		padding-top: 8px;
		padding-bottom: 8px;
		background-color: #fff;
		font-size:12px;
	}
	#result-list .list-item.current .inner{
		background-color: #fff0f0;
	}
	#result-list .list-item  .inner view{
		margin:0;
		padding:0;
		line-height:1.6;
		color: #666;
	}
	#result-list .list-item  .inner .title{
		font-weight: 600;
	}
	#result-list .list-item .inner .distance{
		position: absolute;
		top:9px;
		right:10px;
	}
	#content.result #result-list{
			height: 0;
			transition:all 0.3s ease;
		}
		.result:before{
			position: absolute;
			top:-13px;
			left:50%;
			border-radius: 3px;
			content: '';            
			display: block;    
			margin-left:-7px;
			width:15px;            
			height:15px;    
			background-color: transparent;
			border-right: 4px solid rgba(153,153,153,.6);            
			border-top:4px solid rgba(153,153,153,.6);            
			-webkit-transform: rotate(315deg); /*箭头方向可以自由切换角度*/            
			transform: rotate(315deg);
		}
	.search-result{
		margin:0;
		padding:10px 15px;
		font-size: 12px;
		background:rgba(255,255,255,.6);
		text-align: center;
	}
	.search-result .inputText{
		display: inline-block;
		vertical-align: -3px;
		// #ifdef MP-WEIXIN
		vertical-align: -4px;
		 // #endif
		color:#1B6EE6;
		font-weight: 600;
		max-width: 90px;
		overflow: hidden;
	}
	.num{
		color:#1B6EE6;
		font-weight: 600;
	}
	
	.showData {
		padding-bottom:5px;
		top: 50%;
		position: absolute;
		left: 50%;
		width: 60%;
		color: #000000;
		background-color: #ffffff;
		font-size: 12px;
		transform: translate(-60%,-138%);
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
		}
	.showData:before{
		position:absolute;
		content:'';
		bottom:0;
		left: 60%;
		position: absolute;
		height: 0;
		width: 0;
		border: solid transparent;
		pointer-events: none;
		border-width: 7px;
		margin-left: -8px;
		border-top-color: #fff;
		top: 100%;
	}
	.showData .daohang {
		padding-right: 10px;
		float:right;
		font-size:14px;
		color:#1B6EE6;
		text-align:right;
	}
	.showData .more{
		float:left;
		display: inline-block;
		padding-left: 10px;
		font-size:14px;
		color:#1B6EE6;
		text-align:left;
	}	
	.showData .iconfont{
		position: absolute;
		top: 2px;
		right: 3px;
	}
	.uni-row{
		width: 90%;
		margin: 5px auto!important;
		line-height:20px
	}
	.uni-row > text:last-child {
		color: gray;
		width: 67%;
	}
	.close{
		width: 15px;
		height:15px;
		margin-top: -10rpx;
		margin-right:-30rpx;
	}
	// #endif
</style>
