addLayer("p", {
    name: "quarks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#737373",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "quarks", // Name of prestige currency
    baseResource: "particles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    softcap() {
        if(!hasUpgrade('p',23))
        return Decimal.pow(10,4)
        if(hasUpgrade('p',23))
        return Decimal.pow(10,50)
    },
    softcapPower: 0.6,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        pmult = new Decimal(1)
        if (hasUpgrade('p', 13)) pmult = pmult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) pmult = pmult.times(upgradeEffect('p', 22).div(1.5))
        if (hasUpgrade('e', 12)) pmult = pmult.times(upgradeEffect('e', 12))
        if (hasUpgrade('e', 22)) pmult = pmult.times(upgradeEffect('e', 22))
        if (hasAchievement("a", 21)) pmult = pmult.mul(tmp.a.effect)
        if (inChallenge("m",21)) pmult = pmult.pow(0.75).mul(tmp.r.effect)
        return pmult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "q", description: "Q: Quark reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        
        11: {
            title: "Split",
            description: "Particles split in half, making twice as many particles.",
            cost: new Decimal(1),
            unlocked(){
                return true
            }
        },

        12: {
            title: "Unstable",
            description: "Split particles split in half again, making twice as many particles.",
            cost: new Decimal(5),
            unlocked(){
                return true
            },
        },

        13: {
            title: "Fusion",
            description: "Some particles clump together into quarks. Quark gain is based on particles.",
            cost: new Decimal(15),
            unlocked(){
                return true
            },

            effect() {
                let eff = player.points.add(1).pow(0.5)
                if(hasUpgrade("t",21) && !inChallenge("m",21)) eff = eff.mul(upgradeEffect("t",21))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },

        21: {
            title: "Supercharged",
            description: "Particle gain is increased based on quarks.",
            cost: new Decimal(100),
            unlocked(){
                return true
            },

            effect() {
                let eff = player[this.layer].points.add(1).pow(0.75)
                if (player.m.best.gte(1)) eff = eff.mul(tmp.m.effect2)
                if (inChallenge("m",21)) eff = eff.mul(tmp.m.challengesTotalEffect)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },

        22: {
            title: "Overdrive",
            description: "Particles split and fuse way faster. Quarks and particles boost each other more.",
            cost: new Decimal(50000),
            unlocked(){
                return true
            },

            effect() {
                let eff = player[this.layer].points.add(0.3).pow(0.05)
                if (inChallenge("m",21)) eff = eff.mul(tmp.m.challengesTotalEffect)
                return eff
            },
            effectDisplay() { return format(tmp.p.upgrades[22].effect)+"x"}, // Add formatting to the effect
        },
        23: {
            title: "Limit Breaker",
            description: "Quarks defy the known laws of physics to split impossibly fast!",
            cost: new Decimal(1e60),
            unlocked(){
                return (hasMilestone('e',1) || hasMilestone('m',1))
            },

            effect() {
                let eff = player[this.layer].points.add(1).pow(0.05)
                if (inChallenge("m",21)) eff = eff.mul(tmp.m.challengesTotalEffect)
                return eff
            },
            effectDisplay() { return format(tmp.p.upgrades[23].effect)+"x"}, // Add formatting to the effect
        },
        31: {
            title: "Particle Collider",
            description: "Particles weaken electron softcap",
            cost: new Decimal("1.00e21800"),
            unlocked(){
                return (hasMilestone('e',2) || hasMilestone('m',2))
            },

            effect() {
                let eff = player.points.add(1).max(1).pow(100).log10().pow(50).pow(3)
                if (hasUpgrade("e", 31)) eff = eff.mul(upgradeEffect("e",31))
                if (inChallenge("m", 11)) eff = decimalOne
                if (inChallenge("m", 12)) eff = eff.pow(0.25)
                if (inChallenge("m", 12) && hasMilestone("m",7)) eff = eff.add(1).pow(5.275)
                if (inChallenge("m", 21)) eff = decimalOne
                return eff
            },
            effectDisplay() { return format(tmp.p.upgrades[31].effect)+"x"}, // Add formatting to the effect
        },
        32: {
            title: "Positive energy",
            description: "Quarks boost atom buyables amount",
            cost: new Decimal("1.00e28000"),
            unlocked(){
                return (hasMilestone('e',2) || hasMilestone('m',2))
            },

            effect() {
                let eff = player.p.points.add(1).max(1).log10().div(1e4).max(1)
                if (hasUpgrade("e", 32)) eff = eff.mul(upgradeEffect("e",32)).pow(2.5)
                if (inChallenge("m", 11)) eff = decimalOne
                if (inChallenge("m", 12)) eff = eff.pow(0.25)
                if (inChallenge("m", 12) && hasMilestone("m",7)) eff = eff.add(1).pow(5.275)
                if (inChallenge("m", 21)) eff = decimalOne
                return eff
            },
            effectDisplay() { return format(tmp.p.upgrades[32].effect)+"x"}, // Add formatting to the effect
        },
        33: {
            title: "Negative energy",
            description: "Quarks boost 'Double negative' effect",
            cost: new Decimal("1.00e52065"),
            unlocked(){
                return (hasMilestone('e',2) || hasMilestone('m',2))
            },

            effect() {
                let eff = player.p.points.add(1).max(1).pow(160).log10().pow(404)
                if (inChallenge("m", 11)) eff = decimalOne
                if (inChallenge("m", 12)) eff = eff.pow(0.2)
                if (inChallenge("m", 12) && hasMilestone("m",7)) eff = eff.add(1).pow(5.275)
                if (inChallenge("m", 21)) eff = decimalOne
                return eff
            },
            effectDisplay() { return format(tmp.p.upgrades[33].effect)+"x"}, // Add formatting to the effect
        },
    },

    passiveGeneration(){
        let passive = new Decimal(0)
        if (hasMilestone('e', 0)) passive = passive.add(1) //100% Prestige Points depending on Reset
        return passive
        },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("a", 0) && resettingLayer=="e") keep.push("upgrades")
        if (hasMilestone("t", 0) && resettingLayer=="t") keep.push("upgrades")
        if (hasMilestone("m", 0)) keep.push(11,12,13,21,22)
        if (hasMilestone("m", 0) && !hasMilestone("m", 2) && hasUpgrade("p",23) && (resettingLayer=="p"||resettingLayer=="e"||resettingLayer=="t")) keep.push(23)
        if (hasMilestone("m", 0) && !hasMilestone("m", 2) && hasUpgrade("p",31) && (resettingLayer=="p"||resettingLayer=="e"||resettingLayer=="t")) keep.push(31)
        if (hasMilestone("m", 0) && !hasMilestone("m", 2) && hasUpgrade("p",32) && (resettingLayer=="p"||resettingLayer=="e"||resettingLayer=="t")) keep.push(32)
        if (hasMilestone("m", 0) && !hasMilestone("m", 2) && hasUpgrade("p",33) && (resettingLayer=="p"||resettingLayer=="e"||resettingLayer=="t")) keep.push(33)
        if (hasMilestone("m", 1)) keep.push(23)
        if (hasMilestone("m", 2)) keep.push(31,32,33)
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        player[this.layer].upgrades = keep
    },
})



