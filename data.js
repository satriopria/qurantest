export const putData = async (type, begin, end) => {
    let arr = [];
    let tmp = []
    const q = await fetch(type+".json");
    const w = await q.json();
    for (let i = 0; i < w.length; i++) {
        tmp.push(type == "juz" ?
            [w[i].index, w[i].start.index, w[i].start.name, w[i].start.verse, w[i].end.index, w[i].end.name, w[i].end.verse] :
            [w[i].index, w[i].title, w[i].count]
        );
    }

    for (let i = begin; i <= end; i++) {
        arr.push(tmp[i-1]);
    }
    return arr;
}