const fileName = "pokeNameEngJpn.json";
// 取り込みが終了した際に文言を変化させる要素の取得
const finish = document.getElementById("finish");
const now = document.getElementById("now");
let pokejson = [];
// HTMLを読み込んだら動作開始
document.addEventListener('DOMContentLoaded', async () => {
    // 現時点での全国図鑑分のapiを呼び出す
    for (let i = 1; i <= 1020; i++) {
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i;
        const res = await fetch(url);
        const data = await res.json();
        pokemonSpecies(data);
    }

    localStorage.setItem('json', JSON.stringify(pokejson));
    let pokejson2 = JSON.stringify(pokejson);
    finish.innerHTML = '終了しました。';

    // JSONデータをBlobに変換
    var blob = new Blob([JSON.stringify(pokejson2)], { type: 'text/plan' });

    // ファイル保存用の仮の<a>要素を作成し、ダウンロード用リンクとして利用
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'poke-name-data.json';

    // ファイルをダウンロード
    link.click();
});

// 引数の図鑑番号に沿った species api を呼び出す
const pokemonSpecies = async (data) => {
    const species = data.species['url'];
    const resSpecies = await fetch(species);
    const dataSpecies = await resSpecies.json();
    pokemonName(data, dataSpecies);
}

// データを格納する
const pokemonName = async (data, dataSpecies) => {
    const id = data.id;
    const pokeEngName = data.species['name'];
    const dataLang = dataSpecies.names;
    const pokeJpName = dataLang.find((v) => v.language.name == "ja").name;
    pokejson.push({ id: id, Eng: pokeEngName, Jpn: pokeJpName });
    now.innerHTML = `${data.id}の書き込みが完了しました。`;
}