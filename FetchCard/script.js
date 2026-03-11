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
        let angle = 0;
        for (let i = Math.floor(hand.children.length / 2); i >= 0; i--) {
            if (hand.children[i] === undefined) {
                console.log("fdjsfj");
                break;
            }
            hand.children[i].style.transform = "rotate(" + angle + "deg)";
            angle -= 1;
        }
        angle = 0;
        console.log(hand.children[hand.children.length-1]);
        for (let i = Math.floor(hand.children.length / 2); i < hand.children.length; i++) {
            if (hand.children[i] === undefined) {
                console.log("fdjsfj");
                break;
            }
            hand.children[i].style.transform = "rotate(" + angle + "deg)";
            angle += 1;
        }
    }
});