addLayer("e", {
    name: "electrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#0066ff",
    nodeStyle() {return {
        "background-color": (((player.e.unlocked||canReset("e")) && !inChallenge("m",21))?"#0066ff":"#4e678d"),
    }},
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "electrons", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type() {
        if(inChallenge("m",21)) {return "none"}
        else {return "normal"}
    },
    exponent: 0.5, // Prestige currency exponent
    softcap: Decimal.pow(10,4),
    softcapPower: 0.4,
    branches: ["p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        emult = new Decimal(1)
        emult = emult.mul(tmp.t.effect).mul(tmp.t.effect)
        if (hasUpgrade('e', 13)) emult = emult.times(upgradeEffect('e', 13))
        if (hasUpgrade('e', 23)) emult = emult.times(upgradeEffect('e', 23))
        return emult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e",
        description: "E: Electron reset",
        onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return player.e.best.gte(1) || player.t.best.gte(1) || player.m.best.gte(1)}}
    ],
    layerShown(){return player.p.best.gte(100000)},
    doReset(resettingLayer){
        if (layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        let keepMile = []
        let keepUpg = []
        if (player.e.best>0) keep.push(player.p.best)
        if (hasMilestone("m",6)) keepUpg.push("upgrades")
        if (hasMilestone("a",1)) keepMile.push(0,1,2)
        if (inChallenge("m",21)) keepUpg = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        player[this.layer].milestones = keepMile
        player[this.layer].upgrades = keepUpg
    },

    

    effect(){
        let eff = player.e.points.add(1).max(1)
        eff = eff.pow(2)
        if (eff.gte(Decimal.pow(10,16))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,5)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (player.t.total.gte(1)) eff = eff.mul(tmp.t.effect)
        if (hasUpgrade("t", 11)){
            eff = eff.mul(upgradeEffect('t',11).add(1).log10())}
        if (hasUpgrade("p", 31)){
                eff = eff.mul(upgradeEffect('p',31).mul(1e7).add(1).max(1))}
        if (player.e.points.lt(1) && player.e.best.gte(1)) eff = eff.add(1)
        if (inChallenge("m", 11)) eff = eff.pow(0.75)
        if (inChallenge("m", 12)) eff = decimalOne
        if (inChallenge("m", 21)) eff = decimalOne
        return eff
    },
    effectDescription() {
        let dis = "Boosting particle splitting by x" + format(tmp.e.effect)
        if (!hasUpgrade("t",11)) {
        if (tmp.e.effect.gte(Decimal.pow(10,16))) dis += " (softcapped)"}
        if (hasUpgrade("t",11)) {
        if (tmp.e.effect.gte(Decimal.pow(10,16).mul(upgradeEffect('t',11)).add(1).log10())) dis += " (softcapped)"}
        return dis
    },
    layerShown() {
        let shown = player.p.total.gte(500)
        if(player.e.unlocked) shown = true
        return shown
    },

    upgrades: {
        11: {
            title: "Charge",
            description: "Negative charge of electrons causes faster particle division.",
            cost: new Decimal(1),
            unlocked() {return true},

            effect() {
                let eff = player[this.layer].points.add(1).max(1)
                eff = eff.pow(0.15)

                if (hasUpgrade("t", 12)){
                    eff = eff.mul(upgradeEffect('t',11).pow(1.33).div(2e3))}
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },

        12: {
            title: "Vibration",
            description: "Electrons vibrate and bounce particles into each other, creating more quarks.",
            cost: new Decimal(100),
            unlocked() {return true},

            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },

       13: {
            title: "Double negative",
            description: "Electrons collide with each other, boosting electron gain",
            cost: new Decimal(5000000),
            unlocked() {return true},

            effect() {
                let eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade("p",33)) eff = eff.mul(upgradeEffect("p",33))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        }, 
        21: {
            title: "Burst",
            description: "Electrons sometimes explode into particles. Boosts particle gain",
            cost: new Decimal(5e8),
            unlocked() {return true},

            effect() {
                return player[this.layer].points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        22: {
            title: "HyperQuark",
            description: "Exploding electrons throw particle into other particles, creating significantly more quarks",
            cost: new Decimal(2.5e10),
            unlocked() {return true},

            effect() {
                return player[this.layer].points.add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        23: {
            title: "Preservation",
            description: "Electrons emit particles without exploding. Boosts electron gain",
            cost: new Decimal(1e50),
            unlocked() {return true},

            effect() {
                return player[this.layer].points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        31: {
            title: "Supercollider",
            description: "Electrons boost 'Particle Collider' effect",
            cost: new Decimal("e3024495"),
            unlocked() {return challengeCompletions("m",12) >= 1},

            effect() {
                return player[this.layer].points.add(1).pow(0.52)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        32: {
            title: "Mania",
            description: "Electrons boost 'Positive energy' effect",
            cost: new Decimal("e6143395"),
            unlocked() {return challengeCompletions("m",12) >= 2},

            effect() {
                return player[this.layer].points.add(1).pow(100).pow(100).max(1).log10()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        33: {
            title: "Despair",
            description: "Electrons boost 'Negative energy' effect",
            cost: new Decimal("ee6143395"),
            unlocked() {return challengeCompletions("m",12) == 3},

            effect() {
                return player[this.layer].points.add(1).pow(0.05).pow(0.05).max(1).log10()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },

    passiveGeneration(){
        let passive = new Decimal(0)
        if (hasMilestone('t', 3)) passive = passive.add(1) //100% Prestige Points depending on Reset
        return passive
        },

    milestones: {
        0: {
            requirementDescription: "2,500,000 total electrons",
            effectDescription: "Gain 100% of quarks per second",
            done() { return player.e.total.gte(2.5e6) }
        },
        1: {
            requirementDescription: "1e15 total electrons",
            effectDescription: "Unlock a quark upgrade",
            done() { return player.e.total.gte(1e15) }
        },
        2: {
            requirementDescription: "1e8500 total electrons",
            effectDescription: "Unlock 3 more quark upgrades",
            done() { return player.e.total.gte("1.00e8500") },
            unlocked() {
                return hasMilestone("t",3)
            }
        },
    },
    milestonePopups(resettingLayer) {
        if(hasMilestone("a",1) && resettingLayer=='q','e')
            return false
        else if(!hasMilestone("a",1))
            return true
    },
})



addLayer("t", {
    name: "atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#99ff33",
    nodeStyle() {return {
        "background-color": (((player.t.unlocked||canReset("t")) && !inChallenge("m",21))?"#99ff33":"#697a57"),
    }},
    requires()  { if(hasUpgrade("m",12) && !inChallenge("m",11)) {return new Decimal(1e100).div(upgradeEffect("m",11).pow(1e4).pow(25).max(1))}
    else {return new Decimal(1e100)}}, // Can be a function that takes requirement increases into account
    resource: "atoms", // Name of prestige currency
    baseResource: "electrons", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type() {
        if(inChallenge("m",12) || inChallenge("m",21)) {return "none"}
        else {return "static"}
    },
    exponent() {
        let tExp = new Decimal(1.3)
        if(hasUpgrade("m",13)) tExp = tExp.sub(upgradeEffect("m",13))
        return tExp},
    base: new Decimal(1e3),
    softcap: Decimal.pow(10,4),
    softcapPower: 0.4,
    branches: ["p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        tmult = new Decimal(1)
        if (hasUpgrade("t",13))
            tmult = tmult.times(upgradeEffect("t",13)).div(Decimal.pow(10,100).log10().pow(75))
        return tmult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a",
        description: "A: Atom reset",
        onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return player.t.best.gte(1) || player.m.best.gte(1)}}
    ],
    layerShown(){return player.e.best.gte(1e15)},
    resetsNothing() { return hasMilestone("t", 4) },
    canBuyMax() { return hasMilestone("t", 2) && !inChallenge("m",12)},
    canAfford() {
        let aff = tmp.e.points
        if(aff > player.t.requires) aff = true
        if(inChallenge("m",12) || inChallenge("m",21)) aff = false
        return aff
    },
    doReset(resettingLayer){
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        let keepMile = []
        if(player.t.best>0) keep.push(player.e.best)
        if(hasMilestone("m",5)) keepMile.push(0,1,2,3,4)
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        if(hasMilestone("m",5)) player[this.layer].milestones = keepMile
    },
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "t") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html"],
            ["display-text",
                function() {
                    return "You have "+format(player.e.points)+" electrons<br><br>Your best atoms is "+format(player.t.best)+"<br>You have made a total of "+format(player.t.total)+" atoms"  
                }
            ],
            "upgrades"
            ]
        },
        "Milestones": {
            content:[
                function() {if (player.tab == "t") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html"],
            ["display-text"
            ],
                "milestones"
            ],
        },
        "Nucleus": {
            content:[
                function() {if (player.tab == "t") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html"]
            ["display-text"
            ],
                "buyables"
            ],
            unlocked() {return hasMilestone("t",1)}
        },
    },

    buyablePower(x) {
        x = new Decimal(x)
        let eff = decimalOne
        return eff
    },

    effect(){
        let eff = player.t.points.add(1).max(1).pow(1.8)
        if(player.m.best.gte(1)) eff = eff.mul(tmp.m.effect1)
        if(getBuyableAmount("t", 11).gte(1)){
        eff = eff.mul(getBuyableAmount("t", 11).mul(tmp.t.buyables[11].effect))}
        if(getBuyableAmount("t", 12).gte(1)){
        eff = eff.pow(getBuyableAmount("t", 12).mul(tmp.t.buyables[12].effect).add(1))}
        if (eff.gte(Decimal.pow(10,15))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,8)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(Decimal.pow(10,100))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,100)).log10().pow(0.85)).mul(Decimal.pow(10,100))
        if (eff.gte(Decimal.pow(10,1e6))) eff = eff.log10().div(1e4).pow(2e5)
        if (player.t.points.lt(1) && player.t.best.gte(1) && getBuyableAmount("t", 11).lt(1)) eff = eff.add(1)
        if (inChallenge("m", 11)) eff = decimalOne
        if (inChallenge("m", 21)) eff = decimalOne
        return eff
    },
    effectDescription() {
        let dis = "Boosting electron vibration by x" + format(tmp.t.effect)
        if (tmp.t.effect.gte(Decimal.pow(10,16))) dis += " (softcapped)"
        return dis
    },
    layerShown() {
        let shown = player.e.total.gte(1e15)
        if(player.t.unlocked) shown = true
        return shown
    },

    upgrades: {
        11: {
            title: "Atomic",
            description: "Atoms make electron effect softcap start later.",
            cost: new Decimal(1),
            unlocked() {return true},

            effect() {
                if(player[this.layer].points.gte(1)) {
                return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
                return decimalOne
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        12: {
            title: "Positive charge",
            description: "'Atomic' boosts 'Charge' at a reduced rate",
            cost: new Decimal(3),
            unlocked() {return true},

            effect() {
                return true
            },
        },
        13: {
            title: "Self-positivity",
            description: "Atom upgrades boost atom gain",
            cost: new Decimal(10),
            unlocked() {return true},

            effect() {
                return player.t.upgrades.length
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        21: {
            title: "Nuclear fusion",
            description: "Atoms boost 'Fusion' effect",
            cost: new Decimal(30),
            unlocked() {return true},

            effect() {
                let eff = player.t.points.max(1).pow(12)
                if(player.t.points.lt(1)) eff = 1
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        22: {
            title: "Autoanalysis",
            description: "Atoms boost nucleus buyables amount",
            cost: new Decimal(35),
            unlocked() {return true},

            effect() {
                let eff = player.t.points.max(1).pow(25).log(10).round()
                if (hasUpgrade("p",32)) eff = eff.mul(upgradeEffect("p",32))
                return eff
            },
            effectDisplay() { return "<br>Neutrons: +"+formatWhole(upgradeEffect(this.layer, this.id))+"<br>Protons +"+formatWhole(upgradeEffect(this.layer, this.id).pow(0.3))}
        },
        23: {
            title: "Superatomic",
            description: "Atoms boost neutron buyable effect",
            cost: new Decimal(350),
            unlocked() {return true},

            effect() {
                let eff = player.t.points.add(1)
                if(eff.lt(1)) eff = 1
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"}
        },
    },

    buyables: {
        11: {
            title: "Neutron",
            cost() { 
                let base = tmp.t.buyables[11].costb
                let exp = tmp.t.buyables[11].coste
                let x = player.t.buyables[11]
                let cost = Decimal.pow(base,x.pow(exp)).mul(1e130)
                return cost
            },
            costb() {
                let cost = new Decimal(10)
                if(hasAchievement("a",31)) cost = cost.sub(5)
                return cost
            },
            coste() { 
                let cost = new Decimal(1.45)
                if(hasAchievement("a",31)) cost = cost.sub(0.2)
                return cost
            },
            base() { 
                let exp = decimalOne
                //if (hasUpgrade("Ud",201)) exp = exp.mul(tmp.Ud.upgrades[201].effect)
                let base = player.t.points.add(10).log10().add(10).log10().pow(exp)
                if (player.t.buyables[11].gte(1)) base = base.mul(layers.t.buyablePower(player.t.buyables[11]))
                return base
            },
            display() {
                let x = tmp.t.buyables[11].extra
                let extra = ""
                let bonus = ""
                let bonusDis = ""
                let effbonus = 1
                if(hasUpgrade("t",22)){
                    bonus = formatWhole(upgradeEffect("t",22))}
                if(hasUpgrade("t",23)){
                    effbonus = format(upgradeEffect("t",23))}
                if(getBuyableAmount("t", 11).gte(1)){
                extra = formatWhole(x)}
                if(hasUpgrade("t",22)) bonusDis = "(+"+bonus+")"
                let dis = "Increase Atom effect base<br>(based on electrons)"
                return dis + ".\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
                Effect: x" + format(new Decimal(5).mul(effbonus))+"\n\
                Amount: " + formatWhole(getBuyableAmount("t", 11))+bonusDis
            },
            canAfford() {
                return player.e.points.gte(tmp[this.layer].buyables[this.id].cost)},
            maxAfford() {
                let s = player.e.points
                let base = tmp.t.buyables[11].costb
                let exp = tmp.t.buyables[11].coste
                let target = s.div(5e3).log(base).root(exp)
                return target.floor().add(1)
            },
            buy() {
                player.e.points = player.e.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("t",22)) getBuyableAmount("t",11).add(upgradeEffect("t",22))
                if(hasMilestone("t",2)) this.buyMax()
            },
            buyMax() { 
                let target = tmp.t.buyables[11].maxAfford
                let base = tmp.t.buyables[11].costb
                let exp = tmp.t.buyables[11].coste
                let cost = Decimal.pow(base,target.pow(exp)).mul(5e3)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.t.buyables[11] = player.t.buyables[11].max(target)
                }
            },
            effect() {
                let eff = new Decimal(5)
                if (hasUpgrade("t",22)){eff = eff.add(upgradeEffect("t",22))}
                if (hasUpgrade("t",23)){eff = eff.mul(upgradeEffect("t",23))}
                return eff
            },  
        },

        12: {
            title: "Proton",
            cost() { 
                let base = tmp.t.buyables[12].costb
                let exp = tmp.t.buyables[12].coste
                let x = player.t.buyables[12]
                let cost = Decimal.pow(base,x.pow(exp)).mul(1e150)
                return cost
            },
            costb() {
                let cost = new Decimal(100)
                if(hasAchievement("a",31)) cost = cost.sub(90)
                return cost
            },
            coste() { 
                let cost = new Decimal(2.125)
                if(hasAchievement("a",31)) cost = cost.sub(0.625)
                return cost
            },
            base() { 
                let exp = decimalOne
                //if (hasUpgrade("Ud",201)) exp = exp.mul(tmp.Ud.upgrades[201].effect)
                let base = player.t.points.add(10).log10().add(10).log10().pow(exp)
                if (player.t.buyables[12].gte(1)) base = base.mul(layers.t.buyablePower(player.t.buyables[12]))
                return base
            },
            display() {
                let x = tmp.t.buyables[12].extra
                let extra = ""
                let bonus = ""
                let bonusDis = ""
                if(hasUpgrade("t",22)){
                    bonus = formatWhole(upgradeEffect("t",22).pow(0.3))}
                if(getBuyableAmount("t", 12).gte(1)){
                extra = formatWhole(x)}
                if(hasUpgrade("t",22)) bonusDis = "(+"+bonus+")"
                let dis = "Increase Atom effect exponent<br>(based on electrons)"
                return dis + ".\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
                Effect: +" + new Decimal(0.125)+"\n\
                Amount: " + formatWhole(getBuyableAmount("t", 12))+bonusDis
            },
            canAfford() {
                return player.e.points.gte(tmp[this.layer].buyables[this.id].cost)},
            maxAfford() {
                let s = player.e.points
                let base = tmp.t.buyables[12].costb
                let exp = tmp.t.buyables[12].coste
                let target = s.div(5e3).log(base).root(exp)
                return target.floor().add(1)
            },
            buy() {
                player.e.points = player.e.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("t",22)) getBuyableAmount("t",11).add(upgradeEffect("t",22))
                if(hasMilestone("t",2)) this.buyMax()
            },
            buyMax() { 
                let target = tmp.t.buyables[12].maxAfford
                let base = tmp.t.buyables[12].costb
                let exp = tmp.t.buyables[12].coste
                let cost = Decimal.pow(base,target.pow(exp)).mul(5e3)
                if (tmp[this.layer].buyables[this.id].canAfford) {
                    player.t.buyables[12] = player.t.buyables[12].max(target)
                
                }
            },
            effect() {
                let eff = new Decimal(0.125)
                if (hasUpgrade("t",22))eff = eff.add(upgradeEffect("t",22).pow(0.3))
                return eff
            },  
        },
    },

    milestones: {
        0: {
            requirementDescription: "3 atoms",
            effectDescription: "Keep Quark upgrades on reset",
            done() { return player.t.best.gte(3) }
        },
        1: {
            requirementDescription: "7 atoms",
            effectDescription: "Unlock the Nucleus",
            done() { return player.t.best.gte(7) }
        },
        2: {
            requirementDescription: "50 total atoms",
            effectDescription: "You can buy max atoms and nucleus buyables",
            done() { return player.t.total.gte(50) }
        },
        3: {
            requirementDescription: "100 total atoms",
            effectDescription: "Gain 100% of electrons per second",
            done() { return player.t.total.gte(100) }
        },
        4: {
            requirementDescription: "1000 total atoms",
            effectDescription: "Atoms reset nothing",
            done() { return player.t.total.gte(1000) }
        },
    },
})

addLayer("m", {
    name: "molecules", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#ff6699",
    nodeStyle() {return {
        "background-color": (((player.m.unlocked||canReset("m")) && !inChallenge("m",21))?"#ff6699":"#76425c"),
    }},
    requires() { if(hasUpgrade("m",11)) {return new Decimal(1310).div(upgradeEffect("m",11).pow(0.5).max(1))}
                else {return new Decimal(1310)}}, // Can be a function that takes requirement increases into account
    resource: "molecules", // Name of prestige currency
    baseResource: "atoms", // Name of resource prestige is based on
    baseAmount() {return player.t.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1.3),
    base: new Decimal(1.04),
    softcap: Decimal.pow(10,4),
    softcapPower: 0.4,
    branches: ["e","t"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mMult = new Decimal(1)
        return mMult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m",
        description: "M: Molecule reset",
        onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return player.m.best.gte(1)}}
    ],
    layerShown(){return player.t.best.gte(700)},
    //resetsNothing() { return hasMilestone("t", 4) },
    canBuyMax() { return hasMilestone("m", 3)},
    doReset(resettingLayer){
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        if(player.m.best>0) keep.push(tmp.e.best,tmp.t.best)
        if (layers[resettingLayer].row > this.row || layers[resettingLayer].position > this.position) layerDataReset(this.layer, keep)
    },
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "m") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html"],
            ["display-text",
                function() {
                    return "Your best molecules is "+format(player.m.best)+"<br>You have made a total of "+format(player.m.total)+" molecules"  
                }
            ],
            "blank",
            "upgrades"
            ]
        },
        "Milestones": {
            content:[
                function() {if (player.tab == "m") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html"],
            ["display-text"
            ],
                function() {
                    return ["milestones",[0,1,2,3,4,5,6,8]]
                },
            ],
        },
        "UD Milestones": {
            buttonStyle: {"border-color": "#623dc7"},
            content:[
                function() {if (player.tab == "m") return "main-display"},
            "blank",
            ["raw-html"],
            ["display-text"
            ],
                function() {if(inChallenge("m",21) || hasMilestone("m",7)) return ["milestones",[7]]},
            ],
        },
        "Challenges": {
            content:[
                function() {if (player.tab == "m") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "m") return "resource-display"},
            "blank",
                "challenges"
            ],
            unlocked() {return hasMilestone("m",4)}
        },
        // "Nucleus": {
        //     content:[
        //         function() {if (player.tab == "t") return "main-display"},
        //     "prestige-button",
        //     "blank",
        //     ["raw-html"]
        //     ["display-text"
        //     ],
        //         "buyables"
        //     ],
        //     unlocked() {return hasMilestone("t",1)}
        // },
    },

    buyablePower(x) {
        x = new Decimal(x)
        let eff = decimalOne
        return eff
    },

    effect1(){
        let eff = player.m.points.add(1).max(1).pow(4.75)
        let sc1 = Decimal.pow(10,15)
        let sc2 = Decimal.pow(10,100)
        let sc3 = Decimal.pow(10,1e6)
        if (challengeCompletions("m",21)>0) sc2 = sc2.mul(challenges("m",21).rewardEffect)
        if (eff.gte(sc1)) eff = Decimal.pow(10,eff.div(Decimal.pow(10,8)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(sc2)) eff = Decimal.pow(10,eff.div(Decimal.pow(10,100)).log10().pow(0.85)).mul(Decimal.pow(10,100))
        if (eff.gte(sc3)) eff = eff.log10().div(1e6).pow(2e3)
        if (player.m.points.lt(1) && player.m.best.gte(1)) eff = eff.add(1)
        if (hasUpgrade("m",14)) eff = eff.mul(upgradeEffect("m",14)) 
        if (challengeCompletions("m", 11)>0) eff = eff.mul(tmp.m.challenges[11].rewardEffect)
        if (inChallenge("m", 11)) eff = decimalOne
        if (inChallenge("m", 21)) eff = decimalOne
        return eff
    },
    effect2(){
        let eff = player.m.points.add(1).max(1).pow(10).mul(player.m.points.add(1).pow(1.6))
        let sc1 = Decimal.pow(10,15)
        let sc2 = Decimal.pow(10,100)
        let sc3 = Decimal.pow(10,1e6)
        if (challengeCompletions("m",21)>0) sc2 = sc2.mul(challenges("m",21).rewardEffect)
        if (eff.gte(sc1)) eff = Decimal.pow(10,eff.div(Decimal.pow(10,8)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(sc2)) eff = Decimal.pow(10,eff.div(Decimal.pow(10,100)).log10().pow(0.85)).mul(Decimal.pow(10,100))
        if (eff.gte(sc3)) eff = eff.log10().div(1e6).pow(2e3)
        if (player.m.points.lt(1) && player.m.best.gte(1)) eff = eff.add(1)
        if (hasUpgrade("m",14)) eff = eff.mul(upgradeEffect("m",14))
        if (challengeCompletions("m", 11)>0) eff = eff.mul(tmp.m.challenges[11].rewardEffect)
        if (inChallenge("m", 11)) eff = decimalOne
        if (inChallenge("m", 21)) eff = decimalOne
        return eff
    },
    challengesTotalEffect(){
        let eff = new Decimal(0)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=1)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=2)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=3)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=4)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=5)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))>=6)
            eff = eff.add(1)
        if (challengeCompletions("m",11)+(challengeCompletions("m",12))+(challengeCompletions("m",21))==7)
            eff = eff.add(1)
        eff = eff.pow(3).pow(2)
        return eff
    },
    effectDescription() {
        let dis = "Boosting atom effect by x" + format(tmp.m.effect1) 
        if (tmp.m.effect1.gte(Decimal.pow(10,16))) dis += " (softcapped)"
        dis += " and 'Supercharged' effect by x" + format(tmp.m.effect2)
        if (tmp.m.effect2.gte(Decimal.pow(10,16))) dis += " (softcapped)"
        return dis
    },
    layerShown() {
        let shown = player.t.total.gte(666)
        if(player.m.unlocked) shown = true
        return shown
    },

    upgrades: {
        11: {
            title: "Reactivity",
            description: "Best molecules reduce cost requirement",
            cost: new Decimal(5),
            unlocked() {return true},

            effect() {
                let eff = player[this.layer].best.add(1).max(1).pow(3).div(10).log10().max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        12: {
            title: "Submolecular",
            description: "'Reactivity' also reduces atom cost requirement",
            cost: new Decimal(10),
            unlocked() {return true},
            //{return new Decimal(1e100).div(upgradeEffect("m",11).pow(1e4).pow(25).max(1))}
            effect() {
                let eff = upgradeEffect("m",11).pow(10).max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        13: {
            title: "Growth",
            description: "Number of molecule upgrades reduces atom cost scaling exponent",
            cost: new Decimal(20),
            unlocked() {return true},

            effect() { 
                return new Decimal(0.015).mul(player.m.upgrades.length)
            },
            effectDisplay() {
                let dis ="-"+format(upgradeEffect(this.layer, this.id))+"<br>Atom cost exp: "+format(tmp.t.exponent)
                return dis
            }
        },
        14: {
            title: "Rapid expansion",
            description: "Particles boost molecule effect",
            cost: new Decimal(25),
            unlocked() {return true},

            effect() {
                let eff = player.points.add(1).max(1).pow(0.01).div(20).max(1)
                if(player.points.gte(1)) {return eff}
                else {return decimalOne}
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        21: {
            title: "Molecular boost I",
            description: "Best molecules boost particle gain in molecular challenges",
            cost: new Decimal(40),
            unlocked() {return true},

            effect() {
                let eff = player.m.best.add(1).max(1)
                if (inChallenge("m",11)||inChallenge("m",12)||inChallenge("m",21)) {eff = eff.pow(5).pow(5)
                    return eff}
                else {(eff = decimalOne)
                    return eff}
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        22: {
            title: "M upg 6",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        23: {
            title: "M upg 7",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        24: {
            title: "M upg 8",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        31: {
            title: "M upg 9",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        32: {
            title: "M upg 10",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        33: {
            title: "M upg 11",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        34: {
            title: "M upg 12",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return true},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        41: {
            title: "M upg 13",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return false},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        42: {
            title: "M upg 14",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return false},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        43: {
            title: "M upg 15",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return false},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        44: {
            title: "M upg 16",
            description: "placeholder",
            cost: new Decimal(1e307),
            unlocked() {return false},

            // effect() {
            //     if(player[this.layer].points.gte(1)) {
            //     return player[this.layer].points.add(1).max(1).add(player[this.layer].points).pow(10).div(2)}
            //     return decimalOne
            // },
            // effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },

    // buyables: {
    //     11: {
    //         title: "Neutron",
    //         cost() { 
    //             let base = tmp.t.buyables[11].costb
    //             let exp = tmp.t.buyables[11].coste
    //             let x = player.t.buyables[11]
    //             let cost = Decimal.pow(base,x.pow(exp)).mul(1e130)
    //             return cost
    //         },
    //         costb() {
    //             let cost = new Decimal(10)
    //             if(hasAchievement("a",31)) cost = cost.sub(5)
    //             return cost
    //         },
    //         coste() { 
    //             let cost = new Decimal(1.45)
    //             if(hasAchievement("a",31)) cost = cost.sub(0.2)
    //             return cost
    //         },
    //         base() { 
    //             let exp = decimalOne
    //             //if (hasUpgrade("Ud",201)) exp = exp.mul(tmp.Ud.upgrades[201].effect)
    //             let base = player.t.points.add(10).log10().add(10).log10().pow(exp)
    //             if (player.t.buyables[11].gte(1)) base = base.mul(layers.t.buyablePower(player.t.buyables[11]))
    //             return base
    //         },
    //         display() {
    //             let x = tmp.t.buyables[11].extra
    //             let extra = ""
    //             let bonus = ""
    //             let bonusDis = ""
    //             let effbonus = 1
    //             if(hasUpgrade("t",22)){
    //                 bonus = formatWhole(upgradeEffect("t",22))}
    //             if(hasUpgrade("t",23)){
    //                 effbonus = format(upgradeEffect("t",23))}
    //             if(getBuyableAmount("t", 11).gte(1)){
    //             extra = formatWhole(x)}
    //             if(hasUpgrade("t",22)) bonusDis = "(+"+bonus+")"
    //             let dis = "Increase Atom effect base<br>(based on electrons)"
    //             return dis + ".\n\
    //             Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
    //             Effect: x" + format(new Decimal(5).mul(effbonus))+"\n\
    //             Amount: " + formatWhole(getBuyableAmount("t", 11))+bonusDis
    //         },
    //         canAfford() {
    //             return player.e.points.gte(tmp[this.layer].buyables[this.id].cost)},
    //         maxAfford() {
    //             let s = player.e.points
    //             let base = tmp.t.buyables[11].costb
    //             let exp = tmp.t.buyables[11].coste
    //             let target = s.div(5e3).log(base).root(exp)
    //             return target.floor().add(1)
    //         },
    //         buy() {
    //             player.e.points = player.e.points.sub(this.cost())
    //             setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
    //             if(hasUpgrade("t",22)) getBuyableAmount("t",11).add(upgradeEffect("t",22))
    //             if(hasMilestone("t",2)) this.buyMax()
    //         },
    //         buyMax() { 
    //             let target = tmp.t.buyables[11].maxAfford
    //             let base = tmp.t.buyables[11].costb
    //             let exp = tmp.t.buyables[11].coste
    //             let cost = Decimal.pow(base,target.pow(exp)).mul(5e3)
    //             if (tmp[this.layer].buyables[this.id].canAfford) {
    //                 player.t.buyables[11] = player.t.buyables[11].max(target)
    //             }
    //         },
    //         effect() {
    //             let eff = new Decimal(5)
    //             if (hasUpgrade("t",22)){eff = eff.add(upgradeEffect("t",22))}
    //             if (hasUpgrade("t",23)){eff = eff.mul(upgradeEffect("t",23))}
    //             return eff
    //         },  
    //     },
    // },

    milestones: {
        0: {
            requirementDescription: "2 molecules",
            effectDescription: "Keep first 5 Quark upgrades on reset",
            done() { return player.m.best.gte(2) }
        },
        1: {
            requirementDescription: "3 molecules",
            effectDescription: "Keep 6th Quark upgrade on reset",
            done() { return player.m.best.gte(3) }
        },
        2: {
            requirementDescription: "10 total molecules",
            effectDescription: "Keep all quark upgrades on reset",
            done() { return player.m.total.gte(10) }
        },
        3: {
            requirementDescription: "15 total molecules",
            effectDescription: "You can buy max molecules",
            done() { return player.m.total.gte(15) }
        },
        4: {
            requirementDescription: "25 total molecules",
            effectDescription: "Unlock challenges",
            done() { return player.m.total.gte(25) }
        },
        5: {
            requirementDescription: "100 total molecules",
            effectDescription: "Keep atom milestones on reset",
            done() { return player.m.total.gte(100) }
        },
        6: {
            requirementDescription: "150 total molecules",
            effectDescription: "Keep electron upgrades on reset",
            done() { return player.m.total.gte(150) }
        },
        7: {
            requirementDescription: "1e20 particles in 'Undiscovered",
            effectDescription: "'Uncharged' effect on quark row 3 upgrades is weaker",
            done() {
                if(inChallenge("m",21)) {return player.points.gte(1e20)}
                else return false
            },
            doneColor: "#623dc7",
            notdoneColor: "#4d426c",
            style: {"background-color"() {return hasMilestone("m",7)?tmp.m.milestones[7].doneColor:tmp.m.milestones[7].notdoneColor}},
            unlocked() {
                if(inChallenge("m",21) || tmp.m.milestones[7].done) return true
                else return false
            }
        },
        8: {
            requirementDescription: "250 total molecules",
            effectDescription: "Gain 100% of atoms per second",
            done() { return player.m.total.gte(250) },
            unlocked() {return hasMilestone("m",6)}
        },
    },
    

    challenges: { // Order: 1x1,2x1,1x2,3x1,4x1,2x2,1x3,3x2,2x3,4x2,3x3,4x3
       // rows: 2,
       // cols: 2,
        11: {
            name: "Unreactive",
            challengeDescription: function() {
                let c11 = "Molecule and atom effects are useless.<br>Row 3 quark upgrades have no effect.<br>Electron effect is weaker."
                if (inChallenge("m", 11)) c11 = c11 + "<br> (In Challenge)"
                if (challengeCompletions("m", 11) == 3) c11 = c11 + "<br> (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("m",11) + "/" + tmp.m.challenges[11].completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("m", 11) == 0) return Decimal.pow(10,200);
                if (challengeCompletions("m", 11) == 1) return Decimal.pow(10,750);
                if (challengeCompletions("m", 11) == 2) return Decimal.pow(10,2e10);
            },
            currencyDisplayName: "particles",
            completionLimit:3 ,
            rewardDescription: "Molecules boost their effect.",
            rewardEffect() {
                 let c11 = player.m.points.add(1).max(1)
                 let c11r = new Decimal(5)
                 let c11c = challengeCompletions("m", 11)
                 c11c = Decimal.pow(1.75, c11c)
                 c11 = Decimal.log10(c11).pow(0.7)
                 c11 = Decimal.pow(10,c11)
                 c11r = c11r.mul(c11c)
                 c11 = c11.pow(c11r)
                 //if (hasMilestone("Ui", 5)) c11 = powExp(c11.pow(1.1),1.1)
                 //if (inChallenge("m", 12)) c11 = decimalOne
                 return c11
            },
            rewardDisplay() {return format(tmp.m.challenges[11].rewardEffect)+"x"},
            unlocked(){
                return hasMilestone("m", 4)
            }
        },
        12: {
            name: "Uncharged",
            challengeDescription: function() {
                let c12 = "Electron effect is useless.<br>Row 3 quark upgrades are weaker.<br>You cannot gain atoms."
                if (inChallenge("m", 12)) c12 = c12 + "<br> (In Challenge)"
                if (challengeCompletions("m", 12) == 3) c12 = c12 + "<br> (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("m",12) + "/" + tmp.m.challenges[12].completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("m", 12) == 0) return Decimal.pow(10,1710);
                if (challengeCompletions("m", 12) == 1) return Decimal.pow(10,7000);
                if (challengeCompletions("m", 12) == 2) return Decimal.pow(10,2e10);
            },
            currencyDisplayName: "particles",
            completionLimit:3 ,
            rewardDescription: "Unlock an electron upgrade per completion",
            rewardEffect() {
                let c12 = decimalZero
                c12 = c12.add(challengeCompletions("m",12))
                return c12
            },
            rewardDisplay() {return "+"+formatWhole(tmp.m.challenges[12].rewardEffect)},
            unlocked(){
                return challengeCompletions("m",11) > 0
            }
        },
        21: {
            name: "Undiscovered",
            challengeDescription: function() {
                let c21 = "Effects of both challenges, and their total completions boost row 2 quark upgrades while in this challenge. (Currently: "+format(tmp.m.challengesTotalEffect)+"x)<br>Unlock a layer only accessible in this challenge, replacing electrons."
                if (inChallenge("m", 21)) c21 = c21 + "<br> (In Challenge)"
                if (challengeCompletions("m", 21) == 3) c21 = c21 + "<br> (Completed)"
                c21 = c21 + "<br>Completed:" + challengeCompletions("m",21) + "/" + tmp.m.challenges[21].completionLimit
                return c21
            },
            goal(){
                if (challengeCompletions("m", 21) == 0) return Decimal.pow(10,1200);
            },
            onEnter() {
                return true
            },
            currencyDisplayName: "particles",
            completionLimit:1 ,
            rewardDescription: "Molecule softcaps start later.",
            rewardEffect() {
                 let c21 = player.m.points.add(1).max(1)
                 let c21r = new Decimal(4.2)
                 let c21c = challengeCompletions("m", 21)
                 c21c = Decimal.pow(1.5, c21c)
                 c21 = Decimal.log10(c21).pow(0.7)
                 c21 = Decimal.pow(10,c21)
                 c21r = c21r.mul(c21c)
                 c21 = c21.pow(c21r)
                 return c21
            },
            rewardDisplay() {return format(tmp.m.challenges[21].rewardEffect)+"x"},
            unlocked(){
                return challengeCompletions("m",12) > 0
            }
        },
    },
})


addLayer("r", {
    name: "anti-quarks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Φ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#583758",
    nodeStyle() {return {
        "background": "radial-gradient(#000000,rgb(196, 0, 218))",
        color: (player.oldStyle?"000000":"rgb(255, 217, 0)"),
    }},
    componentStyles() { return {
        "prestige-button": {
            color: (player.oldStyle?"4d4d4d":"rgba(255, 217, 0)"),
        },
    }},
    requires: new Decimal(1308), // Can be a function that takes requirement increases into account
    resource: "anti-quarks", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    softcap() {
        return Decimal.pow(10,3)
    },
    softcapPower: 0.6,
    branches: ['p'],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        rMult = new Decimal(1)
        if(hasUpgrade("r",11)) rMult = rMult.div(2)
        if(hasUpgrade("r",12)) rMult = rMult.div(2)
        if(hasUpgrade("r",21)) rMult = rMult.div(upgradeEffect("r",21))
        return rMult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Anti-Quark reset (can only reset in 'Undiscovered' challenge", onPress(){if ((inChallenge("m",21)) && (canReset(this.layer))) doReset(this.layer)}},
    ],
    layerShown(){return inChallenge("m",21)},
    canBuyMax() {return true},

    effect(){
        let eff = player.r.points.add(1).max(1)
        if (player.r.points.lt(1) && player.r.best.gte(1)) eff = eff.add(1)
        return eff
    },
    effectDescription() {
        let dis = "Boosting quark formation by " + format(tmp.r.effect) + "x"
        return dis
    },

    upgrades: {
        
        11: {
            title: "Unsplit",
            description: "Split particles come together again to form twice as many anti-quarks.",
            cost: new Decimal(3),
            unlocked(){
                return true
            }
        },
        12: {
            title: "Stable",
            description: "Split particles reform into anti-quarks twice as fast.",
            cost: new Decimal(30),
            unlocked(){
                return true
            }
        },
        13: {
            title: "Fission",
            description: "Some quarks split apart into particles. Particle gain is based on quarks.",
            cost: new Decimal(100),
            unlocked(){
                return true
            },
            effect() {
                let eff = player.p.points.add(1).pow(0.5).max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Subcharged",
            description: "Anti-quark gain is increased based on particles.",
            cost: new Decimal(1000),
            unlocked(){
                return true
            },
            effect() {
                let eff = player.points.add(1).pow(0.25).max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "Antidrive",
            description: "Quarks split and reform faster. Quarks and anti-quarks boost each other.",
            cost: new Decimal(2222),
            unlocked(){
                return true
            },
            effect() {
                let eff = player.r.points.add(1).pow(1.5).max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect("r",22))+"x quarks,<br>"+format(upgradeEffect("r",41))+"x anti-quarks" },
        },
        23: {
            title: "Inhibitor",
            description: "Anti-quarks boost particle gain based on quarks",
            cost: new Decimal(3100),
            unlocked(){
                return true
            },
            effect() {
                let eff = player.r.points.add(1).pow(0.25).max(1).mul(player.p.points.pow(0.25)).max(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect("r",23))+"x" },
        },
        41: {
            title: "",
            description: "",
            cost: new Decimal("eeeeeeeee20"),
            unlocked(){
                return false
            },
            effect() {
                let eff = player.p.points.add(1).pow(0.33).max(1)
                return eff
            },
        },
    },

    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

    
})

addLayer("a", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: decimalZero,
    }},
    tooltip() {
      return "Achievements"
    },
    color: "#FFFF00",
    nodeStyle() {return {
        "background": "radial-gradient(#FFFF00, #d5ad83)" ,
    }},
    requires: decimalZero, // Can be a function that takes requirement increases into account
    resource: "Achievement Particles",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    achievementPopups: true,
    achievements: {
        rows: 3,
        cols: 5,
        11: {
            name: "Beginning",
            tooltip: "Create the first quark.<br>Reward: 1 AP<br>Next achievement: 500 quarks",
            done() {
                return player.p.points.gte(1)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        12: {
            name: "Expansion",
            tooltip: "Create 500 quarks.<br>Reward: 1 AP<br>Next achievement: 1 electron",
            done() {
                return player.p.total.gte(500)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        13: {
            name: "Theory of Negativity",
            tooltip: "Create an electron.<br>Reward: 1 AP<br>Next achievement: 5.000e8 quarks",
            done() {
                return player.e.total.gte(1)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        14: {
            name: "Cosmic Inflation",
            tooltip: "Create 500,000,000 quarks.<br>Reward: 1 AP<br>Next achievement: 1.000e15 particles",
            done() {
                return player.p.total.gte(5e8)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        15: {
            name: "Look at all these particle effects!",
            tooltip: "Have 1.000e15 particles.<br>Reward: 1 AP<br>Next achievement: 50,000,000 electrons",
            done() {
                return player.points.gte(1.000e15)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        21: {
            name: "Negative Aura",
            tooltip() {return "Create 50,000,000 electrons.<br>Reward: 2 AP. AP boosts quark gain.<br>Currently: "+format(tmp.a.achievements[21].effect)+"x"+"<br>Next achievement: 1.000e100 particles"},
            done() {
                return player.e.total.gte(50000000)
            },
            effect() {
                let eff = player.a.points.pow(2)
                return eff
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        22: {
            name: "Ultra HD",
            tooltip: "Have 1.000e100 particles.<br>Reward: 2 AP<br>Next achievement: 1.000e308 particles",
            done() {
                return player.points.gte(1.000e100)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        23: {
            name: "Boundless Particles",
            tooltip: "Have 1.000e308 particles.<br>Reward: 2 AP<br>Next achievement: 1 atom",
            done() {
                return player.points.gte(1e308)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        24: {
            name: "Atom and Eve",
            tooltip: "Gain 1 atom.<br>Reward: 2 AP<br>Next achievement: 1 Neutron and 1 Proton",
            done() {
                return player.t.points.gte(1)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        25: {
            name: "Now THAT's an atom!",
            tooltip: "Have a Neutron and a Proton<br>Reward: 2 AP<br>Next achievement: 50 atoms and 1.00e1308 particles",
            done() {
                return (getBuyableAmount("t",11).gte(1) && getBuyableAmount("t",12).gte(1))
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        31: {
            name: "Particle accelerator",
            tooltip: "Have 50 atoms and 1.00e1600 particles<br>Reward: 4 AP, AP reduces atom buyable costs<br>Next achievement: 1 molecule",
            done() {
                return (player.t.points.gte(50) && player.points.gte("1.00e1600"))
            },
             effect() {
                let eff = player.a.points.pow(1e5)
                return eff
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        32: {
            name: "They combine now??",
            tooltip: "Gain 1 molecule<br>Reward: 4 AP<br>Next achievement: 15 total molecules",
            done() {
                return (player.m.points.gte(1))
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        33: {
            name: "They combine now!",
            tooltip: "Gain 15 total molecules<br>Reward: 4 AP<br>Next achievement: complete first molecular challenge",
            done() {
                return (player.m.total.gte(15))
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        34: {
            name: "A new challenger approaches!",
            tooltip: "Complete a challenge<br>Reward: 4 AP<br>Next achievement: complete 3 molecular challenges",
            done() {
                return (challengeCompletions("m",11)==1)
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        35: {
            name: "C'mon, challenge me!",
            tooltip: "Complete 3 challenges<br>Reward: 4 AP<br>Next achievement: fully complete all molecular challenges",
            done() {
                return (challengeCompletions("m",11) + (challengeCompletions("m",12))) == 3
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        41: {
            name: "Too easy!",
            tooltip: "Complete all molecular challenges<br>Reward: 8 AP<br>Next achievement: fully complete all molecular challenges",
            done() {
                return (challengeCompletions("m",11) + (challengeCompletions("m",12)) + (challengeCompletions("m",21))) == 7
            },
            onComplete() {
                addPoints("a",8)
            }
        },
    },

    effect() {
        let eff = player.a.points
        eff = Decimal.pow(1.02, eff)
        return eff
    },
    effectDescription() {
        return "speeding up particle division by " + format(tmp.a.effect)
    },
    tabFormat: {
        "Achievements" :{
            content: ["main-display",
            "achievements"]
        },
        "Milestones" :{
            content: ["milestones"]
        }
    },
    milestones: {
        0: {
            requirementDescription: "5 achievement particles",
            effectDescription: "Keep Quark upgrades on Electron reset",
            done() { return player.a.points.gte(5) }
        },
        1: {
            requirementDescription: "25 achievement particles",
            effectDescription: "Keep Electron milestones on Molecule reset",
            done() { return player.a.points.gte(25) }
        },
        2: {
            requirementDescription: "50 achievement particles",
            effectDescription: "Keep Atom milestones",
            done() { return player.a.points.gte(50) }
        },
        3: {
            requirementDescription: "75 achievement particles",
            effectDescription: "Keep Molecule milestones",
            done() { return player.a.points.gte(75) }
        },
        4: {
            requirementDescription: "100 achievement particles",
            effectDescription: "Keep Cell milestones",
            done() { return player.a.points.gte(100) }
        },
        5: {
            requirementDescription: "150 achievement particles",
            effectDescription: "Keep Organism milestones",
            done() { return player.a.points.gte(150) }
        },
        6: {
            requirementDescription: "200 achievement particles",
            effectDescription: "Keep Stardust milestones",
            done() { return player.a.points.gte(200) }
        },
        7: {
            requirementDescription: "275 achievement particles",
            effectDescription: "Keep Dark Matter milestones",
            done() { return player.a.points.gte(275) }
        },
        8: {
            requirementDescription: "225 achievement particles",
            effectDescription: "Keep Sol milestones",
            done() { return player.a.points.gte(225) }
        },
        9: {
            requirementDescription: "400 achievement particles",
            effectDescription: "Keep Nebula milestones",
            done() { return player.a.points.gte(400) }
        },
        10: {
            requirementDescription: "750 achievement particles",
            effectDescription: "Keep Galaxy milestones",
            done() { return player.a.points.gte(750) }
        },
        11: {
            requirementDescription: "1308 achievement particles",
            effectDescription: "Discover a Parallel Universe...",
            done() { return player.a.points.gte(1308) }
        }
    },
})