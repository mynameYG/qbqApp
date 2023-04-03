<template>
	<view class="schedule-wrap yh-bg">
		<view class="calendar-box">
			<uni-calendar :slide="slide" :insert="true" :fixed-heihgt="fixedHeihgt" :disable-before="false" :start-date="startDate"
			 :end-date="endDate" :selected="selected" :showMonth="showMonth" @change="change" @to-click="toClick" />
		</view>
		<view class="room-wrap">
			<view class="room-box">
				<view class="room-status-list flex flexmid flexcenter">
					<view class="room-status-list flex flexmid flexcenter">
						<view class="room-status-item flex1 tr">
							<text class="room-status">可预约</text>
						</view>
						<view class="room-status-item flex1 tc">
							<text class="room-status">已预约</text>
						</view>
					</view>
				</view>
				<view class="room-list no-pb" style="margin-top:20px">
					<template v-if="list.length > 0">
						<view class="room-item" v-for="(item, index) in list" :key="index">
							<view class="room-time-list">
								<view class="room-time-item" :class="item.class">
									<view class="room-time-title text-ellipsis flex flexmid">
										<view class="flex1">{{dateFilter(item.startTime, "minutes")}} —— {{dateFilter(item.endTime, "minutes")}}</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<view class="room-time-item" v-else>
						<view class="room-time-title color666 text-ellipsis tc">暂无预约</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniCalendar from "../../components/uni-calendar/uni-calendar"

	function getDate(date, AddDayCount = 0) {
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		let dd = new Date(date)
		dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
		let y = dd.getFullYear()
		let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return y + '-' + m + '-' + d
	}
	export default {
		components: {
			"uni-calendar": uniCalendar
		},
		data() {
			/**
			 * 时间计算
			 */
			return {
				id:"",
				selected: [],
				fixedHeihgt: false,
				slide: '',
				startDate: getDate(new Date(), -999),
				endDate: getDate(new Date(), 999),
				month: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1,
				day: new Date().getFullYear() + "-" + ((new Date().getMonth() + 1) < 10 ? "0" : "") + (new Date().getMonth() + 1) +
					"-" + (new Date().getDate() < 10 ? "0" : "") + new Date().getDate(),
				list: [],
				sureList:[],//可预约时间
				showMonth: false,
				show1: false,
				manage: false
			};
		},
		onLoad(opts) {
			this.id = opts.id;
			this.manage = opts.manage !== 'false';
			if (!this.manage) {
				uni.setNavigationBarTitle({
					title: '场地占用情况'
				})
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$http.get(`/mobile/appoint/area/${this.id}/times`, {date: this.day}).then(res => {
					//console.log('res',res)
					this.list = [];
					this.sureList = [];
					res.forEach((item) => {
						let dataF = this.dateFilter(item.date,'date')
						/* 可预约时间 */
						if(dataF == this.day){
							item.infos.forEach((m) => {
								this.list.push({
									date:dataF,
									class:"ytg-color",
									startTime:m.start,
									endTime:m.end
								});
							})
						}
						if(dataF == this.day && item.appoints.length > 0){
							this.list.forEach((m) => {
								let programs = item.appoints.filter(i => {
									return i.end === m.endTime;
								});
								if (programs != null && programs.length > 0) {
									m.class = "yjj-color"
								} 
								console.log('programs',programs)
							})
						}
						/* 打点 */
						if(item.appoints.length > 0){
							this.selected.push({
								date: dataF
							})
						}
					})
				});
			},
			change(e) {
				this.day = e.year + "-" + e.month + "-" + this.add0(e.date);
				this.init();
			},
			toClick(e) {
				this.day = e.year + "-" + e.month + "-" + this.add0(e.date);
				this.init();
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/PGov/static/css/calendar.scss";

	.schedule-wrap {
		height: calc(100vh) !important;
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}
	.room-list{
		padding-bottom: 30px;
	}
	
</style>
