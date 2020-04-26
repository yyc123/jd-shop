<template>
	<view class="app">
		<view class="price-box">
			<text class="price">{{payMoney}}</text>
			<view class="flex align-center">
				<text>支付剩余时间</text>
				<uni-countdown color="black" background-color="#d7d7d7" border-color="#00B26A" :show-day="false" :hour="6" :minute="0"
				 :second="0"></uni-countdown>
			</view>

		</view>

		<view class="pay-type-list">
			<view class="cu-bar list-title">
				<image src="../../static/pay/jdpay.png" mode=""></image>
			</view>
			<view class="type-item b-b" @click="changePayType(1)">
				<image class="icon" src="../../static/pay/btpay.png" mode=""></image>
				<view class="con">
					<text class="tit">打白条</text>
					<text>一键激活并支付,可享立减优惠</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(2)">
				<image class="icon" src="../../static/pay/bankpay.png" mode=""></image>
				<view class="con">
					<text class="tit">使用新卡支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(3)">
				<image class="icon" src="../../static/pay/zzbankpay.png" mode=""></image>
				<view class="con">
					<text class="tit">首次添加中国银行信用卡</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 3' />
					</radio>
				</label>
			</view>

			<view class="margin-top-sm type-item b-b" @click="changePayType(4)">
				<image class="icon" src="../../static/pay/wx.png" mode=""></image>
				<view class="con">
					<text class="tit">微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 4' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(5)">
				<image class="icon" src="../../static/pay/qqpay.png" mode=""></image>
				<view class="con">
					<text class="tit">QQ钱包支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 5' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(6)">
				<image class="icon" src="../../static/pay/yunpay.png" mode=""></image>
				<view class="con">
					<text class="tit">云闪付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 6' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(7)">
				<image class="icon" src="../../static/pay/wxpay.png" mode=""></image>
				<view class="con">
					<text class="tit">微信好友代付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ff0000" :checked='payType == 7' />
					</radio>
				</label>
			</view>
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'

	export default {
		components: {
			uniCountdown
		},

		data() {
			return {
				payMoney: '0.00',
				payType: 1,
				orderInfo: {}
			};
		},
		computed: {

		},
		onLoad(options) {
			 this.payMoney = options.money.toString();
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				// uni.redirectTo({
				// 	url: '/pages/money/paySuccess'
				// })
				uni.showModal({
					title: '支付结果',
					showCancel: false,
					content:'成功',
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack({
								delta: 2
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 24upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #ff0000;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.list-title {
		height: 80rpx;
		background-color: #fff0f0;

		image {
			width: 200rpx;
			height: 80rpx;
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		/* background-color: #fff; */
		/* padding-left: 60upx; */

		.type-item {
			background-color: #fff;
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;

			image {
				width: 90rpx;
				height: 90rpx;
			}
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {

		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #ff0000;
		border-radius: 40upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
