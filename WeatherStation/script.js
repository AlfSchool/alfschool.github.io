function resetMarquee() {
    const title = document.getElementById('title');
    const box = title.getBoundingClientRect();
    title.style.animation = 'none';
    title.offsetHeight; 
    title.style.animation = 'move 14s steps(67) infinite';
    title.style.left = `${box.x}px`;
}

window.addEventListener('resize', resetMarquee);

window.addEventListener('load', () => {
    const showLabs = document.querySelector('#labs');
    const brightness = document.querySelector('#brightness');
    const temperature = document.querySelector('#temperature');
    const humidity = document.querySelector('#humidity');

    const ipField = document.querySelector('#ip');
    ipField.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') {
            return;
        }    

        const response = await fetch(ipField.value);
        const data = await response.json();
        
        let labs = getLabs(data);
        console.log(labs);
    });

    function getLabs(data) {
        const labs = {};
        for (sample of data) {
            const [labName, workStation] = sample.position.split('-');
            if (!(labName in labs)) {
                labs[labName] = {};
            }
            if (!(workStation in labs[labName])) {
                labs[labName][workStation] = [];
            }
            labs[labName][workStation].push(sample);
        }
        return labs;
    }
});

