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

			// 保存成功後にリダイレクト
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
			<img src={latestCoupon.imagePath} alt="coupon" />
		{/if}

		<button class="submit-button" on:click={saveEditedData}>保存</button>
	{:else}
		<p>クーポン情報を読み込み中...</p>
	{/if}
</div>

<style>
	div {
		max-width: 390px;
		margin: 0 auto;
		padding: 16px;
		box-sizing: border-box;
	}

	/* テキスト入力と見出し */
	.topic {
		font-family: Inter, sans-serif;
		font-size: 18px;
		font-weight: bold;
		text-align: left;
		margin-bottom: 8px;
		color: #333;
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

	.submit-button {
		display: inline-block;
		padding: 12px 24px;
		background-color: #5227cc;
		color: white;
		font-family: Inter, sans-serif;
		font-size: 16px;
		font-weight: bold;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.submit-button:hover {
		background-color: #3f1ea5;
	}

	/* クーポン画像 */
	img {
		width: 100%;
		max-width: 100%;
		height: auto;
		border: 1px solid #ddd;
		border-radius: 8px;
		margin-top: 12px;
	}

	/* エラーメッセージ */
	p {
		font-family: Inter, sans-serif;
		font-size: 16px;
		color: red;
		text-align: center;
		margin-top: 16px;
	}
</style>
