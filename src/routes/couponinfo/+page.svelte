<script lang="ts">
    // クーポンの情報（本来はAPIから取得など）
    let coupon = {
      title: 'あああああああああああ',
      expiry: '2024/12/27'
    };
  
    // 「登録」ボタンクリック時の処理
    function onRegister() {
      // ここでAPIコールや処理
      alert('クーポンを登録しました！');
    }
  </script>
  
  <style>
    .container {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 1rem;
      text-align: center;
    }
    .coupon-icon {
      width: 150px;
      margin: 0 auto 2rem;
    }
    .title {
      margin-top: 1rem;
      font-weight: bold;
      font-size: 1.2rem;
      text-align: left;
    }
    .content {
      margin: 0.5rem 0 2rem 0;
      text-align: left;
    }
    .register-button {
      background: #8b5cf6; /* 例: 紫色 */
      color: #fff;
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .register-button:hover {
      opacity: 0.9;
    }
  </style>
  
  <div class="container">
    <!-- クーポンアイコン -->
    <img 
      class="coupon-icon"
      src="/images/coupon-icon.svg" 
      alt="クーポンアイコン"
    />
  
    <div class="title">タイトル</div>
    <div class="content">{coupon.title}</div>
  
    <div class="title">期限</div>
    <div class="content">{coupon.expiry}</div>
  
    <button class="register-button" on:click={onRegister}>
      登録
    </button>
  </div>
  