const deckId = "37sta7v8fxey";

window.addEventListener('load', async () => {
    const playerHand = document.querySelector('#playerHand');
    const dealerHand = document.querySelector('#dealerHand');

    let pHand = [];
    let dHand = [];

    await drawCard(dealerHand);
    await drawCard(dealerHand);

    await drawCard(playerHand);
    await drawCard(playerHand);

    const winnerLabel = document.querySelector('#winner');
    let gameFinished = false;

    let drawCardButton = document.querySelector('#draw');
    drawCardButton.addEventListener('click', async () => {
        if (gameFinished) {
            return;
        }
        await drawCard(playerHand);
        if (isBusted(pHand)) {
            determineWinner();
        }
    });

    const stayButton = document.querySelector('#stay');
    stayButton.addEventListener('click', async () => {
        if (gameFinished) {
            return;
        }
        while (value(dHand) < 17) {
            await drawCard(dealerHand);
        }
        determineWinner();
    });

    const restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', async () => {
        await restart();
    });

    async function restart() {
        pHand = [];
        dHand = [];
        winnerLabel.innerHTML = '';
        playerHand.innerHTML = '';
        dealerHand.innerHTML = '';
        await drawCard(dealerHand);
        await drawCard(dealerHand);
        await drawCard(playerHand);
        await drawCard(playerHand);        
        gameFinished = true; 
    }

    async function drawCard(targetHand, HIDDEN = false) {
        let drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
        let response = await fetch(drawUrl);
        let jsonData = await response.json();
        if (jsonData.remaining === 0) {
            await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            response = await fetch(drawUrl);
            jsonData = await response.json();
        }
        let drawnCard = jsonData.cards[0];
        let cardLink = drawnCard.images.png;
        let newCard = document.createElement('img');
        newCard.src = cardLink;
        newCard.classList.add('card');
        targetHand.appendChild(newCard);
        updatePositionCards(targetHand);
        if (targetHand === playerHand) {
            pHand.push(drawnCard.value);
        }
        if (targetHand === dealerHand) {
            dHand.push(drawnCard.value);
        }
    }

    function value(hand) {
        let value = 0;
        let FACE_CARDS = ['KING', 'QUEEN', 'JACK'];

        let aces = 0;

        for (let i = 0; i < hand.length; i++) {
            let cardValue = 0;
            if (FACE_CARDS.includes(hand[i])) {
                cardValue = 10;
            } else if (hand[i] === 'ACE') {
                aces++;
                cardValue = 11;
            } else {
                cardValue = Number(hand[i]);
            }
            value += Number(cardValue);
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--
        }

        return value;
    }

    function isBusted(hand) {
        return value(hand) > 21;
    }

    function determineWinner() {
        gameFinished = true;
        if (isBusted(dHand)) {
            winnerLabel.innerHTML = 'The dealer busted,<br> you win';
            return;    
        } 
        if (isBusted(pHand)) {
            winnerLabel.innerHTML = 'The player busted,<br> you lost';
            return;
        }
        if (value(pHand) === value(dHand)) {
            winnerLabel.innerHTML = 'Its a draw';
            return;
        }
        if (value(pHand) > value(dHand)) {
            winnerLabel.innerHTML = 'You win';
            return;
        }
        if (value(pHand) < value(dHand)) {
            winnerLabel.innerHTML = 'You lost';
            return;
        }
        gameFinished = false;
    }

    function updatePositionCards(targetHand) {
        let angle = 0;
        let incrementAngle = 0.75;
        let height = 10;
        let decreaseHeight = 1;
        let length = targetHand.children.length;
        let middle = Math.floor(length / 2);
        if (length % 2 == 0) {
            middle--;
        }
        for (let i = middle; i >= 0; i--) {
            let card = targetHand.children[i]; 
            card.style.transform = `rotate(${angle}deg)`; 
            angle -= incrementAngle;
            height -= decreaseHeight;
        }
        angle = 0;
        height = 10;
        middle = Math.floor(length / 2);
        for (let i = middle; i < length; i++) {
            let card = targetHand.children[i];
            card.style.transform = `rotate(${angle}deg)`; 
            angle += incrementAngle;
            height -= decreaseHeight;
        }
    }
});