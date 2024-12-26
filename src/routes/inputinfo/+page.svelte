<script>
	// 必要に応じてページでデータを取得
</script>

<h1>画像のアップロードが完了しました！</h1>
<p>必要な情報を入力してください。</p>

<!-- 必要な入力フォームをここに配置 -->
<form>
	<label for="name">名前:</label>
	<input type="text" id="name" name="name" required />

	<label for="coupon">クーポン内容:</label>
	<input type="text" id="coupon" name="coupon" required />

	<label for="expiration">クーポン期限:</label>
	<input type="date" id="expiration" name="expiration" required />

	<button type="submit">送信</button>
</form>
