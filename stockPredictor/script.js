window.addEventListener('load', () => {
    console.log("reload");
    const INITIAL_PRICE = 250;
    prices = [INITIAL_PRICE];
    variations = [];

    const input = document.querySelector('#input');
    input.addEventListener('keydown', async (e) => {
        if (e.key !== "Enter") {
            return;
        }
        increase = Number(e.target.value);
        if (isNaN(increase)) {
            return;
        }
        variations.push(increase / 100);
        const lastPrice = prices[prices.length - 1]; 
        prices.push(lastPrice + lastPrice * (increase / 100));
        drawTrend();
        await fetch("http://localhost:3000/stocks", {
            method: "POST",
            body: JSON.stringify({
                "variation": (increase / 100)
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    });

    const canvas = document.querySelector('#canvas');
    canvas.height = 500;
    canvas.width = 500;
    const ctx = canvas.getContext('2d');
    function drawTrend() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let dx = canvas.width / prices.length;
        let x = 0;
        let y = canvas.height - INITIAL_PRICE;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (p of prices) {
            x += dx;
            ctx.lineTo(x, canvas.height - p);
        }
        ctx.strokeStyle = "green";
        ctx.stroke();
    }   

    const resultLabel = document.querySelector('#result');
    function showResult(itWillGoUp) {
        resultLabel.innerHTML = itWillGoUp ? "up" : "down";
    }
});