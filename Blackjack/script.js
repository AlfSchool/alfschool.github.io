const deckId = "37sta7v8fxey";

window.addEventListener('load', async () => {    
    const playerHand = document.querySelector('#playerHand');
    const dealerHand = document.querySelector('#dealerHand');

    function animate(cards, time) {
        const t = time * 0.001;
        cards = cards.children;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const seed = Number(card.randomOffset);
            const floatX = Math.cos(t * 0.8 + seed) * 2;
            const floatY = Math.sin(t + seed) * 2;
            const rotZ = Math.sin(t + seed) * 1;
            const rotX = Math.sin(t * 0.7 + seed) * 2; 
            const rotY = Math.cos(t * 0.6 + seed) * 2;
            const origTransform = card.origTransform;
            card.style.transform = `
                ${origTransform}
                translate(${floatX}px, ${floatY}px)
                rotateX(${rotX}deg)
                rotateY(${rotY}deg)
                rotate(${cards[i].angle + rotZ}deg)
            `;
            if (card.isHovered) {
                card.style.transform += `scale(${1.05})`;
                card.style.background = 'red';
                const p = card.getMousePosition();
                console.log(`x: ${p.x} y: ${p.y}` );
            } else {
                card.style.background = '';
            }
        }
    }
    function loop(time) {
        animate(playerHand, time);
        animate(dealerHand, time);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    const pHand = [];
    const dHand = [];

    const deck = document.querySelector('#deck');
    function updateDeck() {
        let cardsOnDeck = deck.children.length;
        let counter = Number((remainingCountLabel.innerHTML).split("/")[0], 10);
        if (cardsOnDeck === counter) {
            return;
        }
        while (cardsOnDeck < counter) {
            backImage = "https://deckofcardsapi.com/static/img/back.png";
            const newCard = document.createElement('img');
            newCard.classList.add('card');
            newCard.style.position = "absolute";
            newCard.style.left = 0;
            newCard.style.top = 0;
            newCard.src = backImage;
            zIndex = deck.children.length;
            newCard.style.zIndex = zIndex;
            newCard.style.transform = `translate(${zIndex / 5}px, ${-zIndex / 5}px)`;
            deck.appendChild(newCard);
            cardsOnDeck++;
        }
        while (cardsOnDeck > counter) {
            deck.removeChild(deck.lastChild);
            cardsOnDeck--;
        }
    }

    const remainingCountLabel = document.querySelector('#remainingCount');
    function updateRemainingCards(remaining) {
        remainingCountLabel.innerHTML = remaining + "/51";
        if (remaining < 10) {
            remainingCountLabel.innerHTML = "0" + remainingCountLabel.innerHTML;
        }
        updateDeck();
    }

    await drawCard(dealerHand);
    await drawCard(dealerHand, true);

    await drawCard(playerHand);
    await drawCard(playerHand);

    const winnerLabel = document.querySelector('#winner');
    let gameFinished = false;

    const drawCardButton = document.querySelector('#draw');
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
        flip(dealerHand.children[1]);
        while (value(dHand) < 17) {
            await drawCard(dealerHand);
        }
        determineWinner();
        drawCardButton.disabled = true;
        stayButton.disabled = true;
    });

    const newGameButton = document.querySelector('#new');
    newGameButton.addEventListener('click', async () => {
        await newGame();
    });

    async function newGame() {
        pHand.splice(0, pHand.length);
        dHand.splice(0, dHand.length);
        winnerLabel.innerHTML = '';
        playerHand.innerHTML = '';
        dealerHand.innerHTML = '';
        await drawCard(dealerHand);
        drawCard(dealerHand, true);
        await drawCard(playerHand);
        await drawCard(playerHand);        
        gameFinished = false; 
        drawCardButton.disabled = false;
        stayButton.disabled = false;
    }

    function flip(card) {
        if (card.isFaceUp) {
            card.src = card.back;
        } else {
            card.src = card.front;
        }
        card.isFaceUp = !card.isFaceUp;
    }

    async function drawCard(hand, HIDDEN = false) {
        const drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
        let response = await fetch(drawUrl);
        let jsonData = await response.json();
        if (jsonData.remaining === 0) {
            await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            response = await fetch(drawUrl);
            jsonData = await response.json();
        }
        updateRemainingCards(jsonData.remaining);
        const drawnCard = jsonData.cards[0];
        const newCard = document.createElement('img');
        newCard.back = "https://deckofcardsapi.com/static/img/back.png";
        newCard.front = drawnCard.image;
        newCard.src = HIDDEN ? newCard.back : newCard.front;
        newCard.isFaceUp = !HIDDEN;
        newCard.classList.add('card');
        newCard.isHovered = false;
        newCard.addEventListener('mouseenter', () => {
            newCard.isHovered = true;
        });
        newCard.addEventListener('mouseleave', () => {
            newCard.isHovered = false;
        });
        newCard.addEventListener('mousemove', (e) => {
            newCard.mouseX = e.clientX;
            newCard.mouseY = e.clientY;
        });
        newCard.getMousePosition = function() {
            const rect = newCard.getBoundingClientRect();
            const x = (this.mouseX - rect.left) / rect.width;
            const y = (this.mouseY - rect.top) / rect.height;
            return {x, y};
        };
        hand.appendChild(newCard);
        updatePositionCards(hand);
        if (hand === playerHand) {
            pHand.push(drawnCard.value);
        }
        if (hand === dealerHand) {
            dHand.push(drawnCard.value);
        }
        return newCard;
    }

    function value(hand) {
        let value = 0;
        const FACE_CARDS = ['KING', 'QUEEN', 'JACK'];

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

    function updatePositionCards(hand) {
        let angle = 0;
        const incrementAngle = 2;//0.75;
        let length = hand.children.length;
        let middle = Math.floor(length / 2);
        if (length % 2 == 0) {
            middle--;
        }
        for (let i = middle; i >= 0; i--) {
            const card = hand.children[i]; 
            card.style.transform = `rotate(${angle}deg)`; 
            angle -= incrementAngle;
            card.angle = angle;
        }
        angle = 0;
        middle = Math.floor(length / 2);
        for (let i = middle; i < length; i++) {
            const card = hand.children[i];
            card.style.transform = `rotate(${angle}deg)`; 
            angle += incrementAngle;
            card.angle = angle;
        }
        for (let i = 0; i < length; i++) {
            const card = hand.children[i];
            card.origTransform = card.style.transform;
            card.randomOffset = Math.random() * Math.PI * 2;
        }
    }
});
