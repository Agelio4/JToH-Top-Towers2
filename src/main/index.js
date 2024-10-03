let data;
let towers = [];
let legacy = [];
let unverified = [];
let inview = 0;

// utils
const getTowerByName = (name) => {
    for (let i = 0; i < towers.length; i++) {
        if (towers[i].name == name) {
            return towers[i]
        }
    }
}

const getLegacyTowerByName = (name) => {
    for (let i = 0; i < legacy.length; i++) {
        if (legacy[i].name == name) {
            return legacy[i]
        }
    }
}

const getTowerByAcronym = (acr) => {
    for (let i = 0; i < towers.length; i++) {
        if (getAcronym(towers[i].name) == acr) {
            return towers[i]
        }
    }
}

const getAcronym = (tower) => {
    let t = tower.split(" ");
    let r = "";

    for (let i = 0; i < t.length; i++) {
        r += t[i].charAt(0);
    }

    return r;
}

class Enums {
    static Terrifying = 10;
    static Catastrophic = 11;
    static Horrific = 12;
    static Unreal = 13;
}

class Templates {
    static ListTower(rank, tower, mode) {
        return `
        <div onclick="viewTower(&quot;${tower.name}&quot;, '${mode}')" class="listTower ${rank == 1 ? 'gold' : ''} ${rank == 2 ? 'silver' : ''} ${rank == 3 ? 'bronze' : ''}">
            <h2 class="listTower-rank">#${rank}</h2>
            <h2 class="listTower-tower">${tower.name}</h2>
        </div>
        `
    }
}

class Tower {
    constructor(name, difficulty, verifier, creators, location, gpStyle, difficultySource, Length, verifDate, videoLink, rank) {
        this.name = name;
        this.difficulty = difficulty;
        this.verifier = verifier;
        this.creators = creators;
        this.location = location;
        this.gpStyle = gpStyle;
        this.difficultySource = difficultySource;
        this.Length = Length;
        this.verifDate = verifDate;
        this.videoLink = videoLink;
        this.rank = rank;
    }

    difficultyRange() {
        
    }
}

$('#file-loader').load("src/data/list.csv", () => {
    data = Papa.parse($('#file-loader')[0].innerHTML);

    for (let i = 1; i < data.data.length; i++) {
        towers.push(new Tower(
            data.data[i][0],
            data.data[i][1],
            data.data[i][2],
            data.data[i][3],
            data.data[i][4],
            data.data[i][5],
            data.data[i][6],
            data.data[i][7],
            data.data[i][8],
            data.data[i][9],
            i
        ));
    }

    for (let i = 0; i < towers.length; i++) {
        $("#list")[0].innerHTML += Templates.ListTower(i + 1, towers[i], "main");
    }

    viewTower(towers[0].name, "main"); // default view to top 1
    console.log(data);
});

$('#file-loader').load("src/data/legacy.csv", () => {
    data = Papa.parse($('#file-loader')[0].innerHTML);
    console.log(data);

    for (let i = 1; i < data.data.length; i++) {
        legacy.push(new Tower(
            data.data[i][0],
            data.data[i][1],
            data.data[i][2],
            data.data[i][3],
            data.data[i][4],
            data.data[i][5],
            data.data[i][6],
            data.data[i][7],
            data.data[i][8],
            data.data[i][9],
            i+100
        ));
    }

    for (let i = 0; i < legacy.length; i++) {
        $("#list-legacy")[0].innerHTML += Templates.ListTower(legacy[i].rank, legacy[i], "legacy");
    }

    viewTower(legacy[0].name, "legacy"); // default view to top 1
});

$('#file-loader').load("src/data/unverified.csv", () => {
    data = Papa.parse($('#file-loader')[0].innerHTML);
    console.log(data);

    for (let i = 1; i < data.data.length; i++) {
        unverified.push(new Tower(
            data.data[i][0],
            data.data[i][1],
            "Unverified",
            data.data[i][2],
            "No location",
            data.data[i][4],
            data.data[i][5],
            data.data[i][6],
            "Unverified",
            "Unverified",
            "Unverified",
            "Unverified"
        ));
    }
});

const viewTower = (tower, mode) => {
    console.log(tower);
    let inview = 0;
    if (mode == "main") { inview = getTowerByName(tower) }
    else if (mode == "legacy") { inview = getLegacyTowerByName(tower) }

    $(`#viewer-${mode == "main" ? "" : "legacy-"}towerName`)[0].innerHTML = inview.name;
    $(`#viewer-${mode == "main" ? "" : "legacy-"}creators`)[0].innerHTML = inview.creators;
    $(`#viewer-${mode == "main" ? "" : "legacy-"}verifier`)[0].innerHTML = inview.verifier;
    $(`#viewer-${mode == "main" ? "" : "legacy-"}location`)[0].innerHTML = inview.location;


        $("#viewer-records-table")[0].innerHTML = `
        <tr>
            <th id="theader-user">Username</th>
            <th id="theader-fps">FPS</th>
            <th id="theader-video">Video</th>
        </tr>
        `
    

    let r = [];
    for (let i = 0; i < records.length; i++) {
        if (records[i].tower == getAcronym(inview.name)) {
            r.push(records[i]);
        }
    }

    for (let i = 0; i < r.length; i++) {
        console.log(r[i]);
        let userclan = new Clan(
            "",
            "",
            "",
            "white",
            [r[i]["user"]]
        ) // default to nothing if no clan
        for (let j = 0; j < Clans.clans.length; j++) {
            if (Clans.clans[j].hasMember(r[i]["user"])) {
                userclan = Clans.clans[j]
            }
        }

        $("#viewer-records-table")[0].innerHTML += `
        <tr>
            <td><span style="color=${userclan.taghex ?? 'white'}">${userclan.tag ?? ''} </span>${r[i]["user"]}</td>
            <td>${r[i].hz}</td>
            <td class="tr-link"><a href="${r[i].link}">${r[i].link}</a></td>
        </tr>
        `
    }

    $(`#video${mode == "main" ? "" : "-legacy"}`)[0].src = inview.videoLink;
}

const page = (id) => {
    $(".page").toArray().forEach((page) => {
        page.style.display = "none";
    }); // hide all pages

    $("#" + id).css("display", "flex");

    $(".header-link").toArray().forEach((link) => {
        link.classList.remove("active");
    })

    $("#header-" + id)[0].classList.add("active");
    
    window.scrollTo(0, 0);
}

page('main');

const toggleList = () => {
    $("#list")[0].style.width = $("#list")[0].style.width == "0%" ? "100vw" : "0%";
    $("#viewer")[0].style.width= $("#viewer")[0].style.width == "93vw" ? "7vw" : "93vw";
    $("#viewer-main")[0].style.display = $("#viewer-main")[0].style.display == "flex" ? "none" : "flex";
    
    $("#viewer-openlist")[0].innerHTML = $("#viewer-openlist")[0].innerHTML == "⯈" ? "⯇" : "⯈";
}

