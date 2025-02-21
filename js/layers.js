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
                if(hasUpgrade("t",21)) eff = eff.mul(upgradeEffect("t",21))
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
                return player[this.layer].points.add(1).pow(0.75)
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
                return player[this.layer].points.add(0.3).pow(0.05)
            },
            effectDisplay() { return format(tmp.p.upgrades[22].effect)+"x to particles base, "+format(tmp.p.upgrades[22].effect)+"x to quarks base."}, // Add formatting to the effect
        },
        23: {
            title: "Limit Breaker",
            description: "Quarks defy the known laws of physics to split impossibly fast!",
            cost: new Decimal(1e60),
            unlocked(){
                return (hasMilestone('e',1))
            },

            effect() {
                return player[this.layer].points.add(1).pow(0.05)
            },
            effectDisplay() { return format(tmp.p.upgrades[23].effect)+"x"}, // Add formatting to the effect
        },
        31: {
            title: "Particle Collider",
            description: "Particles weaken electron softcap",
            cost: new Decimal("1.00e1220"),
            unlocked(){
                return (hasMilestone('e',2))
            },

            effect() {
                return player.points.add(1).max(1).log10()
            },
            effectDisplay() { return format(tmp.p.upgrades[31].effect)+"x"}, // Add formatting to the effect
        },
        32: {
            title: "Positive energy",
            description: "Quarks boost atom buyables amount",
            cost: new Decimal("1.00e2580"),
            unlocked(){
                return (hasMilestone('e',2))
            },

            effect() {
                return player.p.points.add(1).max(1).log10().div(1e3)
            },
            effectDisplay() { return format(tmp.p.upgrades[32].effect)+"x"}, // Add formatting to the effect
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
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
})



addLayer("e", {
    name: "electrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#0066ff",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "electrons", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
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
        unlocked() {return player.e.best.gte(1)}}
    ],
    layerShown(){return player.p.best.gte(100000)},
    doReset(resettingLayer){
        if (layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        if (player.e.best>0) keep.push(player.p.best)
        if (hasMilestone("a",1)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        
    },

    

    effect(){
        let eff = player.e.points.add(1).max(1)
        eff = eff.pow(2)
        if (eff.gte(Decimal.pow(10,16))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,5)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(Decimal.pow(10,1e6))) eff = eff.log10().div(1e6).pow(2e3)
        if (hasUpgrade("t", 11)){
            eff = eff.mul(upgradeEffect('t',11).add(1).log10())}
        if (hasUpgrade("p", 31)){
                eff = eff.mul(upgradeEffect('p',31).mul(1e7).add(1).max(1))}
        if (player.e.points.lt(1) && player.e.best.gte(1)) eff = eff.add(1)
        return eff
    },
    effectDescription() {
        let dis = "which boosts particle splitting by " + format(tmp.e.effect)
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
                return player[this.layer].points.add(2).pow(0.5)
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
            requirementDescription: "1e365 total electrons",
            effectDescription: "Unlock 3 more quark upgrades",
            done() { return player.e.total.gte("1.00e365") },
            unlocked() {
                return hasUpgrade("t",23)
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
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "atoms", // Name of prestige currency
    baseResource: "electrons", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1.3),
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
        unlocked() {return player.t.best.gte(1)}}
    ],
    layerShown(){return player.e.best.gte(1e15)},
    canBuyMax() { return hasMilestone("t", 2)},
    doReset(resettingLayer){
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        if(player.t.best>0) keep.push(player.e.best)
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
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
        let eff = player.t.points.add(1).max(1).pow(1.75)
        if(getBuyableAmount("t", 11).gte(1)){
        eff = eff.mul(getBuyableAmount("t", 11).mul(tmp.t.buyables[11].effect).mul(5).add(1))}
        if(getBuyableAmount("t", 12).gte(1)){
        eff = eff.pow(getBuyableAmount("t", 12).add(player.t.buyables[12].effect))}
        if (eff.gte(Decimal.pow(10,15))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,5)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(Decimal.pow(10,100))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,100)).log10().pow(0.85)).mul(Decimal.pow(10,100))
        if (eff.gte(Decimal.pow(10,1e6))) eff = eff.log10().div(1e6).pow(2e3)
        if (player.t.points.lt(1) && player.t.best.gte(1) && getBuyableAmount("t", 11).lt(1)) eff = eff.add(1)
        return eff
    },
    effectDescription() {
        let dis = "which boosts electron vibration by " + format(tmp.t.effect)
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
            effectDisplay() { return "<br>Neutrons: +"+formatWhole(upgradeEffect(this.layer, this.id))+"<br>Protons +"+formatWhole(upgradeEffect(this.layer, this.id).pow(0.4))}
        },
        23: {
            title: "Superatomic",
            description: "Atoms boost neutron buyable effect",
            cost: new Decimal(40),
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
                    bonus = formatWhole(upgradeEffect("t",22).pow(0.4))}
                if(getBuyableAmount("t", 12).gte(1)){
                extra = formatWhole(x)}
                if(hasUpgrade("t",22)) bonusDis = "(+"+bonus+")"
                let dis = "Increase Atom effect exponent<br>(based on electrons)"
                return dis + ".\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
                Effect: +" + format(0.2)+"\n\
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
                let eff = new Decimal(0.2)
                if (hasUpgrade("t",22))eff = eff.add(upgradeEffect("t",22).pow(0.4))
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
            requirementDescription: "15 achievement particles",
            effectDescription: "Keep Electron milestones on Molecule reset",
            done() { return player.a.points.gte(15) }
        },
        2: {
            requirementDescription: "25 achievement particles",
            effectDescription: "Keep Atom milestones",
            done() { return player.a.points.gte(25) }
        },
        3: {
            requirementDescription: "33 achievement particles",
            effectDescription: "Keep Molecule milestones",
            done() { return player.a.points.gte(33) }
        },
        4: {
            requirementDescription: "50 achievement particles",
            effectDescription: "Keep Cell milestones",
            done() { return player.a.points.gte(50) }
        },
        5: {
            requirementDescription: "75 achievement particles",
            effectDescription: "Keep Organism milestones",
            done() { return player.a.points.gte(75) }
        },
        6: {
            requirementDescription: "100 achievement particles",
            effectDescription: "Keep Stardust milestones",
            done() { return player.a.points.gte(100) }
        },
        7: {
            requirementDescription: "150 achievement particles",
            effectDescription: "Keep Dark Matter milestones",
            done() { return player.a.points.gte(150) }
        },
        8: {
            requirementDescription: "225 achievement particles",
            effectDescription: "Keep Sol milestones",
            done() { return player.a.points.gte(225) }
        },
        9: {
            requirementDescription: "500 achievement particles",
            effectDescription: "Keep Nebula milestones",
            done() { return player.a.points.gte(500) }
        },
        10: {
            requirementDescription: "1000 achievement particles",
            effectDescription: "Keep Galaxy milestones",
            done() { return player.a.points.gte(1000) }
        },
        11: {
            requirementDescription: "2025 achievement particles",
            effectDescription: "Discover a Parallel Universe...",
            done() { return player.a.points.gte(2025) }
        }
    },
})