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
        background: #5227CC;
    }
</style>

<div>
    <img src="" alt="クーポン画像" width="100%">
    <hr>
    <form action="" method="post">
        <p class="topic">タイトル</p>
        <input type="text" name="title" class="title" 
            value="" placeholder="タイトルを入力してください">
        <hr>
        <p class="topic">期限</p>
        <input type="text" name="limit" class="title" 
            value="" placeholder="有効期限を入力してください">
        <hr>
        <input class="regist" type="submit" value="登録">
    </form>
</div>
