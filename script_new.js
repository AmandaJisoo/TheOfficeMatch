"use strict";
class AudioController {
    constructor() {
        this.bgMusic = new Audio('bgMusic/office.mp3');
        this.bgMusic.volume = 0.3;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
}
this.audioController = new AudioController();
let state = {gameOnGoing: false, winning:false, timer: null};
const SIZE_SMALL = 4;        
const SIZE_MEDIUM = 6;    
const SIZE_BIG = 8; 
let isBeingPlayed = false;  
let winOrLose = false;
let timerId = null;
let rowSize = -1;
let colSize = -1;
let gameTimeLimit = -1;
let currentScore = 0;
let totalLength = -1;
let cards = [
    '1.jpg', 
    '2.jpg', 
    '3.jpg',
    '4.jpg',
    '5.gif', 
    '6.webp',
    '7.jpg',
    '8.jpg',
    '9.jpg',
    '10.jpg',
    '11.jpg',
    '12.jpg',
    '13.gif',
    '14.jpg',
    '15.jpg',
    '16.jpg',
];

//the card that has been chosen according to the input choice
let chosenCards = [];
let matched = [];
let clickedToCheck = [];
$(".game-board").hide();
$(".start-btn").on("click", handleStartClick);
$(".size").on("click", sizeCallBack);
$(".restart-btn").on("click", restart);
$(".home-button").on("click",homeBunHandle);

function homeBunHandle() {
    $(".introduction").show();
    gameOver(timerId);
    $(".statement").hide();
    $(".restart-btn").hide();
    $(".home-button").hide();
    $(".start-btn").show();
    $(".size").hide();    

}
//start the game
function handleStartClick() {
    if (isBeingPlayed) {
        gameOver(timerId);
        currentScore = 0;
        isBeingPlayed = true;
        winOrLose  = false;
    }
    $(".home-button").show();
    $(".lost-statement").hide();
    $(".introduction").hide();
    cards = _.shuffle(cards);
    $(".start-btn").hide();
    $(".size").show();
}

function sizeAndTimeSet(event) {
    if (event.target.id === "levelOne") {
        console.log(event.target.id);
        rowSize = SIZE_SMALL;
        colSize = SIZE_SMALL;
        gameTimeLimit = 50;
    } else if (event.target.id === "levelTwo") {
        rowSize = SIZE_MEDIUM;
        colSize = SIZE_MEDIUM;
        gameTimeLimit = 120;
    } else if (event.target.id === "levelThree") {
        rowSize =SIZE_BIG;
        colSize =SIZE_BIG;
        gameTimeLimit = 140;
    }
    totalLength = rowSize * 2;
}

//the size button hasbeen clicked and append the items
function sizeCallBack(event) {
    $(".home-button").show();
    gameBoadPrep(event);
    playGameHandler(event);
    $(".personal-info").show();
    $(".size").hide();
    $(".restart-btn").show();
    audioController.startMusic();
}

function gameBoadPrep(event) {
    sizeAndTimeSet(event);
    for (let i= 0; i < rowSize; i++) {
        let value = cards[i];
        chosenCards.push(value);
        chosenCards.push(value);
    }
    //randomly mix the chosen cards
    chosenCards = _.shuffle(chosenCards);
    let cardLength = chosenCards.length;
    //populate the board using the array of mixed order chosen card

    $(".game-board").css("grid-template-columns", "repeat(" + 4 + ", auto)");
    while (!jQuery.isEmptyObject(chosenCards)) {
        let chosenPic = chosenCards.pop();
        let card = $("<div class=card></div>");
        card.append("<div class='card-face hidden' id=" + chosenPic + "><img src=img/" + chosenPic + " /></div>");
        card.append("<div class='card-back' id=backImg><img src=img/backImg.jpg></div>");
        $(".game-board").append(card);
    } 

    $(".card").on("click", function(event) {
        if (!matched.includes(this)) {
            clickedToCheck.push(this);
            toggleItem(this);
            if (clickedToCheck.length == 2) {
                let isMatched = isMatchId();
                if (isMatched) {
                    matched.push(clickedToCheck[0]);
                    matched.push(clickedToCheck[1]);
                    clickedToCheck = [];
                    currentScore++;
                    if (matched.length === totalLength) {
                        winOrLose = true;
                        gameOver(timerId);
                        $(".wining-statement").css("display", "inline");
                    }
                    //update score
                    $(".score").html("Score:   " + currentScore);
                } else {
                    setTimeout(() => { 
                        console.log("time");
                        toggleItem(clickedToCheck[0]);
                        toggleItem(clickedToCheck[1]);
                        clickedToCheck = [];
                    }, 400);
                }        
            }
        }
    }); 
}

function toggleItem(element) {
    $(element).children('.card-back').toggle("hide");   
    $(element).children('.card-face').toggle("hide");  
}

function isMatchId() {// index[0] == index[1]
    return ($(clickedToCheck[0]).children('.card-face')[0].id === $(clickedToCheck[1]).children('.card-face')[0].id &&
    $(clickedToCheck[0]).children('.card-face')[0] != $(clickedToCheck[1]).children('.card-face')[0]);  
}

//must be length 2 to be called
//maybe have a eay to make as an event?

//noe display the finalized board
function playGameHandler(event) {
    // $(".score").
    $(".score").show();
    startCountDown();
    $(".game-board").show(); 
}

function startCountDown() {
    $(".remaining-time").show();
    $(".remaining-time").text("Timer:    " + gameTimeLimit);
    // $(".remaining-time").html("Timer:   " + gameTimeLimit);
    timerId = setInterval(() => {
        gameTimeLimit--;
        $(".remaining-time").html("Timer:   " + gameTimeLimit);
        if(gameTimeLimit === 0) {
            isBeingPlayed = false;
            gameOver(timerId);     
        }
    }, 1000);
}

function restart() {
    hideInfo();
    isBeingPlayed = true;
    $(".statement").hide();
    handleStartClick();
    $(".restart-btn").hide();
}

function hideInfo() {
    clearInterval(timerId);
    $(".game-board").empty();
    $(".personal-info").hide();
    $(".game-board").hide();
    $(".remaining-time").hide();
    $(".lost-statement").hide();
    matched = [];
}

function gameOver(timer) {
    audioController.stopMusic();
    clearInterval(timer);
    $(".score").html("Score:   0");
    hideInfo(timer);
    if (winOrLose) {
        $(".wining-statement").show();
    } else {
        $(".lost-statement").show();
    }
    $(".score").hide();
}





