<script lang="ts">
	let imageFile: HTMLInputElement;

	async function handleUpload() {
		if (!imageFile.files?.[0]) {
			alert('画像を選択してください！');
			return;
		}

		const formData = new FormData();
		formData.append('image', imageFile.files[0]);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			alert(`認識されたテキスト: ${data.text}`);
		} else {
			alert('画像処理に失敗しました。');
		}
	}
</script>

<form on:submit|preventDefault={handleUpload}>
	<input type="file" accept="image/*" bind:this={imageFile} />
	<button type="submit">アップロードして処理</button>
</form>
