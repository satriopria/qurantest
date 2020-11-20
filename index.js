import { putData } from "./data.js";

(async _ => {
  window.onload = _ => {
    /*empty when refreshing*/
    let ids = ["selectFromSurah", "selectFromAyat", "selectToSurah", "selectToAyat", "selectFromJuz", "selectToJuz"];
    for (const key of ids) {
      document.getElementById(key).childNodes[1].selected = "true";
      document.getElementById(key).childNodes[1].disabled = "disabled";
    }
    document.getElementById("questionCount").value = null;
    document.getElementById("answerLength").value = null;
    document.getElementById("questionCount1").value = null;
    document.getElementById("answerLength1").value = null;
  }

  const sumPrint = (dataSum, target) => {
    let el = Array(dataSum.length);
    for (let i = 0; i < dataSum.length; i++) {
      el[i] = (dataSum[i] != null) ? ((i >= dataSum.length - 2) ? document.getElementById(dataSum[i]).value : document.getElementById(dataSum[i]).options[document.getElementById(dataSum[i]).selectedIndex].text) : "...";
    }
    document.getElementById(target).innerHTML = `<b>from</b> ${(target=="sum1")? `juz ${el[0]} <b>to</b> juz ${el[1]}` : `surah ${el[0]} ayat ${el[1]} <b>to</b> surah ${el[2]} ayat ${el[3]}`}, there ${(((target=="sum1")? el[2] : el[4]) > 1) ? "are" : "is"} ${(target=="sum1")? el[2] : el[4]} <b>question${(((target=="sum1")? el[2] : el[4]) > 1) ? "s" : ""}</b> and <b>the answer length</b> is ${(target=="sum1")? el[3] : el[5]} ayat`;
  }

  const adjustAyat = (idSurah, idAyat) => {
    while (document.getElementById(idAyat).childNodes.length > 2) {
      document.getElementById(idAyat).removeChild(document.getElementById(idAyat).lastChild);
    }
    for (let i = 1; i <= sura[document.getElementById(idSurah).value - 1][2]; i++) {
      var el = document.createElement("option");
      el.value = i;
      el.innerHTML = i;
      document.getElementById(idAyat).appendChild(el);
    }
  }

  const sura = await putData("surah", 1, 114);
  for (const i of sura) {
    const el = document.createElement("option");
    el.value = Number(i[0]);
    el.innerHTML = i[1];
    document.getElementById("selectFromSurah").appendChild(el);
    document.getElementById("selectToSurah").appendChild(el.cloneNode(true));
  }

  const juz = await putData("juz", 1, 30);
  for (const i of juz) {
    const el = document.createElement("option");
    el.value = Number(i[0]);
    el.innerHTML = i[0];
    document.getElementById("selectFromJuz").appendChild(el);
    document.getElementById("selectToJuz").appendChild(el.cloneNode(true));
  }

  let totalAyat = 0;

  let sumDataSurah = Array(6);
  document.getElementById("selectFromSurah").onchange = _ => { adjustAyat("selectFromSurah", "selectFromAyat"); sumDataSurah[0] = "selectFromSurah"; sumPrint(sumDataSurah, "sum"); }
  document.getElementById("selectFromAyat").onchange = _ => { sumDataSurah[1] = "selectFromAyat"; sumPrint(sumDataSurah, "sum"); }
  document.getElementById("selectToSurah").onchange = _ => { adjustAyat("selectToSurah", "selectToAyat"); sumDataSurah[2] = "selectToSurah"; sumPrint(sumDataSurah, "sum"); }
  document.getElementById("selectToAyat").onchange = _ => { sumDataSurah[3] = "selectToAyat"; sumPrint(sumDataSurah, "sum"); }
  document.getElementById("questionCount").onchange = _ => { sumDataSurah[4] = "questionCount"; sumPrint(sumDataSurah, "sum"); }
  document.getElementById("answerLength").onchange = _ => { sumDataSurah[5] = "answerLength"; sumPrint(sumDataSurah, "sum"); }

  let sumDataJuz = Array(4);
  document.getElementById("selectFromJuz").onchange = _ => { sumDataJuz[0] = "selectFromJuz"; sumPrint(sumDataJuz, "sum1"); }
  document.getElementById("selectToJuz").onchange = _ => { sumDataJuz[1] = "selectToJuz"; sumPrint(sumDataJuz, "sum1"); }
  document.getElementById("questionCount1").onchange = _ => { sumDataJuz[2] = "questionCount1"; sumPrint(sumDataJuz, "sum1"); }
  document.getElementById("answerLength1").onchange = _ => { sumDataJuz[3] = "answerLength1"; sumPrint(sumDataJuz, "sum1"); }

})();