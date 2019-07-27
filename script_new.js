"use strict"

// set grid number based on the user choice.

const SIZE_SMALL = 4;        
const SIZE_MEDIUM = 6;    
const SIZE_BIG = 8;    
let rowSize = -1;// set default value as small
let colSize = -1;
let gameTimeLimit = -1;
let timer = null;
let gameStarted = false;
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
let matched = [];
let clickedToMatch=[];
$(".game-board").hide();// doesn't show at first
$(".start-btn").on("click", handleStartClick);//start press then level
$(".size").on("click", sizeCallBack);
$(".restart-btn").on("click", handleStartClick);

//start the game
function handleStartClick() {
    gameStarted = true;
    $(".lost-statement").hide();
    $(".introduction").hide();
    $(".remaining-time").hide();
    cards = _.shuffle(cards);
    //when Ipush restart, te board should be hidden 
    //size option should be displayed
    $(".game-board").empty();//clean up the board
    $(".game-board").hide();//hide it
    $(".start-btn").hide();
    $(".restart-btn").hide();
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
        gameTimeLimit = 2;
    } else if (event.target.id === "levelTwo") {
        rowSize = SIZE_MEDIUM;
        colSize = SIZE_MEDIUM;
        gameTimeLimit = 4;
    } else if (event.target.id === "levelThree") {
        rowSize =SIZE_BIG;
        colSize =SIZE_BIG;
        gameTimeLimit = 6;
    }
}

//the size button hasbeen clicked and append the items
function sizeCallBack(event) {
    $(".remaining-time").text("0");
    gameBoadPrep(event);
    playGameHandler(event);
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
        //??? can I do this? like make them individual event
        $(chosenPic).on("click", faceToBack(chosenPic));
        //add on click listener to the card
        //append both front and back to the same div
        $(".game-board").append("<div class=card-face id=" + chosenPic + "><img src=img/" + chosenPic + " /></div>");
        // $(".game-board").append("<div class=card-face id=" + chosenPic + "><img src=img/" + chosenPic + " /></div>");
        console.log($('#' + chosenPic).val());
    } 
   
    // console.log(".game-board");
    //********HERE FIGURE OUT HOW TO MAKE ALL VISIBLE TO BACK CARD */
}

//things to do: how to flip to back card
function faceToBack(card) {
    console.log("Fliped to back image");
}

//must be length 2 to be called
//maybe have a eay to make as an event?
function cardOpen() {
    if (clickedToMatch.length == 2) {
        if (clickedToMatch[0] == clickedToMatch[1]) {
            matched.push(clickedToMatch[0]);
            console.log("macthed");
        } else {
            //clear ou the currently attempted to match items
            clickedToMatch = [];
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

//card - card that user clicked
// function flipCard(card) {
//     if (canFlipCard(card)) {
//         //remove the back and show front
//         $(card).show();// show front side card
//     }
//     // if (cardToCheck()) {

//     // }
// }

// function canFlipCard() {
//     //first the card is not currently cliked card
//     return !busy
// }
function startCountDown() {
    $(".remaining-time").show();
    $(".remaining-time").text(gameTimeLimit);
    //every one second 
    let timer = setInterval(() => {
        gameTimeLimit--;
        $(".remaining-time").html(gameTimeLimit);
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

function gameOver(timer) {
    gameStarted = false;
    clearInterval(timer);
    $(".game-board").hide();
    $(".remaining-time").hide();
    $(".lost-statement").show();
    $(".score").hide();
    matched = [];//clear out the matched cardlist
    console.log("over");
}



