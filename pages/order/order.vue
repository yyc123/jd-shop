<template>
	<view>
		<!-- 地址 -->
		<navigator url="./address/address" class="address-section">
			<view class="order-content">
				<view class="cen">
					<view class="">
						<view class='round cu-tag bg-blue padding-lr margin-right-sm text-sm'>{{addressData.tag}}</view>
						<text class="text-sm">{{addressData.area}}</text>
					</view>
					<text class="address text-bold">{{addressData.address}} </text>
					<view class="top">
						<text class="text-sm">{{addressData.name}}</text>
						<text class="text-sm">{{addressData.mobile}}</text>
					</view>
				</view>
				<text class="lg text-gray cuIcon-right icon-you"></text>
			</view>
			<image class="a-bg" src="../../static/line.png" mode=""></image>
		</navigator>

		<view class="cu-bar bg-white margin-top-sm" @click="showModal" data-target="payway">
			<view class="action">
				<text class=""></text> 支付方式
			</view>
			<view class="action">
				<text class=""></text> {{radio=="radio0"?"在线支付":"货到付款"}}
				<text class="margin-left-sm cuIcon-more"></text>
			</view>
		</view>

		<view class="cu-modal" :class="modalName=='payway'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in payway" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub"> {{item}}</view>
								<radio class="round" :class="radio=='radio' + index?'checked':''" :checked="radio=='radio' + index?true:false"
								 :value="'radio' + index"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="cu-list menu margin-tb-sm">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-shop"></text>
					<text class="">{{productInfo.shopTitle}}</text>
				</view>
			</view>
			<view class="goods-info  padding-sm flex bg-white">
				<view class="cu-avatar  xl   margin-right-sm" :style="'background-image:url('+(productInfo.productInfo.property.chatUrl).split('webp')[0]+');'">
				</view>
				<view class="singleLine">
					<text>{{productInfo.productInfo.wareInfo.name}}</text>
					<view class="text-xs text-gray">
						<text>{{productInfo.selectInfo.SKU.text}}</text>
					</view>
					<view class="flex justify-between">
						<view class="">
							<text class="text-red">￥</text>
							<text class="text-red text-bold">{{productInfo.productInfo.priceInfo?productInfo.productInfo.priceInfo.jprice:""}}</text>

						</view>
						<view class="">
							<uni-number-box :min="1" :max="9" @change='changeNum' :value='productInfo.selectInfo.num'></uni-number-box>
						</view>
					</view>
				</view>

			</view>
			<view class="cu-bar bg-white " @click="showModal" data-target="distributionway">
				<view class="action">
					<text class="">配送</text>
				</view>
				<view class="action">
					<text class="">快递运输</text>
					<text class="margin-left-sm cuIcon-more"></text>
				</view>
			</view>
			<view class="cu-form-group  bg-white">
				<view class="">
					<text class="">留言</text>
				</view>
				<input class="text-sm margin-left" type="text" value="" placeholder="建议留言前先与商家沟通确认" />

			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<radio-group class="block" @change="RadioChange2">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in billInfo" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub"> {{item}}</view>
								<radio class="round" :class="billTitle== item?'checked':''" :checked="billTitle==item?true:false" :value="item"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="cu-bar bg-white margin-top-sm " @click="showModal" data-target="bottomModal">
			<view class="action">
				<text class="">发票</text>
			</view>
			<view class="action">
				<text class="">{{billTitle}}</text>
				<text class="margin-left-sm cuIcon-more"></text>
			</view>
		</view>
		<view class="cu-bar bg-white" @click="action(1)" data-target="payway">
			<view class="action">
				<text class=""></text> 优惠券
			</view>
			<view class="action">
				<text class="">无可用</text>
				<text class="margin-left-sm cuIcon-more"></text>
			</view>
		</view>
		<view class="cu-bar bg-white" @click="action(2)" data-target="payway">
			<view class="action">
				<text class=""></text> 礼品卡
			</view>
			<view class="action">
				<text class="">无可用</text>
				<text class="margin-left-sm cuIcon-more"></text>
			</view>
		</view>

		<view class="cu-bar bg-white margin-top-sm" @click="showModal" data-target="payway">
			<view class="action">
				<text class="">商品金额</text>
			</view>
			<view class="action">
				<text class="">¥{{orderMoney}}</text>
			</view>
		</view>
		<view class="cu-bar bg-white " @click="showModal" data-target="payway">
			<view class="action">
				<text class="">运费</text>
			</view>
			<view class="action">
				<text class="text-red">+ ¥{{freight}}</text>
			</view>
		</view>

		<!-- 防止遮挡 -->
		<view style="height: 100rpx;">

		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="price-tip">￥</text>
				<text class="price">{{totalPrice}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>

	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				addressData: {
					name: "福星",
					address: "翠竹街1号总部企业基地56号楼",
					tag: "家",
					area: "河南省郑州市高新技术开发区",
					mobile: "135****1017"
				},
				productInfo: {
					shopTitle: "京东自营",
					productInfo: {},
					selectInfo: {}
				},
				payway: [
					"在线支付",
					"货到付款"
				],
				billInfo: [
					"不开发票",
					"个人发票",
					"企业发票"
				],
				billTitle: '不开发票',
				modalName: '',
				radio: 'radio0',
				orderMoney: "0.00",
				freight: "0.00",
			}
		},
		onLoad(data) {
			const currentData = JSON.parse(decodeURIComponent(data.dataInfo));
			this.productInfo.productInfo = currentData.productInfo;
			const selectInfo = currentData.selectInfo;
			this.productInfo.selectInfo = selectInfo;
			console.log(currentData);
		},
		computed: {
			// currentBillType() {
			// 	return
			// }
			totalPrice() {
				if(!this.productInfo.productInfo.priceInfo){
					return '';
				}
				let money = this.productInfo.selectInfo.num * this.productInfo.productInfo.priceInfo.jprice;
				return money.toFixed(2);
			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			RadioChange(e) {
				this.radio = e.detail.value
				this.hideModal();
			},
			RadioChange2(e) {
				this.billTitle = e.detail.value
				this.hideModal();
			},
			action(e) {
				if (e === 0) {
					this.$api.msg('')
				} else if (e === 1) {
					this.$api.msg('无可用优惠券')

				} else if (e === 2) {
					this.$api.msg('无可用礼品卡')
				}
			},
			changeNum(e) {
				this.productInfo.selectInfo.num = e;
			},
			//提交订单
			submit() {
				uni.navigateTo({
					url: '../pay/pay?money='+this.totalPrice
				})
			}
		}
	}
</script>

<style lang="scss">
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			padding-left: 12px;
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-dark;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 8upx;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: red;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: red;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: red;
		}

		.submit {
			margin-right: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 80%;
			color: #fff;
			font-size: 32upx;
			background-color: red;
			border-radius: 100rpx;

		}
	}

	.goods-info {
		.cu-avatar {
			width: 30%;
		}

		.singleLine {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

		}
	}
</style>
