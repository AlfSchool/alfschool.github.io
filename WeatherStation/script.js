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
    const showWorkStations = document.querySelector('#workStations');

    const ipField = document.querySelector('#ip');
    ipField.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') {
            return;
        }    

        const response = await fetch(ipField.value);
        const data = await response.json();
        
        const labs = getLabs(data);
        
        const labsNames = Object.keys(labs);
        labsNames.forEach(labName => {
            showLabs.innerHTML += `<div><button>${labName}</button></div>`;
        });

        for (const lab of showLabs.children) {
            lab.children[0].addEventListener('click', () => {
                const labChoosen = labs[lab.children[0].innerHTML];
                const stations = Object.keys(labChoosen);
                showWorkStations.innerHTML = '';
                stations.forEach(stationName => {
                    showWorkStations.innerHTML += `<div><button>${stationName}</button></div>`;
                });

                for (const station of showWorkStations.children) {
                    station.addEventListener('click', () => {
                        const workStation = labChoosen[station.children[0].innerHTML];
                        updateInterface(workStation);
                    });
                }
            });
        }

        function updateInterface(station) {
            console.log(station);
            const brightnessZone = document.querySelector('#brightness');
            const temperatureZone = document.querySelector('#temperature');
            const humidityZone = document.querySelector('#humidity');

            temperatureZone.innerHTML = '<canvas id="temperatureGraph"></canvas>';
            const graphTemperature = document.querySelector('#temperatureGraph');
            const ctx = graphTemperature.getContext('2d');
            
        }
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

