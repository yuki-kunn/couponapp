<script lang="ts">
	import { onMount } from 'svelte';

	interface Coupon {
		id: string;
		imagePath: string;
		jsonData: {
			名前: string;
			クーポン内容: string;
			クーポン期限: string;
		};
	}

	let coupons: Coupon[] = [];

	// データを取得
	onMount(async () => {
		const response = await fetch('/api/edited-coupons');
		if (response.ok) {
			coupons = await response.json();
		} else {
			console.error('データ取得に失敗しました');
		}
	});
</script>

<!-- クーポンリスト -->
<div>
	{#each coupons as coupon}
		<div class="coupon-item">
			<div class="coupon-icon">
				<img src={coupon.imagePath} alt="Coupon" style="max-width: 100%; max-height: 100%;" />
			</div>

			<div>
				<div class="coupon-name">{coupon.jsonData.名前}</div>
				<div class="coupon-expiry">期限: {coupon.jsonData.クーポン期限}</div>
				<div class="coupon-content">{coupon.jsonData.クーポン内容}</div>
			</div>
		</div>
	{/each}
</div>

<!-- ホームへ戻るボタン -->
<a href="/" class="button-back-home">ホームに戻る</a>

<style>
	.coupon-item {
		display: flex;
		align-items: center;
		margin: 1rem;
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 8px;
	}
	.coupon-icon {
		width: 70px;
		height: 70px;
		border-radius: 16px;
		background: #ccc;
		margin-right: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #aaa;
	}
	.coupon-name {
		font-size: 1.25rem;
		margin-right: auto;
	}
	.coupon-expiry {
		font-size: 1rem;
		color: #666;
	}
	.coupon-content {
		font-size: 1rem;
		color: #333;
	}
	.button-back-home {
		display: block;
		margin: 2rem auto 0;
		background-color: #22c55e;
		color: white;
		border-radius: 8px;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: bold;
		text-align: center;
	}
</style>
