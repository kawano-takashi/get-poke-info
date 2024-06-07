//---- 機能概要 ----
// pokeapi に api呼び出し を行い，結果を json 形式でまとめて保存する処理です．
// ※javascript を用いて api呼び出し を行うには fetch api を用います．← Promissベースの非同期処理設計がされている．
// ※java で 同様の処理を行うには，$.ajax()メソッドを利用する方法が考えられます．（JQueryの導入必須！）


// 取り込みが終了した際に文言を変化させる要素の取得．
const finish = document.getElementById("finish");
const now = document.getElementById("now");

// pokeapi からのレスポンスを格納するリスト．
let pokejson = [];

// HTMLを読み込んだら動作開始
document.addEventListener('DOMContentLoaded', async () => {
    // 現時点での全国図鑑分の api を呼び出す．
    // pokeapi は全国図鑑以外にリージョンフォルムや別形態の情報があり，
    // それぞれ 10000 以上の番号から受け取れます．
    for (let i = 1; i <= 20000; i++) {
        // api通信を行う url
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i;

        try{
            // await は処理が終わるまで待つという機能です．
            // 今回の場合だと fetch(url) の処理が完了してから次の処理に移ります．
            // fetch()とは，引数の url に HTTPリクエスト(api呼び出し) を送る処理となります．
            // res にその結果が Response 型で入ります．
            // ※非同期処理を行わない場合，途中で処理が終了してしまうため Promiss 型で帰ってきます．
            const res = await fetch(url);

            // Response 型を json 形式に変換します．
            // json化が完全に終了するまで待つ． ← 文字列データなので完了してから次の処理へ移行する．
            const data = await res.json();
            pokemonSpecies(data);
        } catch (error) {
            //---- 以下，HTTPリクエストが失敗した場合の処理 ----
            // 図鑑番号 10000 以上に存在するリージョンフォルムなどの情報を次のループから受け取る．
            if(i < 10000) i = 9999;
            // これ以上リクエストを行っても情報を受け取れないので，ループ完了まで飛ばす．
            else if(10000 < i) i = 20000;
        } 
    }

    //---- 以下，保存処理なので割愛 ----
    console.log(pokejson);
    localStorage.setItem('json', JSON.stringify(pokejson));
    let pokejson2 = JSON.stringify(pokejson);
    finish.innerHTML = '終了しました。';

    // JSONデータをBlobに変換
    var blob = new Blob([JSON.stringify(pokejson2)], { type: 'application/json' });

    // ファイル保存用の仮の<a>要素を作成し、ダウンロード用リンクとして利用
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'poke-name-data.json';

    // ファイルをダウンロード
    link.click();
});

// 引数の図鑑番号に沿った species api を呼び出す処理です．
const pokemonSpecies = async (data) => {
    const species = data.species['url'];
    const resSpecies = await fetch(species);
    const dataSpecies = await resSpecies.json();
    pokemonName(data, dataSpecies);
}

// 受け取った json 形式の情報から必要な情報を検索し，
// データを pokejson に格納する処理です．
const pokemonName = async (data, dataSpecies) => {
    const id = data.id;
    const pokeEngName = data.species.name;
    const dataLang = dataSpecies.names;
    const pokeJpName = dataLang.find((v) => v.language.name == "ja").name;
    pokejson.push({ id: id, Eng: pokeEngName, Jpn: pokeJpName });
    now.innerHTML = `${data.id}の書き込みが完了しました。`;
}