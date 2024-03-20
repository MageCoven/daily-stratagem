var stratagem = null;
var currentStep = 0;
var currentGuessElement = null;
var guessesMade = 0;
var guessIndexElement = null;
var debugMode = false;
var isComplete = false;

function mapInputToDirection(input) {
    switch (input) {
        case "ArrowUp":
        case "w":
            return "up";
        case "ArrowDown":
        case "s":
            return "down";
        case "ArrowRight":
        case "d":
            return "right";
        case "ArrowLeft":
        case "a":
            return "left";
        default:
            return null;
    }
}

function renderNewInput(direction, isCorrect) {
    if (currentGuessElement == null) {
        currentGuessElement = document.createElement("div");
        document.querySelector("#guesses").appendChild(currentGuessElement);
    }

    const inputElement = document.createElement("img");
    inputElement.classList.add(isCorrect ? "correct" : "incorrect");
    inputElement.src = `../images/arrows/${direction}.svg`;
    currentGuessElement.appendChild(inputElement);
}

function nextInSequence(direction) {
    const isCorrect = direction === stratagem.sequence[currentStep];
    renderNewInput(direction, isCorrect);

    if (direction === stratagem.sequence[currentStep]) {
        currentStep++;

        if (currentStep === stratagem.sequence.length) {
            guessesMade++;
            guessIndexElement.innerHTML = guessesMade;
            currentStep = 0;

            document.querySelector("#stratagem-name").innerHTML =
                stratagem.name;
            document.querySelector(
                "#stratagem-icon"
            ).src = `../images/stratagems/${stratagem.icon}`;
            isComplete = true;
        }
    } else {
        currentGuessElement = null;
        guessesMade++;
        guessIndexElement.innerHTML = guessesMade;
        currentStep = 0;
    }
}

var debugIndex = 0;
function onKeyDown(event) {
    const input = event.key;
    if (input === "n" && debugMode) {
        debugIndex++;
        const date = new Date();
        date.setDate(date.getDate() + debugIndex);
        stratagem = selectStratagem(date);
        console.log(stratagem.name);
        currentStep = 0;
        currentGuessElement = null;
        guessesMade = 0;
        guessIndexElement = null;
        startGame();
    }

    if (input === "t" && debugMode) {
        testABunchOfDates();
    }

    const direction = mapInputToDirection(input);
    if (direction && !isComplete) {
        nextInSequence(direction);
    }
}

function hashNumber(x) {
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = (x >> 16) ^ x;
    return x;
}

function selectStratagem(date) {
    const dateIndex =
        date.getDate() +
        date.getMonth() * 1000 +
        date.getFullYear() * 1000 * 1000;
    const hashedDateIndex = hashNumber(dateIndex) % stratagems.length;
    return stratagems[hashedDateIndex];
}

function testABunchOfDates() {
    // Loop over a range of days, months and years and select a bunch of stratagems
    for (let year = 2020; year < 2025; year++) {
        for (let month = 0; month < 12; month++) {
            for (let day = 1; day < 29; day++) {
                const date = new Date(year, month, day);
                console.log(
                    `Date: ${date.toDateString()}, Stratagem: ${
                        selectStratagem(date).name
                    }`
                );
            }
        }
    }
}

function setupListeners() {
    document.addEventListener("keydown", onKeyDown);
}

function startGame() {
    document.querySelector("#guesses").innerHTML = "";
    guessIndexElement = document.querySelector("#guess-index");
    document.querySelector("#stratagem-name").innerHTML = "Unknown";
    document.querySelector(
        "#stratagem-icon"
    ).src = `../images/stratagems/unknown.svg`;
}

function setupGame() {
    setupListeners();
    stratagem = selectStratagem(new Date());
    startGame();
}

document.addEventListener("DOMContentLoaded", setupGame);
