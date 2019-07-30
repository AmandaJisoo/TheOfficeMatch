"use strict"

// set grid number based on the user choice.

const SIZE_SMALL = 4;        
const SIZE_MEDIUM = 6;    
const SIZE_BIG = 8;    
let rowSize = -1;// set default value as small
let colSize = -1;
let gameTimeLimit = -1;
let timer = null;
let gameOnGoing = false;
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
//list of matched cards
let matched = new Set();
console.log(matched.has(5));
// let matched = [];
let clickedToCheck=[];
$(".game-board").hide();// doesn't show at first
$(".start-btn").on("click", handleStartClick);//start press then level
$(".size").on("click", sizeCallBack);
$(".restart-btn").on("click", restart);


//start the game
function handleStartClick() {
    if (!gameOnGoing) {
        //the user clicked restart button
        gameOver();
        gameOnGoing = true;
        console.log("onGOing");
    }
    $(".lost-statement").hide();
    $(".introduction").hide();
    cards = _.shuffle(cards);
    $(".start-btn").hide();
    displaySizeOption();//disaply game size option and create gameboard
}

function displaySizeOption() {
    $(".size").show();
}

function removeSizeOption() {
     $(".size").hide();
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
        gameTimeLimit = 60;
    } else if (event.target.id === "levelThree") {
        rowSize =SIZE_BIG;
        colSize =SIZE_BIG;
        gameTimeLimit = 1000;
    }
}

//the size button hasbeen clicked and append the items
function sizeCallBack(event) {
    $(".remaining-time").text("0");
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
        console.log(canBeFlip(event));
        console.log( $(this).children('.card-face').id); // ehy undefined?
        console.log($(this).children('.card-back')); 
        $(this).children('.card-back').toggle("hide");   
        $(this).children('.card-face').toggle("hide");  
        if ($( this ).css( "transform" ) == 'none' ){
            $(this).css("transform","360deg");
        } else {
            $(this).css("transform","" );
        }
    }); 
}

//1. previously matched
//2.only upto two cards is allowe to be open 
//change parameter to the string event id?
function canBeFlip(element) {
    //cnage to includes name
    return (matched.includes($(element).children('.card-face')) && clickedToCheck.length < 2);
}

function isMatch(event) {
    if (clickedToCheck.includes(event)) {
        matched.push(event);
        //flip remove toggle class fuctionality
    }
}

function isMisMathc(event) {
    //then rotate back and
}
//must be length 2 to be called
//maybe have a eay to make as an event?
function cardOpen() {
    if (clickedToCheck.length == 2) {
        if (clickedToCheck[0] == clickedToCheck[1]) {
            matched.push(clickedToCheck[0]);
            console.log("macthed");
        } else {
            //clear ou the currently attempted to match items
            clickedToCheck = [];
        }
    }
}

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
    timer = setInterval(() => {
        gameTimeLimit--;
        $(".remaining-time").html("Timer:   " + gameTimeLimit);
        if(gameTimeLimit === 0) {
            gameOver(timer);
        }
    }, 1000);
}

// function chandleCardClike() {
//     // chosenCard
    
// }


// function flipCard(event) {
//     //condition1: either user has not chose any card yet
//     //condition2: the newly clikedcard is not currently
//     //open card
//     let cardName = event.event.id;
//     if (chosenCards.length < 2 && )
//     return !gameStarted = 
// }
//cards that has been alredy matched
// function isMatchingPair() {
//     if () {

//     }
// }
// function canFlipCard() {
//     //condition1: card must not be currently open
//     return !gameStarted &&
// }
function restart() {
    hideInfo();
    gameOnGoing = true;
    handleStartClick();
    $(".restart-btn").hide();
}

function hideInfo() {
    clearInterval(timer);
    $(".game-board").empty();
    $(".personal-info").hide();
    $(".game-board").hide();
    $(".remaining-time").hide();
    $(".lost-statement").hide();
    matched = [];//clear out the matched cardlist
}

function gameOver(timer) {
    gameOnGoing = false;
    clearInterval(timer);
    hideInfo(timer);
    $(".lost-statement").show();
    $(".score").hide();
    console.log("over");
}






