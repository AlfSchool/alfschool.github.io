const deckId = "37sta7v8fxey";

window.addEventListener('load', async () => {
    const hand = document.querySelector('#hand');

    await drawCard();

    let changeButton = document.querySelector('#changeButton');
    
    changeButton.addEventListener('click', async () => {
        await drawCard();
    });

    async function drawCard() {
        let drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
        let response = await fetch(drawUrl);
        let jsonData = await response.json();
        if (jsonData.remaining === 0) {
            await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            response = await fetch(drawUrl);
            jsonData = await response.json();
        }
        let cardLink = jsonData.cards[0].images.png;
        let newCard = document.createElement('img');
        newCard.src = cardLink;
        newCard.classList.add('card');
        hand.appendChild(newCard);
        updatePositionCards();
    }

    function updatePositionCards() {
        let angle = 0;
        let incrementAngle = 0.75;
        let height = 10;
        let decreaseHeight = 1;
        let length = hand.children.length;
        let middle = Math.floor(length / 2);
        if (length % 2 == 0) {
            middle--;
        }
        for (let i = middle; i >= 0; i--) {
            let card = hand.children[i]; 
            card.style.transform = `rotate(${angle}deg)`; // translateY(-${height}px)`;  
            angle -= incrementAngle;
            height -= decreaseHeight;
        }
        console.log("height reached: " + height);
        angle = 0;
        height = 10;
        middle = Math.floor(length / 2);
        for (let i = middle; i < length; i++) {
            let card = hand.children[i];
            card.style.transform = `rotate(${angle}deg)`; //translateY(-${height}px)`;
            angle += incrementAngle;
            height -= decreaseHeight;
        }
    }
});