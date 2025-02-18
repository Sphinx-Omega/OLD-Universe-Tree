var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

   // treeLayout: ""

    
}

addNode("p", {
    symbol: "Q",
    color: '#737373',
    layerShown: true,
    canClick() {return player.points.gte(10)},
    onClick() {player.points = player.points.div(2)
    console.log(this.layer)}

}, 
)


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})