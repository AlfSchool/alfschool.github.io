const deckId = "37sta7v8fxey";

window.addEventListener('load', async () => {
    let drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
    let response = await fetch(drawUrl);
    let jsonData = await response.json();
    if (!jsonData.remaining) {
        await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/`);
    }
    response = await fetch(drawUrl);
    jsonData = await response.json();
    let cardLink = jsonData.cards[0].images.png;
    const image = document.querySelector('#cardImage');
    image.src = cardLink;

    let changeButton = document.querySelector('#changeButton');
    changeButton.addEventListener('click', async () => {
        if (!jsonData.remaining) {
            response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/`);
        }
        response = await fetch(drawUrl);
        jsonData = await response.json();
        cardLink = jsonData.cards[0].images.png;
        image.src = cardLink;
        console.log(jsonData.remaining);
    });
});