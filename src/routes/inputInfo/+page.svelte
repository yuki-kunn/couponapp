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
=======
<style>
    hr{ 
        height: 5px;
        background-color: black;
    }
    .topic{
        font-family: Inter;
        font-size: 24px;
        font-weight: 600;
        text-align: left;
        padding: 16px 10px 16px 10px;
    }
    .title{
        dispaly:block;
        font-family: Inter;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        padding: 11px 10px 11px 10px;
        width: 100%;
    }
    .regist{
        display: block;
        font-family: Inter;
        font-size: 48px;
        font-weight: 600;
        color: white;
        width: 219px;
        height: 67px;
        margin: 26px auto auto auto;
        gap: 8px;
        border-radius: 6px;
        border-style: none;
        background: #7749F8;
        padding: 0;
    }
</style>


