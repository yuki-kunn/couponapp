<script lang="ts">
    // クーポンのデータ例
    let coupons = [
      { name: 'クーポン1', expiry: '00/00', used: false },
      { name: 'クーポン2', expiry: '00/00', used: false },
      { name: 'クーポン3', expiry: '00/00', used: false },
      { name: 'クーポン4', expiry: '00/00', used: false },
      { name: 'クーポン5', expiry: '00/00', used: false }
    ];
  
    // 「未使用」「使用済み」のタブ切り替え制御用
    let showUsed = false;  
  
    // ホームに戻る処理例 (SvelteKit ネイティブの関数)
    import { goto } from '$app/navigation';
    function backToHome() {
      goto('/'); // ルートパスなど任意のURLへ遷移
    }
  </script>
  
  <style>
    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
      margin-top: 1rem;
    }
    .tab {
      padding: 0.5rem 1rem;
      border-radius: 999px;
      border: 2px solid #8b5cf6; /* 例: 紫色 */
      color: #8b5cf6;
      font-weight: bold;
      cursor: pointer;
    }
    .tab.active {
      background: #8b5cf6;
      color: white;
    }
    .coupon-item {
      display: flex;
      align-items: center;
     margin: 1rem;
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
    .button-red {
      background-color: red;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      margin-left: 1rem;
    }
    .button-back-home {
      display: block;
      margin: 2rem auto 0;
      background-color: #22c55e; /* 例: 緑 */
      color: white;
      border-radius: 8px;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: bold;
      text-align: center;
    }
  </style>
  
  <div class="tabs">
    <div 
      class="tab {showUsed ? '' : 'active'}" 
      on:click={() => (showUsed = false)}
    >
      未使用
    </div>
    <div 
      class="tab {showUsed ? 'active' : ''}" 
      on:click={() => (showUsed = true)}
    >
      使用済み
    </div>
  </div>
  
  <!-- クーポンリスト -->
  {#each coupons as coupon, i}
    {#if showUsed === coupon.used}
      <div class="coupon-item">
        <div class="coupon-icon">70×70</div>
        <div class="coupon-name">{coupon.name}</div>
        <div>使用期限：{coupon.expiry}</div>
        {#if coupon.used}
          <div class="button-red">使用済</div>
        {/if}
      </div>
    {/if}
  {/each}
  
  <!-- ホームへ戻るボタン -->
  <button class="button-back-home" on:click={backToHome}>
    ホームに戻る
  </button>
  