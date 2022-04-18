// The game data
var gameData = {
    version: 0.11,
    tickPeriod: 5000,
    lastTick: Date.now(),
    scritches: 0,
    autoscritchers: 0,
    autoscritcherBaseCost: 100,
    nextAutoCost: 100,
    catnip: 0,
    catnipBaseCost: 1000000,
    nextCatnipCost: 1000000
}

// save game loop
var saveGameLoop = window.setInterval(function() {
    saveGame()
    }, 15000)

// save game function
function saveGame() {
    localStorage.setItem("idleCatsSave", JSON.stringify(gameData));
}
// load game data
var savegame = JSON.parse(localStorage.getItem("idleCatsSave"))
if (savegame !== null) {
    if (savegame.version == gameData.version) {
        gameData = savegame;
        refresh();
    } 
    else {
        // if the savegame is a different version, update the variables that are already there
        //if (typeof savegame.version !== "undefined") {gameData.version = savegame.version};
        if (typeof savegame.tickPeriod !== "undefined") {gameData.tickPeriod = savegame.tickPeriod};
        if (typeof savegame.lastTick !== "undefined") {gameData.lastTick = savegame.lastTick};
        if (typeof savegame.scritches !== "undefined") {gameData.scritches = savegame.scritches};
        if (typeof savegame.autoscritchers !== "undefined") {gameData.autoscritchers = savegame.autoscritchers};
        if (typeof savegame.autoscritcherBaseCost !== "undefined") {gameData.autoscritcherBaseCost = savegame.autoscritcherBaseCost};
        if (typeof savegame.nextAutoCost !== "undefined") {gameData.nextAutoCost = savegame.nextAutoCost};
        if (typeof savegame.catnip !== "undefined") {gameData.catnip = savegame.catnip};
        if (typeof savegame.catnipBaseCost !== "undefined") {gameData.catnipBaseCost = savegame.catnipBaseCost};
        if (typeof savegame.nextCatnipCost !== "undefined") {gameData.nextCatnipCost = savegame.nextCatnipCost};
        refresh();
    }
}

// reset game
function resetGame() {
    localStorage.removeItem("idleCatsSave")
}

// Update a specific id with content
function update(id, content) {
    document.getElementById(id).innerHTML = content;
  }

// 'page' selection
function tab(tab) {
    // hide all your tabs, then show the one the user selected.
    document.getElementById("scritchMenu").style.display = "none"
    document.getElementById("saveMenu").style.display = "none"
    document.getElementById(tab).style.display = "inline"
  }
// go to a tab for the first time, so not all show
tab("scritchMenu");

// Number formatting for display
function format(number) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / (10 ** exponent)
	if (exponent < 3) return number.toFixed(0)
	return mantissa.toFixed(2) + "e" + exponent //eg, 1,546 -> 1.54e3
}

// Refresh data in spans
function refresh() {
    update("scritches",format(gameData.scritches));
    update("autoscritchers",format(gameData.autoscritchers))
    gameData.nextAutoCost = Math.floor(gameData.autoscritcherBaseCost * (1.1 ** gameData.autoscritchers));
    update("autoscritcherCost",format(gameData.nextAutoCost));
    update("catnip",format(gameData.catnip));
    var nextCatnipCost = Math.floor(10 * Math.pow(1.1,catnip));
    update("catnipCost",format(nextCatnipCost));
}

// Scritch section
//
// Click the scritch button
function scritchClick(number){
    gameData.scritches += number;
    update("scritches",format(gameData.scritches));
    evaluate();
};

// Buy an auto-scritcher
function buyAutoscritcher(){
    gameData.nextAutoCost = Math.floor(gameData.autoscritcherBaseCost * (1.1 ** gameData.autoscritchers));     //works out the cost of this autoscritcher
    if(gameData.scritches >= gameData.nextAutoCost){                                                                    //checks that the player can afford the autoscritcher
        gameData.autoscritchers += 1;                                                                               //increases number of autoscritchers
    	gameData.scritches -= gameData.nextAutoCost;                                                                    //removes the scritches spent
        update ("autoscritchers",format(gameData.autoscritchers));                              //updates the number of autoscritchers for the player
        update ("scritches",format(gameData.scritches));                                        //updates the number of scritches for the player
    };
    gameData.nextAutoCost = Math.floor(gameData.autoscritcherBaseCost * Math.pow(1.1,gameData.autoscritchers));          //works out the cost of the next autoscritcher
    document.getElementById('autoscritcherCost').innerHTML = format(gameData.nextAutoCost);                                          //updates the autoscritcher cost for the player
    evaluate();
};

// Buy catnip
function buyCatnip(){
    gameData.nextCatnipCost = Math.floor(gameData.catnipBaseCost * (1.1 ** gameData.catnip));     //works out the cost of this catnip
    if(gameData.scritches >= gameData.nextCatnipCost){                                   //checks that the player can afford the catnip
        gameData.catnip += 1;                                   //increases number of catnip
    	gameData.scritches -= gameData.nextCatnipCost;                          //removes the scritches spent
        update ("catnip",format(gameData.catnip));  //updates the number of catnip for the user
        update ("scritches",format(gameData.scritches));  //updates the number of scritches for the user
    };
    gameData.nextCatnipCost = Math.floor(gameData.catnipBaseCost * (1.1 ** gameData.catnip));       //works out the cost of the next catnip
    update("catnipCost",format(gameData.nextCatnipCost));  //updates the catnip cost for the user
    evaluate();
};

// Evaluate stuff
// e.g. to notify when an option is available
function evaluate() {
    if (gameData.scritches >= 10){ document.getElementById("autos").setAttribute("style", "") };
    if (gameData.scritches >= 100){ document.getElementById("catnipdisplay").setAttribute("style", ""); };
    if (gameData.scritches >= gameData.nextAutoCost){
        if ( document.getElementById("auto-btn").classList.contains('available')){} else document.getElementById("auto-btn").classList.add('available')}
        else if (document.getElementById("auto-btn").classList.contains('available')){document.getElementById("auto-btn").classList.remove('available')}
}
// The main game loop
window.setInterval(function(){
    diff = Date.now() - gameData.lastTick;  // Allows for off-line earning
    gameData.lastTick = Date.now()          // Don't forget to update lastTick
    gameData.scritches += (gameData.autoscritchers ** (1 + gameData.catnip)) * (diff / gameData.tickPeriod) // divide diff by how often (ms) mainGameLoop is ran
	//scritchClick(gameData.autoscritchers + gameData.catnip);
    update("scritches",format(gameData.scritches));
    update ("autoscritchers",format(gameData.autoscritchers));
    update("autoscritcherCost",format(gameData.nextAutoCost));
    update ("catnip",format(gameData.catnip));
    update("catnipCost",format(gameData.nextCatnipCost));
	console.log(gameData.scritches + " scritches");
    evaluate();
}, gameData.tickPeriod);