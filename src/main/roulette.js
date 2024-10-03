const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

class Roulette {
    static round = -1;
    static rouletteTowers = [];
    static prev = [];
    static failed = false;

    static init = () => {
        // reset
        this.stop();
        this.round = -1;
        this.prev = [];
        $("#roulette-start")[0].classList.remove("failed");
        let roulettePool = [];
        this.failed = false;

        $("#roulette-towers")[0].innerHTML = ""

        // get pool of towers
        if ($("#opt-main")[0].checked) {
            roulettePool = roulettePool.concat(towers);
        }

        if ($("#opt-legacy")[0].checked) {
            roulettePool = roulettePool.concat(legacy);
        }

        if ($("#opt-unverified")[0].checked) {
            roulettePool = roulettePool.concat(unverified);
        }

        for (let i = 0; i < roulettePool.length; i++) {
            if (roulettePool[i].name.charAt(0) == "S" || roulettePool[i].name.charAt(0) == "D") {
                roulettePool.splice(i, 1); // remove all steeples, getting one past r6 makes it impossible
            }
        }

        console.log(roulettePool);

        for (let i = 0; i < 10; i++) {
            // get 10 random towers
            let t = roulettePool[rand(0, roulettePool.length - 1)];
            this.rouletteTowers.push(t);
            roulettePool.splice(roulettePool.indexOf(t), 1);
        }

        this.next();
        $("#roulette-start")[0].innerHTML = "Restart";
    }

    static next = () => {
        this.round++;
        $(".roulette-tower").toArray().forEach((el) => {
            el.classList.remove("current");
        })
        $(".roulette-tower-info-controls").toArray().forEach((el) => {
            el.remove();
        })
        $("#roulette-towers")[0].innerHTML += this.template(this.rouletteTowers[this.round]);
    }

    static submit = () => {
        if ( $("#input" + this.round)[0].value > this.round) {
            try {
                this.next()
            } catch {
                // win
                $("#roulette-towers")[0].innerHTML += `
                <h2>You win!</h2>
                `
            }
        } else {
            this.fail();
        }

    }

    static stop = () => {
        this.rouletteTowers = [];
    }

    static fail = () => {
        if (!this.failed) {
            $(".current").toArray().forEach((c) => {c.classList.remove("current")});
            $("#roulette-start")[0].classList.add("failed");
            $("#roulette-towers")[0].innerHTML += `
            <h2>Score: ${this.round+1}</h2>
            `

            this.failed = true;
        }
    }

    static template = (tower) => {
        console.log(tower);

        var nRank = "#" + tower.rank + " - ";
        if (nRank == "#Unverified") {
            nRank = "";
        }

        var thumb = "";
        if (tower.videoLink != "Unverified") {
            thumb = `
            <iframe id="video" 
                src="${tower.videoLink}" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; 
                autoplay; 
                clipboard-write; 
                encrypted-media; 
                gyroscope; 
                picture-in-picture; 
                web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
            </iframe>
            `
        } else {
            thumb = `
                <img class="roulette-unverifThumb" src="assets/${tower.difficulty.toLowerCase()}.jpg">
            `
        }

        return `
        <div class="roulette-tower current">
            ${thumb}
            <div class="roulette-tower-info">
                <div class="roulette-tower-info-left">
                    <h1>${nRank} ${tower.name}</h1>
                    <h3>By ${tower.creators}</h3>
                </div>
                <div class="roulette-tower-info-controls">  
                    <input id="input${this.round}" placeholder="At least floor ${this.round+1}">
                    <span>
                        <button id="roulette-submit" onClick="Roulette.submit()">Submit</button>
                        <button id="roulette-giveUp" onClick="Roulette.fail()">Give up</button>
                    </span>
                </div>
            </div>
        </div>
        `
    }
}