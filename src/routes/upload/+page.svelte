<script lang="ts">
	let imageFile: HTMLInputElement;
	let previewSrc: string | null = null;

	// ファイルが選択されたときにプレビュー画像を表示
	function handleFileChange() {
		if (imageFile.files?.[0]) {
			const file = imageFile.files[0];
			previewSrc = URL.createObjectURL(file); // 選択されたファイルをプレビュー表示
		} else {
			previewSrc = null; // ファイルが選択されていない場合はプレビューをリセット
		}
	}

	async function handleUpload() {
		if (!imageFile.files?.[0]) {
			alert('画像を選択してください！');
			return;
		}

		const formData = new FormData();
		formData.append('image', imageFile.files[0]);

		const response = await fetch('/api', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			if (data.success) {
				window.location.href = response.headers.get('Location') || '/';
			}
		} else {
			alert('画像処理に失敗しました。');
		}
	}
</script>

<div class="container">
	<h1 class="title">画像アップロード</h1>
	<form on:submit|preventDefault={handleUpload} class="upload-form">
		<label for="image-upload" class="file-label">画像を選択してください</label>
		<input
			type="file"
			id="image-upload"
			accept="image/*"
			bind:this={imageFile}
			class="file-input"
			on:change={handleFileChange}
		/>

		<!-- プレビュー画像 -->
		{#if previewSrc}
			<img src={previewSrc} alt="プレビュー画像" class="image-preview" />
		{/if}

		<button type="submit" class="submit-button">アップロードして処理</button>
	</form>
</div>

<style>
	.container {
		max-width: 390px;
		margin: 0 auto;
		padding: 16px;
		box-sizing: border-box;
		text-align: center;
	}

	.title {
		font-family: Inter, sans-serif;
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 24px;
	}

	.upload-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.file-label {
		font-family: Inter, sans-serif;
		font-size: 16px;
		color: #333;
	}

	.file-input {
		width: 100%;
		padding: 12px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 14px;
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
</style>
