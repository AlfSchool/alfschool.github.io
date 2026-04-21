function resetMarquee() {
    const title = document.getElementById('title');
    const box = title.getBoundingClientRect();
    title.style.animation = 'none';
    title.offsetHeight; // force reflow
    title.style.animation = 'move 14s steps(67) infinite';
    title.style.left = `${box.x}px`;
}

window.addEventListener('resize', resetMarquee);