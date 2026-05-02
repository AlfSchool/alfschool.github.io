function resetMarquee() {
    const title = document.getElementById('title');
    const box = title.getBoundingClientRect();
    title.style.animation = 'none';
    title.offsetHeight; 
    title.style.animation = 'move 14s steps(67) infinite';
    title.style.left = `${box.x}px`;
}

window.addEventListener('resize', resetMarquee);

let currentWorkStation = null;

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
        showLabs.innerHTML = '';
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
                        currentWorkStation = labChoosen[station.children[0].innerHTML];
                        updateInterface(currentWorkStation);
                    });
                }
            });
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

    function updateInterface(station) {
        updateHumidityGraph(station);
        updateTemperatureGraph(station);
    }

    window.addEventListener('resize', () => {
        if (!currentWorkStation) {
            return;
        }
        updateInterface(currentWorkStation);
    });

    function updateTemperatureGraph(station) {
        //random access memory variables initialization
        const graph = document.querySelector('#temperatureGraph');
        graph.width = graph.parentElement.clientWidth;
        graph.height = graph.parentElement.clientHeight;
        const ctx = graph.getContext('2d');

        const measurements = station.map(sample => {
            let time = Number(sample.timestamp.substring(11, 16).replace(':', '.'));
            return {
                "temperature": sample.temperature,
                "time": time
            };
        });

        //normalization
        const minTemp = Math.min(...measurements.map(m => m.temperature));
        const minTime = Math.min(...measurements.map(m => m.time));
        let points = measurements.map(m => {
            return {
                x: m.time - minTime,
                y: m.temperature - minTemp
            }
        });

        const maxX = Math.max(...points.map(p => p.x));
        const maxY = Math.max(...points.map(p => p.y));
        const height = graph.height;
        const width = graph.width;
        points = points.map(p => {
            return {
                x: p.x * (width / maxX),
                y: p.y * (height / maxY)
            }
        });

        points.forEach(p => {screen(point(p))});

        ctx.beginPath();
        for (let i = 1; i < points.length; i++) {
            ctx.strokeStyle = "white";
            ctx.moveTo(point(points[i-1]).x, point(points[i-1]).y);
            ctx.lineTo(point(points[i]).x, point(points[i]).y);
        }
        ctx.stroke();

        function point({x, y}) {
            //graph to canvas coordinates
            return {x: x, y: graph.height - y};
        }

        function screen({x, y}) {
            const s = 2;
            ctx.fillStyle = "white";
            ctx.fillRect(x - s/2, y - s/2, s, s);
        }

    }

    function updateHumidityGraph(station) {
        const chart = document.querySelector('#humidityChart');
        chart.width = chart.parentElement.clientWidth;
        chart.height = chart.parentElement.clientHeight;
        
        const measurements = station.map(sample => {
            let time = Number(sample.timestamp.substring(11, 16).replace(':', '.'));
            return {
                "humidity": sample.humidity,
                "time": time
            };
        });

        const bars = [];
        for (let i = 0; i < measurements.length; i++) {
            bars.push({
            });
        }
    }
});

