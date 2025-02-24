let modInfo = {
	name: "The Universe Tree",
	author: "Sphinx-Omega",
	pointsName: "particles",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 6,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "Big Bang",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Universe begins.<br>
		- Added particles.<br>
		- Added quarks.<br>
		- Added electrons.<br>
		<br><h3>v0.2</h3><br>
		- Universe expanding.<br>
		- Added atoms<br>
		- Added achievement milestones`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	let gainExp = new Decimal(1)
	gain = gain.mul(tmp.a.effect).mul(tmp.e.effect)
	if (hasUpgrade('p', 11)) gain = gain.times(2)
	if (hasUpgrade('p', 12)) gain = gain.times(2)
	if (hasUpgrade('p', 21)) gain = gain.times(upgradeEffect('p', 21))
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect('p', 22))
	if (hasUpgrade('e', 11)) gain = gain.times(upgradeEffect('e', 11))
	if (hasUpgrade('e', 21)) gain = gain.times(upgradeEffect('e', 21))
	if (hasUpgrade('m', 21)) gain = gain.mul(upgradeEffect('m', 21))
	if (inChallenge("m",21)) { gain = gain.log10().pow(0.2)
		if(hasUpgrade("r",13)) gain = gain.mul(upgradeEffect("r",13))
		if(hasUpgrade("r",23)) gain = gain.mul(upgradeEffect("r",23))
		if(hasUpgrade("m",41)) gainExp 
	}
	if(hasUpgrade("m",23)) gainExp = gainExp.mul(upgradeEffect("m",23))
	if(hasUpgrade("m",41)) gainExp = gainExp.add(upgradeEffect("m",41))
	return gain.pow(gainExp)

}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	lastSave: new Date().getTime(),
	ms: 50,
	options:false,
    notation:'Scientific',
}}

function convertToB16(n){
    let codes = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "A",
            11: "B",
            12: "C",
            13: "D",
            14: "E",
            15: "F",
    }
    let x = n % 16
    return codes[(n-x)/16] + codes[x]
}
function getUndulatingColor(period = Math.sqrt(760)){
        let t = new Date().getTime()
        let a = Math.sin(t / 1e3 / period * 2 * Math.PI + 0) 
        let b = Math.sin(t / 1e3 / period * 2 * Math.PI + 2)
        let c = Math.sin(t / 1e3 / period * 2 * Math.PI + 4)
        a = convertToB16(Math.floor(a*128) + 128)
        b = convertToB16(Math.floor(b*128) + 128)
        c = convertToB16(Math.floor(c*128) + 128)
        return "#"+String(a) + String(b) + String(c)
}

// Display extra things at the top of the page
var displayThings = [
    function(){
        //let x = getUndulatingColor()
		let a = "Current endgame: "+format("e1e6e6")+" particles (v0.2)"
		let b = inChallenge("m",21)?"<br>'Undiscovered' progress: " + format(player.points.max(1).log10().pow(0.64953))
        +"%":""
		return a + b + (options.autosave ? "" : ". Warning: autosave is off")
	},
	function(){
        let d = isEndgame()?makeBlue("<br>You are past endgame,<br>and the game might not be balanced here."):""
		return d
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1e6e6"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}