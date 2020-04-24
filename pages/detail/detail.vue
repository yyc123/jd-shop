<template>
	<view>
		<view class="bottom-bar">
			<view class="cu-bar bg-white tabbar border shop">
				<button class="action">
					<view class="cuIcon-shop">
					</view> 店铺
				</button>
				<button class="action">
					<view class="cuIcon-service ">
					</view> 客服
				</button>
				<button class="action">
					<view class="cuIcon-cart ">
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

			}
		},
		methods: {
			//进入订单
			order() {
				uni.navigateTo({
					url: '../order/order'
				})
			},
			//加入购物车
			addCar() {
				this.$api.msg('加入购物车成功')
			}
		}
	}
</script>

<style>
	.bottom-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
	}
</style>
