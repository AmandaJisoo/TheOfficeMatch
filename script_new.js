"use strict"
// TODO: Implement state <3
//TODO: reset score and do stateA
// set grid number based on the user choice.
let state = {gameOnGoing: false, winning:false, timer: null};
const SIZE_SMALL = 4;        
const SIZE_MEDIUM = 6;    
const SIZE_BIG = 8; 
let isBeingPlayed = false;  
let winOrLose = false;
let timerId = null;
let rowSize = -1;// set default value as small
let colSize = -1;
let gameTimeLimit = -1;
let currentScore = 0;
let totalLength = -1;
let cards = [
    '1.jpg', 
    '2.jpg', 
    '3.jpg',
    '4.jpg',
    '5.jpg', 
    '6.jpg',
    '7.jpg',
    '8.gif',
    '9.jpg',
    '10.png',
    '11.jpg',
    '12.jpg',
    '13.jpg',
    '14.jpg',
    '15.jpg',
    '16.jpg',
];

//the card that has been chosen according to the input choice
let chosenCards = [];
let matched = [];
let clickedToCheck = [];
$(".game-board").hide();// doesn't show at first
$(".start-btn").on("click", handleStartClick);//start press then level
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
        gameTimeLimit = 60;
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
}

function gameBoadPrep(event) {
    sizeAndTimeSet(event);
    //move the selected number of items to the array
    //put two cpies of pne image @ time
    for (let i= 0; i < rowSize; i++) {
        let value = cards[i];
        chosenCards.push(value);
        chosenCards.push(value);
    }
    console.log(rowSize);
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
        //give listener to all cards
    } 
    $(".card").on("click", function(event) {
        console.log("cliked?");
        //condition: entering length is always 0, 1, 2
        // is the item the same item?
        //they are not the same item by this time
        // then check canBeFliped 
        // if canBeFliped -> toggleItem(this)
        // and clear the clickedToCheck array
        // toggleItem(this);
        //only check if the item is not alredy checked
        if (!matched.includes(this)) {
            console.log("hasn't seen before");
            clickedToCheck.push(this);
            toggleItem(this);
            console.log(clickedToCheck.length);
            if (clickedToCheck.length == 2) {
                let isMatched = isMatchId();
                console.log(isMatched);
                if (isMatched) {
                    console.log("matched");
                    matched.push(clickedToCheck[0]);
                    matched.push(clickedToCheck[1]);
                    clickedToCheck = [];
                    currentScore++;
                    console.log(matched.length);
                    console.log(chosenCards.length);
                    if (matched.length === totalLength) {
                        winOrLose = true;
                        gameOver(timerId);
                        console.log("you won");
                        $(".wining-statement").css("display", "inline");
                    }
                    //update score
                    $(".score").html("Score:   " + currentScore);
                } else {
                    //card is wrong pair then flip the
                    //turn back in the array
                    //cards are not mathcing pairs
                    setTimeout( () => { 
                        console.log("time");
                        toggleItem(clickedToCheck[0]);
                        toggleItem(clickedToCheck[1]);
                        clickedToCheck = [];
                    }, 400);
                }        
            }
        }
        // console.log($(this).children('.card-face')[0].id);
    }); 
}

function toggleItem(element) {
    console.log("toggled");
    $(element).children('.card-back').toggle("hide");   
    $(element).children('.card-face').toggle("hide");  
}

function canBeFlip(element) {
    return (matched.includes($(element).children('.card-face')));
}

function isMatchId() {// index[0] == index[1]
    console.log($(clickedToCheck[0]).children('.card-face')[0].id);
    console.log($(clickedToCheck[1]).children('.card-face')[0].id);
    return $(clickedToCheck[0]).children('.card-face')[0].id === $(clickedToCheck[1]).children('.card-face')[0].id;  
}

//must be length 2 to be called
//maybe have a eay to make as an event?

//noe display the finalized board
function playGameHandler(event) {
    $(".score").show();// change here to show the hidden cards
    startCountDown();
    console.log("inside");
    $(".game-board").show(); //now show the game board
}

function startCountDown() {
    $(".remaining-time").show();
    $(".remaining-time").text(gameTimeLimit);
    //every one second 
    timerId = setInterval(() => {
        gameTimeLimit--;
        console.log(gameTimeLimit);
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
    matched = [];//clear out the matched cardlist
}

function gameOver(timer) {
    // TODO: Fix the game ending state. Handle winning condition.
    // gameOnGoing = false;
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







