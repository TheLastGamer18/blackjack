let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let hidden;
let deck = [];
let canHit = true;

window.onload = blackJack();
document.getElementById("play-again").addEventListener("click", () => {
    location.reload();
});

function blackJack() {
    buildDeck();
    shuffle();
    startGame();
}

function buildDeck() {
    let cardTypes = ["C", "D", "H", "S"];
    let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    for (let i = 0; i < cardTypes.length; i++) {
        for (let j = 0; j < cardValues.length; j++) {
            deck.push(`${cardValues[j]}-${cardTypes[i]}`);
        }
    }
}

function shuffle() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let tempCard = deck[i];
        deck[i] = deck[j];
        deck[j] = tempCard;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = `./cards/${card}.png`;
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = `./cards/${card}.png`;
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }

    let adjustedPlayerSum = ace(playerSum, playerAceCount);
    document.getElementById("player-sum").innerText = adjustedPlayerSum;

    if (adjustedPlayerSum === 21) {
        canHit = false;
        document.getElementById("hidden").src = `./cards/${hidden}.png`;
        dealerSum = ace(dealerSum, dealerAceCount);

        let message = "";
        if (dealerSum === 21) {
            message = "Both got Blackjack. It's a tie!";
        } else {
            message = "Blackjack! You won!";
        }

        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("player-sum").innerText = adjustedPlayerSum;
        document.getElementById("result").innerText = message;

        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
        document.getElementById("play-again").style.display = "block";
        return;
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];
    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        } else {
            return 10;
        }
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function hit() {
    if (!canHit) return;

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = `./cards/${card}.png`;
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    let adjustedPlayerSum = ace(playerSum, playerAceCount);
    document.getElementById("player-sum").innerText = adjustedPlayerSum;

    if (adjustedPlayerSum === 21) {
        canHit = false;

        // Dealer draws until at least 17
        while (ace(dealerSum, dealerAceCount) < 17) {
            let dealerCard = deck.pop();
            let cardImg = document.createElement("img");
            cardImg.src = `./cards/${dealerCard}.png`;
            document.getElementById("dealer-cards").append(cardImg);

            dealerSum += getValue(dealerCard);
            dealerAceCount += checkAce(dealerCard);
        }

        dealerSum = ace(dealerSum, dealerAceCount);
        document.getElementById("hidden").src = `./cards/${hidden}.png`;

        let message = "";
        if (dealerSum === 21) {
            message = "Both got 21. It's a tie!";
        } else if (dealerSum > 21) {
            message = "You hit 21 and dealer busted. You win!";
        } else if (dealerSum < 21) {
            message = "You hit 21! You win!";
        }

        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("result").innerText = message;
        document.getElementById("hit").disabled = true;
        document.getElementById("stand").disabled = true;
        document.getElementById("play-again").style.display = "block";
        return;
    }

    if (adjustedPlayerSum > 21) {
        canHit = false;
        stand();
    }
}

function stand() {
    dealerSum = ace(dealerSum, dealerAceCount);
    playerSum = ace(playerSum, playerAceCount);

    canHit = false;
    document.getElementById("hidden").src = `./cards/${hidden}.png`;

    let message = "";
    if (playerSum > 21) {
        message = "Bust! You lost.";
    } else if (dealerSum > 21) {
        message = "Dealer busts! You win!";
    } else if (playerSum === 21 && dealerSum === 21) {
        message = "Both have 21. It's a tie!";
    } else if (playerSum === 21) {
        message = "You hit 21! You win!";
    } else if (dealerSum === 21) {
        message = "Dealer has 21. You lost!";
    } else if (playerSum > dealerSum) {
        message = "You win with a higher hand!";
    } else if (playerSum < dealerSum) {
        message = "Dealer wins with a higher hand.";
    } else {
        message = "Push. It's a tie!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("result").innerText = message;

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("play-again").style.display = "block";
}

function ace(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}
