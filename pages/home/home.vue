<template>
	<view>
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view>
		<!-- #endif -->

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" circular @change="swiperChange" autoplay="true">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPage(item.jump.params)">
					<image :src="item.pictureUrl" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 标签 -->
		<view class="tag padding-lr bg-white">
			<view class="" v-for="(item,index) in tags" :key="index">
				<text class="iconfont" :class="item.src"></text>
				<text class="text-sm text-grey" style="margin-left: 5px">{{item.name}}</text>
			</view>
		</view>
		<!-- 版块入口 -->
		<swiper :indicator-dots="true" class="square-dot" style="height: 410rpx">
			<swiper-item>
				<view class="cu-list grid" :class="['col-5','no-border']">
					<view class="cu-item" v-for="(item,index) in sectionList" :key="index" v-if="index<5*2" @tap="navToDetailPage(item.jump.params)">
						<view class="item">
							<image :src="item.pictureUrl"></image>
						</view>
						<text>{{item.advertName}}</text>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="cu-list grid" :class="['col-5','no-border']">
					<view class="cu-item" v-for="(item,index) in sectionList" :key="index" v-if="index>=5*2">
						<view class="item">
							<image :src="item.pictureUrl"></image>
						</view>
						<text>{{item.advertName}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 优惠券 -->
		<view class="grid" :class="['col-3','no-border']">
			<view class="cu-item padding-xs" v-for="(item,index) in couponsList" :key="index" v-if="index<3*2" @tap="getcoupons">
				<view class="bg-gradual-orange padding-xs flex align-center">
					<view class="left">
					
						<view class="text-xl ">
							{{item.discountType==0?'¥'+item.discount:item.discount+'折'}}
						</view>
						<text class="text-xs ">满{{item.quota}}可用</text>
						
						<!-- <view class="text-xs">
						{{item.limitStr}}
					</view> -->
						<view class="limitStr">
							<text class="text-xs ">{{item.limitStr}}</text>
						</view>
					</view>
					<view class="right">
						<text class="text-sm">立即领取</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 活动专区 -->
		<view class="section-header margin-top-xs">
			<image :src="activeTitle"></image>
		</view>
		<view class="grid col-4  bg-white">
			<view class="margin-tb-sm text-center" v-for="(item,index) in timeArr" :key="index">
				<button @click="changeSelectedTime(index)" class="cu-btn round " :class="timeSelectedIndex===index? 'bg-orange': 'bg-gray'">{{item.stageTime}}</button>
			</view>
		</view>
		<scroll-view class="floor-list bg-white" scroll-x>
			<view class="scoll-wrapper">
				<view v-for="(item, index) in timeActiveGoodsArr" :key="index" class="floor-item" @click="goProductDetail">
					<image :src="item.image" mode="aspectFill"></image>
					<text class="title clamp">{{item.name}}</text>
					<text class="price  text-sm">￥{{item.pcpPrice}}</text>
					<text class="text-bold">￥</text><text class="text-bold text-xl" style="line-height: 1.0">{{item.jdPrice}}</text>
				</view>
			</view>
		</scroll-view>
		<view class="margin-top-sm">
		</view>
		<!-- 品牌推荐 -->
		<view class="section-header">
			<image :src="activeTitle2"></image>
		</view>
		<view>
			<image class="ad-banner-img" :src="bigAdsbanner"></image>
		</view>
		<scroll-view class="floor-list bg-white" scroll-x>
			<view class="scoll-wrapper">
				<view v-for="(item, index) in adGoodsArr" :key="index" class="banner-item" @click="navToDetailPage(item.jump.params)">
					<image :src="item.pictureUrl" mode="aspectFill"></image>
				</view>
			</view>
		</scroll-view>

		<!-- 热卖榜单 -->
		<view class="section-header margin-top-sm">
			<image :src="hotListTitle"></image>
		</view>
		<scroll-view class="floor-list bg-white " scroll-x>
			<view class="scoll-wrapper">
				<view v-for="(item, index) in hotList" :key="index" class="banner-item2 bg-yellow" @click="navToDetailPage(item.jump.params)">
					<view class="">
						<text class="title clamp text-sm text-brown">{{item.advertName}}</text>
					</view>

					<image :src="item.skuImg" mode="aspectFill"></image>
					<text class="title clamp text-sm ">{{item.marketSlogan}}</text>

				</view>
			</view>
		</scroll-view>
		<!-- 超值量贩 -->
		<view class="section-header margin-top-sm">
			<image :src="deserveListTitle"></image>
		</view>
		<view class="uni-flex uni-row bg-white">
			<view class="deserve-left margin-top-sm " @click="navToDetailPage(secondDataList[1].leftAd.jump.params)">
				<image :src="deserveLeftImg"></image>
			</view>
			<view class=" margin-sm deserve-right">
				<view class="cu-list grid col-2">
					<view class=" margin-bottom" v-for="(item,index) in deserveRightList" :key="index" v-if="index<4" @click="goProductDetail">
						<image :src="item.image"></image>
						<text class="title clamp text-sm text-grey" style="line-height: 1.0">{{item.name}}</text>
						<text class="text-bold">￥</text><text class="text-bold text-xl" style="line-height: 1.0">{{item.jdPrice}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 好物橱窗 -->
		<view class="section-header margin-top-sm">
			<image :src="goodWindowTitle"></image>
		</view>
		<swiper class="goods-card-swiper bg-white" :indicator-dots="false" :circular="true" :autoplay="true" interval="5000"
		 duration="500" @change="cardSwiper">
			<swiper-item v-for="(item,index) in goodWindowList" :key="index" :class="cardCur==index?'cur':''">
				<view class="flex-direction swiper-item" :style="{ 'background-color': item.backgroundColorDeep }">
					<view class="flex auth">
						<image :src="item.authorPic" mode="aspectFill"></image>
						<text class="text-white">{{ item.authorName}}</text>

					</view>
					<text class="text-white msg">{{item.recommendReason}}</text>
					<image :src="item.skuPic" mode="aspectFill"></image>
					<text class="text-white margin-top text-lg"> 去看看> </text>

				</view>
			</swiper-item>
		</swiper>
		<!-- 为你推荐 -->
		<view class="section-header margin-top-sm">
			<image :src="recommendedListTitle"></image>
		</view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in recommendedTabbarList" :key="index"
			 @tap="tabSelect" :data-id="index">
				{{item.name}}
			</view>
		</scroll-view>
		<view v-for="(item,index) in currentRecommendList" :key="index">
			<view class="grid bg-white" :class="['col-3','no-border']">
				<view class="cu-item padding-xs" v-for="(data,index2) in item.composeList" :key="index2">
					<view v-if="data.template==='skuInfo'" class="bg-white goods-info skuInfo" @click="goProductDetail">
						<image :src="data.skuPic" mode="aspectFill"></image>
						<view class="skuName">
							<text class="title clamp text-sm text-grey">{{data.skuName}}</text>
						</view>
						<text class="text-bold">￥</text><text class="text-bold text-xl" style="line-height: 1.0">{{data.price}}</text>
					</view>
					<view v-else-if="data.template==='activity'" @click="navToDetailPage(data.jump.params)" class="goods-info active"
					 :style="{'background-color': data.backgroundColor}">
						<image :src="data.backgroundImg" mode="aspectFill"></image>
					</view>
					<view v-else class="goods-info tabInfo padding" @click="goProductDetail" :style="{'background-color': data.tabList[0].backgroundColor}">
						<view class="title" :style="{'background-color':data.tabList[0].nameAndBubbleColor}">
							<!-- <text>{{data.tabList[0].title}}</text> -->
						</view>
						<image :src="data.tabList[0].backgroundImg" mode="aspectFill"></image>
						<image :src="data.tabList[1].backgroundImg" mode="aspectFill"></image>

					</view>

				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniGrid from "../../components/uni-grid/uni-grid.vue"
	import uniGridItem from "../../components/uni-grid-item/uni-grid-item.vue"
	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				carouselList: [],
				sectionList: [],
				couponsList: [],
				activeList: [],
				swiperCurrent: 0,
				tags: [{
						src: "iconquality",
						name: "品质好物"
					},
					{
						src: "iconqian4",
						name: "买贵就陪"
					},
					{
						src: "iconkuaidi",
						name: "急速送达"
					},
					{
						src: "iconwuyoushouhou",
						name: "无忧售后"
					},
				],
				timeSelectedIndex: 0,
				timeArr: [],
				timeActiveGoodsArr: [],
				adGoodsArr: [],
				bigAdsList: [],
				hotList: [],
				secondDataList: [],
				cardCur: 0,
				TabCur: 0,
				scrollLeft: 0,
				currentRecommendList: [],
			}
		},

		onLoad() {
			this.loadData();
			this.loadSecondData();
			this.loadRecommendList();
		},
		computed: {
			activeTitle() {
				if (this.activeList.length <= 0) {
					return '';
				}
				let item = this.activeList[0];
				return item.floorTitle.backgroundImg;
			},
			activeTitle2() {
				if (this.activeList.length <= 1) {
					return '';
				}
				let item = this.activeList[1];
				return item.floorTitle.backgroundImg;
			},
			bigAdsbanner() {
				if (this.bigAdsList.length == 0) {
					return '';
				}
				let item = this.bigAdsList[0];
				console.log(item.pictureUrl);
				return item.pictureUrl;
			},
			hotListTitle() {
				if (this.secondDataList.length == 0) {
					return '';

				}
				let item = this.secondDataList[0].floorTitle;
				return item.backgroundImg;
			},
			deserveListTitle() {
				if (this.secondDataList.length == 0) {
					return '';

				}
				let item = this.secondDataList[1].floorTitle;
				return item.backgroundImg;
			},
			deserveLeftImg() {
				if (this.secondDataList.length == 0) {
					return '';

				}
				let item = this.secondDataList[1].leftAd;
				return item.pictureUrl;
			},
			deserveRightList() {
				if (this.secondDataList.length == 0) {
					return '';
				}
				let list = this.secondDataList[1].rightWaresList;
				return list;
			},
			goodWindowTitle() {
				if (this.secondDataList.length == 0) {
					return '';

				}
				let item = this.secondDataList[2].floorTitle;
				return item.backgroundImg;
			},
			goodWindowList() {
				if (this.secondDataList.length == 0) {
					return '';
				}
				let list = this.secondDataList[2].goodList;
				return list;
			},
			recommendedListTitle() {
				if (this.secondDataList.length == 0) {
					return '';
				}
				let item = this.secondDataList[3].floorTitle;
				return item.backgroundImg;
			},
			recommendedTabbarList() {
				if (this.secondDataList.length == 0) {
					return '';
				}
				let list = this.secondDataList[3].tabList;
				return list;
			}

		},
		methods: {
			// #ifndef MP
			// 标题栏input搜索框点击
			onNavigationBarSearchInputClicked: async function(e) {
				this.$api.msg('点击了搜索框');
			},
			//点击导航栏 buttons 时触发
			onNavigationBarButtonTap(e) {
				const index = e.index;
				if (index === 0) {
					this.$api.msg('签到成功');
				} else if (index === 1) {
					this.$api.msg('点击更多');

				} else if (index === 2) {
					this.$api.msg('感谢关注');
				}
			},
			// #endif
			getcoupons() {
				this.$api.msg('领取成功');

			},
			async loadData() {
				let data = await this.$api.json('homeSmtIndex');
				this.carouselList = data.floorList[0].adsList;
				let sections = data.floorList[2].adsList;
				if (sections.length > 0) {
					for (let i = 0; i < sections.length; i++) {
						let obj = sections[i];
						this.sectionList.push(obj);
					}
				}
				let coupons = data.floorList[3].data;
				for (let i = 0; i < coupons.length; i++) {
					let objs = coupons[i];
					console.log(objs);
					for (let j = 0; j < objs.length; j++) {
						this.couponsList.push(objs[j]);
					}
				}

				let obj = data.floorList[4];
				this.timeArr = obj.waresList;
				this.timeActiveGoodsArr = this.timeArr[0].groupInfoList;

				this.activeList.push(obj);
				let activeObj = data.floorList[5];
				this.adGoodsArr = activeObj.adsList;
				this.bigAdsList = activeObj.bigAdsList;
				this.activeList.push(activeObj);

				// let goodsList = await this.$api.json('goodsList');
				// this.goodsList = goodsList || [];
			},
			async loadRecommendList() {
				let data = await this.$api.json('homeRecommendList');
				this.currentRecommendList = data.result.feedResultList;
			},
			async loadSecondData() {
				let data = await this.$api.json('homeSmtSecond');
				this.secondDataList = data.floorList;
				this.hotList = data.floorList[0].adsList;
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//更换时间
			changeSelectedTime(i) {
				this.timeSelectedIndex = i;
				this.timeActiveGoodsArr = this.timeArr[i].groupInfoList;
			},
			//详情页
			navToDetailPage(item) {
				uni.navigateTo({
					url: '../web-view/web-view?url=' + item.url
				})
			},
			//前往商品详情
			goProductDetail() {
				uni.navigateTo({
					url: '../detail/detail'
				})
			},
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}

		}
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

		}
	}

	/* #endif */
	.carousel {
		width: 100%;
		height: 500rpx;

		.carousel-item {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.tag {
		display: flex;
		justify-content: space-between;
		height: 60rpx;

	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			// border-radius: 50%;
			// opacity: .7;
			// box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.item {
		height: 88rpx;

		image {
			width: 88upx;
			height: 88upx;
		}
	}

	.limitStr {
		height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.section-header {
		height: 60rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.scoll-wrapper {
		display: flex;
		align-items: flex-start;
	}

	.floor-item {
		width: 250upx;
		margin-right: 20upx;
		font-size: $font-sm+2upx;
		color: $font-color-dark;
		line-height: 1.8;

		image {
			width: 250upx;
			height: 250upx;
			border-radius: 6upx;
		}

		.price {
			color: grey;
			text-decoration: line-through;
			display: block;
			overflow: hidden;
			line-height: 1.0;
		}

		.clamp {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: block;
		}

		// .floor-list{
		// 	white-space: nowrap;
		// }

	}

	.ad-banner-img {
		width: 100%;
		height: 320rpx;
	}

	.banner-item {
		width: 200rpx;
		margin-right: 20upx;
		// border-radius: 12upx;
		// align-items: center;
		text-align: center;

		image {
			width: 200rpx;
			height: 200rpx;
		}

	}

	.banner-item2 {
		// width: 220rpx;
		padding-left: 15rpx;
		padding-right: 15rpx;
		margin-right: 20upx;
		border-radius: 12upx;
		// align-items: center;
		text-align: center;

		image {
			width: 190rpx;
			height: 190rpx;
			border-radius: 12upx;
		}

	}

	.deserve-left {
		margin-left: 12px;
		width: 33%;
		height: 520upx;

		// display: -webkit-flex;
		// display: flex;
		// -webkit-justify-content: center;
		// justify-content: center;
		// -webkit-align-items: center;
		// align-items: center;
		image {
			width: 100%;
			height: 520rpx;
		}
	}

	.deserve-right {
		width: 67%;
		height: 520upx;
		-webkit-flex: 1;
		flex: 1;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		overflow: hidden;

		.clamp {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: block;
		}

		image {
			width: 150rpx;
			height: 150rpx;
		}

	}

	.swiper-item image,
	.swiper-item video {
		width: 200rpx;
		display: block;
		height: 200rpx;
		margin: 0;
		pointer-events: none;
	}

	// 好物橱窗
	.goods-card-swiper {
		height: 600upx !important;
	}

	.goods-card-swiper swiper-item {
		width: 350upx !important;
		left: 200upx;
		box-sizing: border-box;
		// padding: 0upx 0upx 200upx;
		overflow: initial;
	}

	.goods-card-swiper swiper-item .swiper-item {
		width: 100%;
		display: flex;
		height: 100%;
		line-height: 1.3;
		border-radius: 10upx;
		transform: scale(0.9);
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
		align-items: center;
		justify-content: space-between;
		padding: 5px;

		.msg {
			height: 130rpx;
			overflow: hidden;
		}

	}

	.goods-card-swiper swiper-item.cur .swiper-item {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.auth {
		align-self: flex-start;
		align-items: center;
		justify-content: flex-start;

		image {
			width: 50rpx;
			height: 50rpx;
			border-radius: 25rpx;
			margin-top: 5rpx;
			margin-bottom: 5rpx;

		}
	}

	.goods-info {
		height: 400rpx;
		overflow: hidden;
	}

	.active {
		image {
			width: 100%;
			height: 100%;

		}
	}

	.skuName {
		line-height: 1.2;
		height: 33px;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 12px;
	}

	.skuInfo {
		padding: 5px;

		image {
			width: 100%;
			height: 50%;

		}
	}

	.tabInfo {

		// padding: 12px;
		image {
			width: 100%;
			height: 50%;
		}

		.title {
			position: absolute;
			z-index: 2;
		}
	}
	.right {
		width: 20px;
		line-height: 1.1;
	}
</style>
