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
    const showcase = document.querySelector('#data');
    const ipField = document.querySelector('#ip');
    ipField.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            let response = await fetch(ipField.value);
            response = await response.json();
            showcase.innerHTML = JSON.stringify(response);
        }
    });
});

