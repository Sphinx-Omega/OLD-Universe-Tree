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
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 22).div(1.5))
        return mult
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
                return player.p.points.gte(1)
            }
        },

        12: {
            title: "Unstable",
            description: "Split particles split in half again, making twice as many particles.",
            cost: new Decimal(5),
            unlocked(){
                return hasUpgrade('p', 11)
            },
        },

        13: {
            title: "Fusion",
            description: "Some particles clump together into quarks. Quark gain is based on particles.",
            cost: new Decimal(15),
            unlocked(){
                return hasUpgrade('p', 12)
            },

            effect() {
                return player.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },

        21: {
            title: "Supercharged",
            description: "Particle gain is increased based on quarks.",
            cost: new Decimal(100),
            unlocked(){
                return hasUpgrade('p', 13)
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
                return hasUpgrade('p', 21)
            },

            effect() {
                return player[this.layer].points.add(0.5).pow(0.05),
                player.points.add(0.5).pow(0.02)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"}, // Add formatting to the effect
        },
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
    branches: ["p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e",
        description: "E: Electron reset",
        onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked() {return player.e.points.gte(1)}}
    ],
    layerShown(){return player.p.best.gte(100000)},
    doReset(resettingLayer){
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        if (hasMilestone("a", 1) && resettingLayer=="e") keep.push("upgrades")
        if(player.e.best>0) keep.push(player.p.best)
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

    

    // effect(){
    //     let eff = player.e.points.add(1).max(1)
    //     eff = eff.pow(2)
    //     if (eff.gte(Decimal.pow(10,1e16))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e16)).log10().pow(0.88)).mul(Decimal.pow(10,1e16))
    //     if (eff.gte(Decimal.pow(10,1e32))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e32)).log10().pow(0.85)).mul(Decimal.pow(10,1e32))
    //     if (eff.gte(Decimal.pow(10,1e63))) eff = eff.log10().div(1e13).pow(2e61)
    //     return eff
    // },
    // effectDescription() {
    //     let dis = "which boosts particle splitting by "+layerText("h2", "e", format(tmp.e.effect))
    //     if (tmp.e.effect.gte(Decimal.pow(10,1e16))) dis += " (softcapped)"
    //     return dis
    // },
    layerShown() {
        let shown = player.p.total.gte(decimalOne)
        if(player.e.unlocked) shown = true
        return shown
    },

    upgrades: {
        11: {
            title: "Charge",
            description: "Negative charge of electrons causes faster particle division.",
            cost: new Decimal(10),

            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },
})

addLayer("a", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
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
        11: {
            name: "Beginning",
            tooltip: "Create the first quark.\nNext achievement: 500 quarks",
            done() {
                return player.p.points.gte(1)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        12: {
            name: "Expansion",
            tooltip: "Create 500 quarks.\nNext achievement: 1 electron",
            done() {
                return player.p.total.gte(500)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        13: {
            name: "Theory of Negativity",
            tooltip: "Create an electron.\nNext achievement: 5.000e8 quarks",
            done() {
                return player.e.total.gte(1)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        14: {
            name: "Cosmic Inflation",
            tooltip: "Create 500,000,000 quarks.\nNext achievement: 1.000e15 particles",
            done() {
                return player.e.total.gte(1)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        15: {
            name: "Look at all these particle effects!",
            tooltip: "Have 1.000e15 particles",
            done() {
                return player.points.gte(1.000e15)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
    },
    midsection: ["grid", "blank"],
    grid: {
        getStartData(id) {
            return id
        },
        getUnlocked(id) { // Default
            return true
        },
        getStyle(data, id) {
            return {'background-color': '#'+ (data*1234%999999)}
        },
        getTitle(data, id) {
            return "Gridable #" + id
        },
        getDisplay(data, id) {
            return data
        },
    },


    effect() {
        let eff = player.a.points
        eff = Decimal.pow(1.02, eff)
        return eff
    },
    effectDescription() {
        return ",speeding up particle division by " + format(tmp.a.effect)
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
            requirementDescription: "5 achievements",
            effectDescription: "Keep quarks and their upgrades",
            done() { return player.a.points.gte(5) }
        },
        1: {
            requirementDescription: "10 achievements",
            effectDescription: "Keep electrons and atoms (and their upgrades and milestones)",
            done() { return player.a.points.gte(10) }
        },
        2: {
            requirementDescription: "20 achievements",
            effectDescription: "Keep molecules and cells (and their upgrades and milestones) and keep molecular challenge completions",
            done() { return player.a.points.gte(20) }
        },
        3: {
            requirementDescription: "30 achievements",
            effectDescription: "Keep organisms (and their upgrades and milestones) and keep cellular and organic challenge completions",
            done() { return player.a.points.gte(30) }
        },
        4: {
            requirementDescription: "40 achievements",
            effectDescription: "Keep stardust and dark matter (and their upgrades and milestones)",
            done() { return player.a.points.gte(40) }
        },
        5: {
            requirementDescription: "50 achievements",
            effectDescription: "Keep sols and nebulae (and their upgrades and milestones) and keep nonexistent challenge completions",
            done() { return player.a.points.gte(50) }
        }
    },
})