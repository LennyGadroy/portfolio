document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.tva-nav');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.tva-nav li a').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

//    const navItems = document.querySelectorAll('.tva-nav li');
//    navItems.forEach(item => {
//        item.addEventListener('click', () => {
//            navItems.forEach(i => i.classList.remove('active'));
//            item.classList.add('active');
//        });
//    });

    const projectData = {
        'revue': {val: '0',points: '0,49 5,38 10,35 20,38 30,30 40,28 50,20 60,18 70,22 80,20 90,5 100,0'},
        'goon': {val: '4,949',points: '0,20 10,19 20,15 30,17 40,12 50,10 60,15 70,10 80,25 90,5 100,0'},
        'skills': {val: '100',points: '0,50 50,25 100,0'},
        'yligen': {val: '10 156',points: '0,30 10,32 20,25 30,15 40,10 50,20 60,15 70,7 80,10 90,10 100,0'},
        'geoptime': {val: '6 390',points: '0,49 50,49 60,40 70,37 80,28 90,25 100,27'},
        'filrouge': {val: '559', points: '0,49 50,49 60,45 80,47 100,40'},
        'noevell': {val: '457', points: '0,49 50,49 100,40'},
        'portfolio': {val: '2 379', points: '0,28 10,15 20,5 30,8 40,5 49,0 50,49 60,40 70,37 80,22 90,15 100,0'},
    };

    let totalLines = 0;
    for (const key in projectData) {
        if (key !== 'revue') {
            const rawValue = projectData[key].val;
            const numberValue = parseInt(rawValue.replace(/\s/g, ''), 10);
            if (!isNaN(numberValue)) {
                totalLines += numberValue;
            }
        }
    }
    projectData['revue'].val = totalLines.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const timeItems = document.querySelectorAll('.file-list li');
    const graphPolyline = document.querySelector('#graph .graph-svg polyline');
    const graphValueDiv = document.querySelector('#graph .graph-value');

    timeItems.forEach(item => {
        item.addEventListener('click', () => {
            timeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const data = projectData[item.id] || {val: '0', points: '0,50 100,0'};
            graphValueDiv.innerHTML = `${data.val} <span class="unit">lignes de codes</span>`;
            graphPolyline.setAttribute('points', data.points);
        });
    });

    const dirItems = document.querySelectorAll('.dir-item');
    dirItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Opening Directory: ' + item.textContent);
        });
    });
});