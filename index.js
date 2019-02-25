var Word = require("./word")
var inquirer = require("inquirer");
var CFonts = require('cfonts');

var currentWord="";
var newWord;
var plays=0;
var pickedWords=[];
var pickedLetters=[];
var guesses=0;
var words=["Radiohead"]
//var words=["Radiohead","Red Hot Chilli Peppers","Nirvava","Pearl Jam","Weezer","Green Day","Coldplay","Foo Fighters","Muse","The Killers","Artic Monkeys","The Strokes","No Doubt","Arcade Fire"]

function start(){
    CFonts.say("alt bands\nhangman", {
        font: 'simple',   
        colors: ['magentaBright'], 
    });
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to play Alternative Bands Hangman?",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            playGame()
        }
        else{
            console.log("\nCome back anytime!\n")
        }
    });
}

function playGame(){
    plays++;
    guesses=10;
    pickedLetters=[];
    if(plays<6){
        currentWord=chooseWord();
        newWord=new Word(currentWord);
        newWord.wordSplit();
        //console.log(newWord)
        playerGuess()
    }
    if(plays>5){
        win()
    }
}

function chooseWord(){
    ranIndex=Math.floor(Math.random() * words.length);
    newWord=words[ranIndex];
    if(!pickedWords.includes(newWord)){
        pickedWords.push(newWord)
        return newWord.toUpperCase()
    }
    else{
        chooseWord()
    }
}

function playerGuess(){
    newWord.displayWord()
    inquirer.prompt([
        {
            type: "input",
            message: "Please guess by entering one letter at a time:",
            name: "entry"
        }
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.entry.length===1){
            userInput=inquirerResponse.entry.toUpperCase();
            pickedLetters.push(userInput);
            gussesLeft()
        }
        else{
            console.log("\n*** You must enter one character at a time ***\n") 
            userInput=".";
            gussesLeft()
        }
     
    })
    .catch(function(err) {
        if (err) {
          console.log("error.response.data");
        }
    });
};

function gussesLeft(){
    if(guesses!=1){
        rightWrong()
    }
    else{
        lose()
    }
}

function rightWrong(){
    letterCheck=[];
    newWord.checkLetter();
    newWord.letters.forEach(letter => {
        //letter.check(userInput)
        letterCheck.push(letter.onScreen)
    })
    //console.log(letterCheck)
    if(!letterCheck.includes("_")){
        win()
    }
    else if(!letterCheck.includes(userInput)){
        guesses--
        console.log("You have "+guesses+" guesses left");
        playerGuess()
    }
    else{
        console.log("You have "+guesses+" guesses left");
        playerGuess()
    }
}

function win(){
    newWord.displayWord();
    CFonts.say("congrats!\nyou won!", {
        font: 'simple',   
        colors: ['magenta'], 
    });
    playAgain()
}

function lose(){
    CFonts.say("you lose :(", {
        font: 'simple',   
        colors: ['magenta'], 
    });
    playAgain()
}

function playAgain(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to try again?",
            name: "confirm",
            default: true
        },
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.confirm){
            start();
            console.log("\nPlease run --node index.js\n")
        }
        else{
            console.log("\nCome back anytime!\n")
        }
    });
}

function restart(){
    currentWord="";
    plays=0;
    playGame()
}

start()