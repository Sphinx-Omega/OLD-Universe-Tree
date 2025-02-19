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
    softcap: Decimal.pow(10,4),
    softcapPower: 0.6,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        pmult = new Decimal(1)
        if (hasUpgrade('p', 13)) pmult = pmult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) pmult = pmult.times(upgradeEffect('p', 22).div(1.5))
        if (hasUpgrade('e', 12)) pmult = pmult.times(upgradeEffect('e', 12))
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
                return player.points.add(1).pow(0.5)
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
                return player[this.layer].points.add(0.5).pow(0.05)
            },
            effectDisplay() { return format(tmp.p.upgrades[22].effect)+"x to particles base, "+format(tmp.p.upgrades[22].effect)+"x to quarks base."}, // Add formatting to the effect
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
        if (hasUpgrade('e', 13)) emult = emult.times(upgradeEffect('e', 13))
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
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
        if(player.e.best>0) keep.push(player.p.best)
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

    

    effect(){
        let eff = player.e.points.add(1).max(1)
        eff = eff.pow(2)
        if (eff.gte(Decimal.pow(10,15))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,5)).log10().pow(0.88)).mul(Decimal.pow(10,5))
        if (eff.gte(Decimal.pow(10,100))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,100)).log10().pow(0.85)).mul(Decimal.pow(10,100))
        if (eff.gte(Decimal.pow(10,1e6))) eff = eff.log10().div(1e6).pow(2e3)
        if (player.e.points.lt(1) && player.e.best.gte(1)) eff = eff.add(1)
        return eff
    },
    effectDescription() {
        let dis = "which boosts particle splitting by " + format(tmp.e.effect)
        if (tmp.e.effect.gte(Decimal.pow(10,15))) dis += " (softcapped)"
        return dis
    },
    layerShown() {
        let shown = player.p.total.gte(decimalOne)
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
                return player[this.layer].points.add(1).pow(0.15)
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
                return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
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
            tooltip: "Have 1.000e100 particles.<br>Reward: 2 AP<br>Next achievement: 1 atom",
            done() {
                return player.points.gte(1.000e100)
            },
            onComplete() {
                addPoints("a",2)
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
            effectDescription: "Keep quark upgrades",
            done() { return player.a.points.gte(5) }
        },
        1: {
            requirementDescription: "10 achievement particles",
            effectDescription: "Keep electron milestones",
            done() { return player.a.points.gte(10) }
        },
        2: {
            requirementDescription: "25 achievement particles",
            effectDescription: "Keep atom milestones",
            done() { return player.a.points.gte(25) }
        },
        3: {
            requirementDescription: "33 achievement particles",
            effectDescription: "Keep molecule milestones",
            done() { return player.a.points.gte(33) }
        },
        4: {
            requirementDescription: "50 achievement particles",
            effectDescription: "Keep cell milestones",
            done() { return player.a.points.gte(50) }
        },
        5: {
            requirementDescription: "75 achievement particles",
            effectDescription: "Keep organism milestones",
            done() { return player.a.points.gte(75) }
        },
        6: {
            requirementDescription: "100 achievement particles",
            effectDescription: "Keep stardust milestones",
            done() { return player.a.points.gte(100) }
        },
        7: {
            requirementDescription: "150 achievement particles",
            effectDescription: "Keep dark matter milestones",
            done() { return player.a.points.gte(150) }
        },
        8: {
            requirementDescription: "225 achievement particles",
            effectDescription: "Keep sol milestones",
            done() { return player.a.points.gte(225) }
        },
        9: {
            requirementDescription: "500 achievement particles",
            effectDescription: "Keep nebula milestones",
            done() { return player.a.points.gte(500) }
        },
        10: {
            requirementDescription: "1000 achievement particles",
            effectDescription: "Keep galaxy milestones",
            done() { return player.a.points.gte(1000) }
        },
        11: {
            requirementDescription: "2025 achievement particles",
            effectDescription: "Discover a parallel universe...",
            done() { return player.a.points.gte(2025) }
        }
    },
})