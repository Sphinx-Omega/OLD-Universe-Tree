addLayer("qu", {
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
    // nodeStyle() {return {
    //     "background": ((inChallenge("m",21) && hasMilestone("m",7))?"radial-gradient(rgb(78, 78, 78),rgb(255, 255, 255))": "radial-gradient( #737373,#737373)"),
    //     color: ((inChallenge("m",21) && hasMilestone("m",7))?"rgb(255, 233, 34)":"rgb(61, 61, 61)"),
    // }},
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "quarks", // Name of prestige currency
    baseResource: "particles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    //exponent: 0.5, // Prestige currency exponent
    // gainMult() { // Calculate the multiplier for main currency from bonuses
    //     pmult = new Decimal(1)
    //     if (hasUpgrade('p', 13)) pmult = pmult.times(upgradeEffect('p', 13))
    //     if (hasUpgrade('p', 22)) pmult = pmult.times(upgradeEffect('p', 22).div(1.5))
    //     if (hasUpgrade('e', 12)) pmult = pmult.times(upgradeEffect('e', 12))
    //     if (hasUpgrade('e', 22)) pmult = pmult.times(upgradeEffect('e', 22))
    //     if (hasAchievement("a", 21)) pmult = pmult.mul(tmp.a.effect)
    //     if (inChallenge("m",21)) pmult = pmult.pow(0.75).mul(tmp.r.effect)
    //     return pmult
    // },
    // gainExp() { // Calculate the exponent on main currency from bonuses
    //     return new Decimal(1)
    // },
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
    },

    // passiveGeneration(){
    //     let passive = new Decimal(0)
    //     if (hasMilestone('e', 0)) passive = passive.add(1) //100% Prestige Points depending on Reset
    //     return passive
    //     },

    // doReset(resettingLayer) {
    //     let keep = []
    //     if (hasMilestone("a", 0) && resettingLayer == "e") keep.push("upgrades")
    //     if (hasMilestone("t", 0) && resettingLayer == "t") keep.push("upgrades")
    //     if (resettingLayer == "m" && !hasMilestone("m",0)) player.p.upgrades = player.p.upgrades.filter(x=>x<0)    
    //     if (hasMilestone("m", 0) && resettingLayer == "m") {
    //         if (hasMilestone("m", 1) && resettingLayer == "m") {
    //             if (hasMilestone("m", 2) && resettingLayer == "m") player.p.upgrades = player.p.upgrades.filter(x=>x<9)
    //             else player.p.upgrades = player.p.upgrades.filter(x=>x<6)}
    //         else player.p.upgrades = player.p.upgrades.filter(x=>x<5)}
    //     if (layers[resettingLayer].row > this.row) {layerDataReset(this.layer, keep)}
    // },
})