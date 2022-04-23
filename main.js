// The game data
var gameData = {
    version: 0.13,
    tickPeriod: 5000,
    lastTick: Date.now(),
    scritches: 0,
    scritchesPerTick: 0,
    autoscritchers: 0,
    autoscritcherBaseCost: 100,
    nextAutoCost: 100,
    catnip: 0,
    catnipBaseCost: 1000,
    nextCatnipCost: 1000,
    scritchClicks: 0,
    achievements: 0
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
        if (typeof savegame.scritchesPerTick !== "undefined") {gameData.scritchesPerTick = savegame.scritchesPerTick};
        if (typeof savegame.autoscritchers !== "undefined") {gameData.autoscritchers = savegame.autoscritchers};
        if (typeof savegame.autoscritcherBaseCost !== "undefined") {gameData.autoscritcherBaseCost = savegame.autoscritcherBaseCost};
        if (typeof savegame.nextAutoCost !== "undefined") {gameData.nextAutoCost = savegame.nextAutoCost};
        if (typeof savegame.catnip !== "undefined") {gameData.catnip = savegame.catnip};
        if (typeof savegame.catnipBaseCost !== "undefined") {gameData.catnipBaseCost = savegame.catnipBaseCost};
        if (typeof savegame.nextCatnipCost !== "undefined") {gameData.nextCatnipCost = savegame.nextCatnipCost};
        if (typeof savegame.scritchClicks !== "undefined") {gameData.scritchClicks = savegame.scritchClicks};
        if (typeof savegame.achievements !== "undefined") {gameData.achievements = savegame.achievements};
        refresh();
    }
}

// reset game
function resetGame() {
    localStorage.removeItem("idleCatsSave");
    gameData.tickPeriod = 5000;
    gameData.scritches =  0;
    gameData.scritchesPerTick = 1;
    gameData.autoscritchers = 0;
    gameData.nextAutoCost = 100;
    gameData.catnip = 0;
    gameData.nextCatnipCost = 1000;
    gameData.scritchClicks = 0;
    gameData.achievements = 0;
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
    document.getElementById("achievementsMenu").style.display = "none"
    document.getElementById("catsMenu").style.display = "none"
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
    update("autoscritchers",format(gameData.autoscritchers));
    gameData.nextAutoCost = Math.floor(gameData.autoscritcherBaseCost * (1.1 ** gameData.autoscritchers));
    update("autoscritcherCost",format(gameData.nextAutoCost));
    update("catnip",format(gameData.catnip));
    var nextCatnipCost = Math.floor(10 * Math.pow(1.1,catnip));
    update("catnipCost",format(gameData.nextCatnipCost));
    scritchRate();
    update("scritchesPerTick",format(gameData.scritchesPerTick));
    update("scritchclicks",gameData.scritchClicks);
}

// Scritch section
//
// Click the scritch button
function scritchClick(number){
    gameData.scritches += number;
    gameData.scritchClicks += 1;
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
        scritchRate();
        update ("scritchesPerTick",format(gameData.scritchesPerTick));
    };
    gameData.nextAutoCost = Math.floor(gameData.autoscritcherBaseCost * Math.pow(1.1,gameData.autoscritchers));          //works out the cost of the next autoscritcher
    document.getElementById('autoscritcherCost').innerHTML = format(gameData.nextAutoCost);                                          //updates the autoscritcher cost for the player
    evaluate();
};

// Buy catnip
function buyCatnip(){
    gameData.nextCatnipCost = Math.floor(gameData.catnipBaseCost * (100 ** gameData.catnip));     //works out the cost of this catnip
    if(gameData.scritches >= gameData.nextCatnipCost){                                   //checks that the player can afford the catnip
        gameData.catnip += 1;                                   //increases number of catnip
    	gameData.scritches -= gameData.nextCatnipCost;                          //removes the scritches spent
        update ("catnip",format(gameData.catnip));  //updates the number of catnip for the user
        update ("scritches",format(gameData.scritches));  //updates the number of scritches for the user
        scritchRate();
        update ("scritchesPerTick",format(gameData.scritchesPerTick));
    };
    gameData.nextCatnipCost = Math.floor(gameData.catnipBaseCost * (100 ** gameData.catnip));       //works out the cost of the next catnip
    update("catnipCost",format(gameData.nextCatnipCost));  //updates the catnip cost for the user
    evaluate();
};

// Calculate scritch rate
function scritchRate() {
    gameData.scritchesPerTick = ((gameData.autoscritchers) ** (1 + (gameData.catnip/10)));
}
// Evaluate stuff
// e.g. to notify when an option is visible or available
function evaluate() {
    if (gameData.scritches >= 10){ document.getElementById("autos").setAttribute("style", "") };
    if (gameData.autoscritchers >= 1){ document.getElementById("ticker").setAttribute("style", "") };
    if (gameData.scritches >= 100){ document.getElementById("catnipdisplay").setAttribute("style", ""); };
    if (gameData.scritches >= gameData.nextAutoCost){
        if ( document.getElementById("auto-btn").classList.contains('available')){} else document.getElementById("auto-btn").classList.add('available')}
        else if (document.getElementById("auto-btn").classList.contains('available')){document.getElementById("auto-btn").classList.remove('available')}
}

// Check achievements
function achievedCheck() {
    gameData.achievements = 0;
    if (gameData.scritchClicks >=100) {
        if ( document.getElementById("clickAch01").classList.contains('achieved')){    
        } else
        document.getElementById("clickAch01").classList.add('achieved');
        gameData.achievements += 1;
        update("achievementsTotal",gameData.achievements);
    };
}
//Progress bar
function move() {
    var elem = document.getElementById("tickBar");   
    var width = 1;
    var timing = gameData.tickPeriod/100;
    var id = setInterval(frame, timing);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
  }

// The main game loop
window.setInterval(function(){
    diff = Date.now() - gameData.lastTick;  // Allows for off-line earning
    gameData.lastTick = Date.now()          // Don't forget to update lastTick
    scritchRate();
    gameData.scritches += gameData.scritchesPerTick * (diff / gameData.tickPeriod) // divide diff by how often (ms) mainGameLoop is ran
	//scritchClick(gameData.autoscritchers + gameData.catnip);
    move();
    update("scritches",format(gameData.scritches));
    update ("autoscritchers",format(gameData.autoscritchers));
    update("autoscritcherCost",format(gameData.nextAutoCost));
    update ("catnip",format(gameData.catnip));
    update("catnipCost",format(gameData.nextCatnipCost));
    update("tickPeriod",format(gameData.tickPeriod));
	console.log(gameData.scritches + " scritches");
    evaluate();
}, gameData.tickPeriod);