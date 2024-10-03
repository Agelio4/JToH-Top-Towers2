class Clan {
    constructor(name, icon, tag, taghex, members) {
        this.name = name;
        this.icon = icon;
        this.tag = tag;
        this.taghex = taghex;
        this.members = members;
    }

    hasMember(user) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i] == user) {
                return true
            }
        }
    }
}

class Clans {
    static clans = [
        
    ];

    static getClanIndex(clanName) {
        for(let i = 0; i < this.clans.length; i++) {
            if (this.clans[i].name == clanName) {
                return this.clans.indexOf(this.clans[i]);
            }
        }
    }
}

$('#file-loader').load("src/data/clans.json", () => {
    let clanData = JSON.parse($('#file-loader')[0].innerHTML);
    let keys = Object.keys(clanData);
    for (let i = 0; i < keys.length; i++) {
        Object.assign(clanData, {[keys[i].replaceAll(" ", "_")]: clanData[keys[i]] })[keys[i]];
        if (keys[i] !== keys[i].replaceAll(" ", "_")) {
            delete clanData[keys[i]]
        }
    }
    
    keys = Object.keys(clanData); // reassign updated clan names
    for (let i = 0; i < keys.length; i++) {
        Clans.clans.push(new Clan(
            keys[i],
            eval(`clanData.${keys[i]}.icon`), 
            eval(`clanData.${keys[i]}.tag`),
            eval(`clanData.${keys[i]}.taghex`),
            eval(`clanData.${keys[i]}.members`)
        ));
    }
});

let records = {};
$('#file-loader').load("src/data/player_records.json", () => {
    records = JSON.parse($('#file-loader')[0].innerHTML);
});

