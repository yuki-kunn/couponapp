<script lang="ts">
	import { onMount } from 'svelte';

	let latestCoupon: {
		id: string;
		imagePath: string;
		jsonData: {
			名前: string;
			クーポン内容: string;
			クーポン期限: string;
		};
	} | null = null;

	let editedData = {
		名前: '',
		クーポン内容: '',
		クーポン期限: ''
	};

	let errorMessage: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/latest-coupon');
			if (!response.ok) {
				throw new Error(`HTTPエラー: ${response.status}`);
			}

			const data = await response.json();

			if (data && data.coupons && data.coupons.length > 0) {
				latestCoupon = data.coupons[0];
				editedData = { ...latestCoupon.jsonData }; // 初期データをセット
			} else {
				errorMessage = 'クーポン情報が見つかりませんでした。';
			}
		} catch (error) {
			errorMessage = 'クーポン情報の取得に失敗しました。';
			console.error('エラー:', error);
		}
	});

	async function saveEditedData() {
		errorMessage = null;

		try {
			const response = await fetch('/api/save-edited-coupon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					jsonData: editedData,
					imagePath: latestCoupon?.imagePath
				})
			});

			if (!response.ok) {
				throw new Error(`HTTPエラー: ${response.status}`);
			}

			window.location.href = '/success';
		} catch (error) {
			errorMessage = '保存に失敗しました。';
			console.error('エラー:', error);
		}
	}
</script>

<div class="container">
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if latestCoupon}
		<h2>クーポン詳細</h2>

		<p class="topic">名前</p>
		<input
			type="text"
			class="title"
			bind:value={editedData.名前}
			placeholder="名前を入力してください"
		/>

		<p class="topic">クーポン内容</p>
		<input
			type="text"
			class="title"
			bind:value={editedData.クーポン内容}
			placeholder="クーポン内容を入力してください"
		/>

		<p class="topic">期限</p>
		<input
			type="text"
			class="title"
			bind:value={editedData.クーポン期限}
			placeholder="有効期限を入力してください"
		/>

		<p class="topic">画像</p>
		{#if latestCoupon.imagePath}
			<div class="image-container">
				<img src={latestCoupon.imagePath} alt="coupon" />
			</div>
		{/if}

		<button class="save-button" on:click={saveEditedData}>保存</button>
	{:else}
		<p>クーポン情報を読み込み中...</p>
	{/if}
</div>

<style>
	.container {
		max-width: 390px;
		margin: 0 auto;
		padding: 16px;
		box-sizing: border-box;
	}

	.title {
		display: block;
		width: 100%;
		font-family: Inter, sans-serif;
		font-size: 16px;
		padding: 12px;
		margin-bottom: 16px;
		border: 1px solid #ccc;
		border-radius: 6px;
		box-sizing: border-box;
	}

	.save-button {
		display: block;
		width: 100%;
		padding: 12px;
		background-color: #5227cc;
		color: white;
		font-size: 18px;
		font-weight: bold;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.error {
		color: red;
		text-align: center;
		margin-top: 16px;
	}

	.image-container {
		text-align: center;
		margin-bottom: 16px;
	}

	.image-container img {
		max-width: 100%; /* コンテナの幅に収まる */
		height: auto; /* アスペクト比を維持 */
		border-radius: 8px; /* 角を丸くする */
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 視覚的に分離 */
	}
</style>
