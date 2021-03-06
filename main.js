import { putData } from "./data.js";

const loadData = async path => {
  const a = await fetch(path);
  return (await a.text()).replace('\n', "");
}

const getSura = async anchor => {
  if (anchor[0] > anchor[2] || ((anchor[0] == anchor[2] && anchor[1] > anchor[3]))) {
    return (await getSura([anchor[0], anchor[1], 114, 6, anchor[4], anchor[5]])).concat(await getSura([1, 1, anchor[2], anchor[3], anchor[4], anchor[5]]));
  } else {
    const sura = await putData("surah", 1, 114);
    let selection = [];
    if (anchor[2] == anchor[0] && anchor[1] <= anchor[3]) {
      for (let i = anchor[1]; i <= anchor[3]; i++) selection.push('quran-text/surah/' + anchor[0] + '/' + i + '.txt');
    } else {
      for (let i = anchor[0]; i <= anchor[2]; i++) {
        // console.log(anchor[3])
        if (i == anchor[0]) {
          console.log("a"+sura[i][2])
          for (let j = anchor[1]; j <= sura[i-1][2]; j++) {
            selection.push('quran-text/surah/' + i + '/' + j + '.txt');
            console.log(j)
          }
        } else if (i == anchor[2]) {
          console.log("b")
          for (let j = 1; j <= anchor[3]; j++) {
            selection.push('quran-text/surah/' + i + '/' + j + '.txt');
            console.log(j)
          }
        } else {
          console.log("c")
          for (let j = 1; j <= sura[i-1][2]; j++) selection.push('quran-text/surah/' + i + '/' + j + '.txt');
        }
      }
    }
    // console.log(selection);
    return selection;
  }
}

const getJuz = async anchor => {
  if (anchor[0] > anchor[1]) {
    return (await getJuz([anchor[0], 30, anchor[2], anchor[3]])).concat(await getJuz([1, anchor[1], anchor[2], anchor[3]]));
  } else {
    const juz = await putData("juz", 1, 30);
    let selection = [];
    for (let i = anchor[0]-1; i < anchor[1]; i++) {
      let param = [Number(juz[i][1]), Number(juz[i][3]), Number(juz[i][4]), Number(juz[i][6]), anchor[2], anchor[3]];
      selection.push(await getSura(param));
    }
    return [].concat.apply([], selection);
  }
}

// var e = decodeURIComponent(atob(window.location.search.substring(1)))
//   console.log(e);

(async _ => {

  const paramList = ["fromSurah", "fromAyat", "toSurah", "toAyat", "fromJuz", "toJuz", "q", "a"];
  var queryString = decodeURIComponent(atob(window.location.search.substring(1)));
  var queries = queryString.split("&");
  let dataThrow = [];
  for (var i = 0; i < queries.length; i++) {
    let tmp = queries[i].split("=");
    for (const j of paramList) {
      if (tmp[0] == j) {
        dataThrow.push(Number(tmp[1]));
      }
    }
  }

  // console.log(dataThrow);

  let dataRange = 0;
  if (dataThrow.length > 4) {
    dataRange = await getSura(dataThrow);
  } else {
    dataRange = await getJuz(dataThrow);
  }
  console.log(dataRange)
  console.log(dataThrow)

  //interupt when answer >= selection
  if (dataThrow[dataThrow.length - 1] >= dataRange.length) {
    console.log("inininin")
    window.location.href = './index.html?tobig';
  }


  let arr = [];
  let answer = [];
  let isBiggerQuest = false;
  let c = 0, d=0;

  //randomIt - entering question and answer to array
  if (dataThrow[dataThrow.length - 2] >= dataRange.length) {
    isBiggerQuest = true;
  }

  while (arr.length < dataThrow[dataThrow.length - 2]  && c<1000) {
    let idx = Math.floor(Math.random() * dataRange.length);
    console.log("idx"+idx)
    let r = dataRange[idx];

    if (arr.indexOf(r) === -1 || isBiggerQuest) {
      let count0 = idx;
      let count1 = 0;
      let ans = []
      while (dataRange[count0++] && count1++<dataThrow[dataThrow.length - 1] && d<1000) {
        // console.log("inilo"+count0)
        dataRange[count0] ? ans.push(dataRange[count0]) : "";
        d++;
      }
      // console.log(ans)
      // answer.push(dataRange.slice(idx + 1, (idx + 1) + dataThrow[dataThrow.length - 1]))
      answer.push(ans);
      arr.push(r);
    }
    c++;
  }
  console.log(arr);

  //displaying the quest (one by one)
  let m = 0;
  const printQuest = async (type = 0) => {
    const el = document.createElement('p');
    document.getElementById("rek").innerHTML = "";
    el.style.textAlign = "right";
    el.innerHTML = await loadData(arr[m += type]);
    document.getElementById("rek").appendChild(el);
    printAnswer(answer, m);
  }

  //displaying the answer, dependent by question
  const printAnswer = async (data, type) => {
    document.getElementById("answer").innerHTML = "";
    for (let i = 0; i < data[type].length; i++) {
      const ans = document.createElement('div');
      ans.style.textAlign = "right";
      ans.style.border = "1px solid black"
      ans.style.fontSize = "25px";
      ans.style.padding = "25px 5px";
      ans.innerHTML = await loadData(data[type][i]);
      document.getElementById("answer").appendChild(ans);
    }
  }

  //init quest
  printQuest();
  document.getElementById("prev").disabled = true;
  document.getElementById("next").disabled = dataThrow[dataThrow.length - 2] > 1 ? false : true;

  //next button click event
  document.getElementById("next").onclick = _ => {
    document.getElementById("prev").disabled = false;
    document.getElementById("answer").style.display = "none";
    document.getElementById("cheat").innerHTML = "open the answer";
    if (m != arr.length - 1) {
      printQuest(1);
      if (m == arr.length - 1) {
        document.getElementById("next").disabled = true;
      }
    }
  }

  //previous button click event
  document.getElementById("prev").onclick = _ => {
    document.getElementById("next").disabled = false;
    document.getElementById("answer").style.display = "none";
    document.getElementById("cheat").innerHTML = "open the answer";
    if (m != 0) {
      printQuest(-1);
      if (m == 0) {
        document.getElementById("prev").disabled = true;
      }
    }
  }

  //open the cheat (the answer)
  document.getElementById("cheat").onclick = _ => {
    if (document.getElementById("answer").style.display == "none") {
      document.getElementById("answer").style.display = "block";
      document.getElementById("cheat").innerHTML = "close the answer";
    } else {
      document.getElementById("answer").style.display = "none";
      document.getElementById("cheat").innerHTML = "open the answer";
    }
  }
})()
