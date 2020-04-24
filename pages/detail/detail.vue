<template>
	<view>
		<!-- 商品展示 -->
		<view class="goods-show">
			<swiper class="swiper" circular autoplay="true" @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
					<image :src="item.big" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots ">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<view class="promotionInfo">
			<image :src="promotionInfo" mode=""></image>
		</view>
		<!-- 描述 -->
		<view class="price-box">
			<text class="price">{{productInfo.priceInfo?productInfo.priceInfo.jprice:''}}</text>

			<view class="flex margin-right-sm">
				<view class="flex-direction text-center ">
					<text class="cuIcon-recharge block " style="margin-bottom: -5px;"></text>
					<text class="text-xs">降价通知</text>
				</view>
				<view class="flex-direction margin-lr text-center">
					<text class="cuIcon-like block" style="margin-bottom: -5px;"></text>
					<text class="text-xs">收藏</text>
				</view>
			</view>
		</view>
		<view class="iconImg padding-lr bg-white align-center  flex">
			<image :src="iconImg.iconImg" mode=""></image>
			<text class="text-sm margin-left">{{iconImg.iconDesc}}</text>
		</view>
		<view class="bg-white padding product-title">
			<text class="text-bold text-xl">{{productName}}</text>
			<view class="margin-tb-sm">
				<text>{{brightPoints}}</text>
			</view>
			<view class="text-sm" @click="goweb(adText.adLink)">
				<text>{{adText.adword}}</text>
				<text class="text-red margin-left">{{adText.adLinkContent}} </text>

			</view>
		</view>
		<!-- 优惠信息 -->
		<view class="margin-top-sm  bg-white padding">
			<view class="discounts flex">
				<view class="discounts-left text-bold ">
					<text>优惠</text>
				</view>
				<view class="discounts-right">

					<view class="flex" style="height: 60rpx;" v-for="(item,index) in couponInfo" :key='index'>
						<view class=' cu-tag bg-gradual-orange   text-xs margin-right-sm'>{{item.text}}</view>
						<view class="margin-right-sm singleLine">
							<text class=" ">{{item.value}}</text>

						</view>
					</view>

				</view>
			</view>

			<view class="discounts flex solid-top align-center">
				<view class="discounts-left text-bold ">
					<text>活动</text>
				</view>
				<view class="discounts-right active-content">
					<view class="flex align-center" style="height: 60rpx;" v-for="(item,index) in activeInfo" :key='index'>
						<image :src="item.icon" mode=""></image>
						<view class="margin-left-sm singleLine">
							<text class="text-sm">{{item.desc}}</text>
						</view>
						<text class="cuIcon-more right-more"></text>

					</view>
				</view>
			</view>
		</view>

		<view class="margin-top-sm  bg-white padding solid-bottom">
			<view class="discounts flex cu-bar">
				<view class="discounts-left text-bold ">
					<text>已选</text>
				</view>
				<view class="discounts-right ">
					<text>{{currentSelectedText}}</text>
					<text class="cuIcon-more right-more"></text>

				</view>
			</view>
			<view class="discounts flex ">
				<view class="discounts-left text-bold ">
					<text>送至</text>
				</view>
				<view class="discounts-right">
					<view class="flex">
						<text class="cuIcon-location text-red margin-right-sm"></text>
						<text class="singleLine">河南省郑州市高新技术开发区翠竹街1号总部企业基地56号楼</text>

					</view>
					<text class="text-red text-bold">现货</text>
					<text class="text-sm">,23:00前下单,预计明天送达</text>

				</view>
			</view>
		</view>
		<!-- 服务标签 -->
		<view class="  serve-tag bg-white padding-lr">
			<view v-for="(item,index) in serveTags" :key="index" class="serve-tag-item">
				<text class="cuIcon-roundcheck text-red margin-lr-xs"></text>
				<text class="text-xs">{{item.text}}</text>
			</view>
		</view>
		<view class="margin-top cu-bar padding-lr bg-white">
			<view class="">
				<text class="cuIcon-upstage text-orange"></text>
				<text>{{ListHeader.desc}}</text>
			</view>
			<text class="cuIcon-right"></text>
		</view>

		<!-- 评价 -->
		<view class="margin-top cu-bar padding-lr bg-white">
			<view class="">
				<text>评价({{123}})</text>
			</view>
			<view class="">
				<text>好评度{{99}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="bg-white">
			<view v-for="(item,index) in commentTags" :key="index" class="serve-tag-item">
				<text class=" bg-gradual-orange text-black round cu-tag text-xs margin-lr-xs margin-bottom-sm">{{item.name}}</text>
			</view>
		</view>
		<view class="bg-white padding-bottom-xs">
			<view v-for="(item,index) in productCommentData.commentInfoList" :key="index" class=" margin-bottom padding">
				<view class="text-xs">
					<view class="user-comment">
						<view class="cu-avatar round margin-right-sm" :style="'background-image:url('+item.userImgURL+');'">
							<!-- <image :src="i" mode=""></image> -->
						</view>


						<text>{{item.userNickName}}</text>
					</view>
					<text>{{item.commentData}}</text>
				</view>
			</view>
			<view class="flex justify-center bg-white ">
				<button style="cu-btn round " size="mini">{{productCommentData.commentButtonText}}</button>
			</view>
		</view>

		<!-- 问答 -->
		<view class="solid-top cu-bar padding-lr bg-white ">
			<view class="">
				<text>问答</text>
			</view>
			<view class="">
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view v-for="(item,index) in productCommentData.questionList" :key="index">
			<view class=" cu-bar padding-lr bg-white">
				<view class="text-xs">
					<text>{{item.content}}</text>
				</view>
				<view class="text-xs">
					<text>{{item.answerCountText}}</text>

				</view>
			</view>
		</view>
		<view class="flex justify-center bg-white margin-bottom padding-bottom-xs">
			<button style="cu-btn round " size="mini">{{productCommentData.newStyleText}}</button>
		</view>


		<!-- 防止遮挡 -->
		<view style="height: 100rpx;">

		</view>
		<!-- 底部栏 -->
		<view class="bottom-bar">
			<view class="cu-bar bg-white tabbar border shop ">
				<button class="action">
					<view class="cuIcon-shop" style="margin-bottom: -5px;">
					</view>
					<text>店铺</text>
				</button>
				<button class="action">
					<view class="cuIcon-service" style="margin-bottom: -5px;">
					</view> 客服
				</button>
				<button class="action">
					<view class="cuIcon-cart" style="margin-bottom: -5px;">
					</view> 购物车
				</button>

				<view class="btn-group">
					<button class="cu-btn bg-red round shadow-blur margin-lr-xs" @click="addCar">加入购物车</button>
					<button class="cu-btn bg-orange round shadow-blur " @click="order">立即订购</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productDetailData: {},
				productCommentData: {},
				//轮播图
				carouselList: [],
				swiperCurrent: 0,
				swiperLength: 0,
				//商品信息
				productInfo: {},
				//当前选择的商品属性
				selectedSKU: 0,

			}
		},
		onLoad() {
			this.loadDetailData();
			this.loadCommentData();
		},
		computed: {
			promotionInfo() {
				if (!this.productDetailData.floors) {
					return '';
				}
				let data = this.productDetailData.floors[30].data.promotionInfo;
				return data.benefitBeltInfo.url;
			},
			iconImg() {
				if (!this.productDetailData.floors) {
					return '';
				}

				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_511") {
						let item = this.productDetailData.floors[i];
						console.log(item.data.icodeImgAndTextList[0]);
						return item.data.icodeImgAndTextList[0];
					}
				}
			},
			productName() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_201") {
						let item = this.productDetailData.floors[i];
						return item.data.wareInfo.name;
					}
				}
			},
			brightPoints() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_452") {
						let item = this.productDetailData.floors[i];
						return item.data.brightPoints;
					}
				}
			},
			adText() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_199") {
						let item = this.productDetailData.floors[i];
						return item.data.ad;
					}
				}
			},
			///优惠券信息
			couponInfo() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_462") {
						let item = this.productDetailData.floors[i];
						return item.data.preferentialGuide.promotion.activity;
					}
				}
			},
			//活动
			activeInfo() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_442") {
						let item = this.productDetailData.floors[i];
						return item.data.actions.bizActs;
					}
				}
			},
			currentSelectedText() {
				if (!this.productInfo.colorSizeInfo) {
					return '';
				}
				return this.productInfo.colorSizeInfo.colorSize[0].buttons[this.selectedSKU].text + '    ' + this.productInfo.weightInfo
					.content;
			},
			//服务标签
			serveTags() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_231") {
						let item = this.productDetailData.floors[i];
						return item.data.serviceInfo.basic.iconList;
					}
				}
			},
			//榜单
			ListHeader() {
				if (!this.productDetailData.floors) {
					return '';
				}
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_496") {
						let item = this.productDetailData.floors[i];
						return item.data.unitedRank;
					}
				}

			},
			//评论标签list
			commentTags() {
				if (!this.productCommentData.tagStatisticsinfoList) {
					return [];
				}
				return this.productCommentData.tagStatisticsinfoList;
			}
		},
		methods: {
			async loadDetailData() {
				let data = await this.$api.json('wareBusiness');
				this.productDetailData = data;
				this.carouselList = data.floors[30].data.wareImage;
				console.log(this.carouselList);
				this.swiperLength = this.carouselList.length;
				for (let i in this.productDetailData.floors) {
					if (this.productDetailData.floors[i].bId === "eCustom_flo_201") {
						let item = this.productDetailData.floors[i];
						this.productInfo = item.data;
					}
				}

			},
			async loadCommentData() {
				let data = await this.$api.json('wareDetailComment');
				this.productCommentData = data;

			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//进入订单
			order() {
				uni.navigateTo({
					url: '../order/order'
				})
			},
			//加入购物车
			addCar() {
				this.$api.msg('加入购物车成功')
			},
			//跳转京东
			goweb(url) {
				uni.navigateTo({
					url: '../web-view/web-view?url=' + url
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-show {
		width: 100%;
		height: 375*2rpx;
		position: relative;

	}

	.swiper {
		padding: 0;
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			height: 100%;
		}

	}


	.swiper-dots {
		display: flex;
		position: absolute;
		right: 10upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-size: 100% 100%;
		background-color: gray;


		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.promotionInfo {
		width: 100%;
		height: 100rpx;

		image {
			width: 100%;
			height: 100%;
		}

	}

	.price-box {
		background-color: #fff;
		height: 100upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 24upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #ff0000;
			margin-top: 12upx;
			margin-left: 12rpx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.bottom-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
	}

	.iconImg {
		height: 80rpx;
		width: 100%;

		image {
			height: 30rpx;
			width: 90rpx;
		}
	}

	.product-title {
		line-height: 1.2;
	}

	// 优惠活动
	.discounts {
		width: 100%;

		.discounts-left {
			width: 20%;
		}

		.discounts-right {
			width: 80%;

			.singleLine {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

			}
		}
	}

	.active-content {

		image {
			width: 90rpx;
			height: 30rpx;
		}
	}

	.right-more {
		position: absolute;
		right: 0;
		top: 30;
		// z-index: 100;
		// width: 50rpx;
	}

	.serve-tag {}

	.serve-tag-item {
		display: inline-block;
	}
</style>
