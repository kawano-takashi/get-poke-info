// HTMLを読み込んだら動作開始
document.addEventListener('DOMContentLoaded', async() => {  
    // 取り込みが終了した際に文言を変化させる要素の取得
    const finish = document.getElementById("finish");
    for(let i = 1; i <= 1020; i++){
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i;
        const res = await fetch(url);
        const data = await res.json();
        pokemonSpecies(data);
    }
});

// 引数の図鑑番号に沿った species api を呼び出す
const pokemonSpecies = async(data) => {
    const species = data.species['url'];
    const resSpecies = await fetch(species);
    const dataSpecies = await resSpecies.json();
    pokemonName(data, dataSpecies);
}

// データを格納する
const pokemonName = async(data, dataSpecies) => {
    const id = data.id;
    const pokeEngName = data.species['name'];
    const dataLang = dataSpecies.names;
    const pokeJpName = dataLang.find((v) => v.language.name == "ja").name;
}