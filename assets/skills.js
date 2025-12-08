document.addEventListener('DOMContentLoaded', () => {

    const CATALOG = [
        {id: 1, name: "Anglais B1", price: 90, cat: "soft", level: 1, desc: "Communication internationale", unlock: null},
        {id: 2, name: "HTML 5", price: 100, cat: "dev", level: 1, desc: "Bases du Web", unlock: null},
        {id: 3, name: "CSS 3", price: 150, cat: "dev", level: 1, desc: "Mise en forme", unlock: null},
        {id: 4, name: "JavaScript", price: 250, cat: "dev", level: 2, desc: "Interactivité", unlock: null},
        {id: 5, name: "Node.js", price: 450, cat: "dev", level: 5, desc: "Backend JS", unlock: null},
        {id: 6, name: "SEO", price: 300, cat: "soft", level: 4, desc: "Optimisation référencement naturel", unlock: "https://app-eu1.hubspot.com/academy/achievements/9mx1cscc/en/1/lenny-gadroy/seo"},
        {id: 7, name: "Figma", price: 200, cat: "design", level: 2, desc: "Maquettage UI / UX", unlock: null},
        {id: 8, name: "Canva", price: 120, cat: "design", level: 3, desc: "Création visuelle", unlock: null},
        {id: 9, name: "Notion", price: 120, cat: "soft", level: 3, desc: "Organisation & Productivité", unlock: null},
        {id: 10, name: "Trello", price: 120, cat: "soft", level: 5, desc: "Gestion de tâches", unlock: null},
        {id: 11, name: "Slack", price: 120, cat: "soft", level: 4, desc: "Communication d'équipe", unlock: null},
        {id: 12, name: "CapCut", price: 120, cat: "social", level: 3, desc: "Montage vidéo", unlock: null},
        {id: 13, name: "SCRL", price: 120, cat: "social", level: 2, desc: "Montage photo", unlock: null},
        {id: 14, name: "Agile / Scrum", price: 120, cat: "soft", level: 7, desc: "Gestion projet.", unlock: null},
        {id: 19, name: "Suite Adobe", price: 500, cat: "design", level: 10, desc: "Design graphique", unlock: null},
    ];

    const initialState = {credits: 200, xp: 0, level: 1, cart: [], acquired: []};
    let appState = JSON.parse(localStorage.getItem('lennyShopState')) || initialState;
    let currentFilter = 'all';
    let currentSort = 'level';

    const dom = {
        credits: document.getElementById('credit-amount'),
        xpBar: document.getElementById('xp-bar'),
        xpAmount: document.getElementById('xp-amount'),
        xpNext: document.getElementById('xp-next'),
        lvlDisplay: document.getElementById('level-display'),
        catalog: document.getElementById('catalog-list'),
        Zone: document.getElementById('zone'),
        Cart: document.getElementById('cart'),
        acquired: document.getElementById('acquired-list'),
        filterBtns: document.querySelectorAll('filter-btn'),
        Sort: document.getElementById('sort'),
        modal: document.getElementById('confirm-modal'),
        Yes: document.getElementById('yes'),
        No: document.getElementById('no'),
        hackGame: document.getElementById('game'),
        hackGrid: document.getElementById('grid'),
        hackTimer: document.getElementById('timer')
    };

    let pendingBuyId = null;
    function notify(msg, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${msg}</span><span>[x]</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function saveState() {
        localStorage.setItem('lennyShopState', JSON.stringify(appState));
        render();
    }

    function getNextLevelXp(lvl) {
        return lvl * 100;
    }

    function addXP(amount) {
        appState.xp += amount;
        const next = getNextLevelXp(appState.level);
        if (appState.xp >= next) {
            appState.xp -= next;
            appState.level++;
            notify(`LEVEL UP! Vous êtes niveau ${appState.level}`, 'success');
        }
        saveState();
    }

    function render() {
        dom.credits.textContent = appState.credits;
        dom.lvlDisplay.textContent = appState.level;
        const nextXp = getNextLevelXp(appState.level);
        dom.xpAmount.textContent = appState.xp;
        dom.xpNext.textContent = nextXp;
        dom.xpBar.style.width = `${(appState.xp / nextXp) * 100}%`;
        dom.catalog.innerHTML = '';

        let filtered = CATALOG.filter(i => {
            if (appState.acquired.includes(i.id)) return false;
            return currentFilter === 'all' || i.cat === currentFilter;
        });

        filtered.sort((a, b) => {
            if (currentSort === 'price-asc') return a.price - b.price;
            if (currentSort === 'price-desc') return b.price - a.price;
            if (currentSort === 'level') return a.level - b.level;
        });

        filtered.forEach(item => {
            const isLocked = item.level > appState.level;
            const inCart = appState.cart.includes(item.id);

            const div = document.createElement('div');
            div.className = `skill-item ${isLocked ? 'locked' : ''}`;
            if (!isLocked) {
                div.draggable = true;
                div.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', item.id));
            }

            div.innerHTML = `
                        ${isLocked ? '<div class="lock-overlay">🔒 LVL ' + item.level + '</div>' : ''}
                        <div class="skill-info">
                            <h4>${item.name} <span class="level-badge">Lvl ${item.level}</span></h4>
                            <p class="skill-desc">${item.desc}</p>
                            <div class="skill-meta">Catégorie: ${item.cat.toUpperCase()}</div>
                        </div>
                        <div style="text-align:right;">
                            <div class="skill-price">${item.price} CR</div>
                            ${!isLocked && !inCart ? `
                                <div class="btn-group">
                                    <button class="btn-add" onclick="addToCart(${item.id})">+</button>
                                    <button class="btn-buy-now" onclick="openBuyModal(${item.id})">⚡</button>
                                </div>
                            ` : ''}
                            ${inCart ? '<span style="font-size:0.8rem; color:var(--Primary)">Dans le panier</span>' : ''}
                        </div>
                    `;
            dom.catalog.appendChild(div);
        });

        const cartItems = CATALOG.filter(i => appState.cart.includes(i.id));
        dom.Zone.innerHTML = cartItems.length ? '' : '<p>Glissez les compétences ici</p>';
        cartItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'skill-item';
            el.innerHTML = `<span>${item.name}</span><span>${item.price} CR</span><button class="btn-remove" onclick="removeFromCart(${item.id})">X</button>`;
            dom.Zone.appendChild(el);
        });
        dom.Cart.textContent = cartItems.reduce((acc, i) => acc + i.price, 0);

        dom.acquired.innerHTML = '';
        appState.acquired.forEach(id => {
            const item = CATALOG.find(i => i.id === id);
            if (item) {
                const badge = document.createElement('div');
                badge.className = 'acquired-badge';
                let linkHtml = item.unlock ? `<a href="${item.unlock}" target="_blank" class="unlock-link">📁 ACCESS DATA</a>` : '';
                badge.innerHTML = `<strong>${item.name}</strong>${linkHtml}`;
                dom.acquired.appendChild(badge);
            }
        });
    }

    dom.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    dom.Sort.addEventListener('change', (e) => {
        currentSort = e.target.value;
        render();
    });

    window.addToCart = (id) => {
        if (!appState.cart.includes(id)) {
            appState.cart.push(id);
            saveState();
        }
    };
    
    window.removeFromCart = (id) => {
        appState.cart = appState.cart.filter(x => x !== id);
        saveState();
    };

    dom.Zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dom.Zone.classList.add('drag-over');
    });

    dom.Zone.addEventListener('dragleave', () => dom.Zone.classList.remove('drag-over'));
    dom.Zone.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.Zone.classList.remove('drag-over');
        const id = parseInt(e.dataTransfer.getData('text/plain'));
        if (id) addToCart(id);
    });

    document.getElementById('btn-checkout').addEventListener('click', () => {
        const cartItems = CATALOG.filter(i => appState.cart.includes(i.id));
        const total = cartItems.reduce((acc, i) => acc + i.price, 0);
        if (total === 0) return;

        if (appState.credits >= total) {
            appState.credits -= total;
            appState.acquired.push(...appState.cart);
            addXP(total);
            appState.cart = [];
            notify("Installation terminée. Fichiers débloqués.");
            saveState();
        } else {
            notify("ERREUR : CRÉDITS INSUFFISANTS", "error");
        }
    });

    window.openBuyModal = (id) => {
        pendingBuyId = id;
        const item = CATALOG.find(i => i.id === id);
        document.getElementById('modal-item-name').textContent = item.name;
        document.getElementById('modal-item-price').textContent = item.price;
        dom.modal.style.display = 'flex';
    };

    dom.No.addEventListener('click', () => dom.modal.style.display = 'none');
    dom.Yes.addEventListener('click', () => {
        const item = CATALOG.find(i => i.id === pendingBuyId);
        if (appState.credits >= item.price) {
            appState.credits -= item.price;
            appState.acquired.push(item.id);
            appState.cart = appState.cart.filter(x => x !== item.id);
            addXP(item.price);
            notify(`${item.name} installé avec succès.`);
            dom.modal.style.display = 'none';
            saveState();
        } else {
            dom.modal.style.display = 'none';
            notify("FONDS INSUFFISANTS", "error");
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        if (confirm("RESET SYSTEM?")) {
            localStorage.removeItem('lennyShopState');
            location.reload();
        }
    });

    document.getElementById('admin').addEventListener('click', () => {
        const pwd = prompt("ENTER ADMIN PASSWORD:");
        if (pwd) {appState.credits = 99999; appState.level = 10; appState.xp = 0; notify("ADMIN ACCESS GRANTED. UNLIMITED POWER.", "success"); saveState();}
    });

    document.getElementById('btn-produce').addEventListener('click', (e) => {
                const btn = e.target;
                const hours = parseInt(document.getElementById('work-time').value) || 1;
                const creditGain = hours * 50;
                const xpGain = hours * 10;
                btn.disabled = true;
                btn.textContent = "CALCUL EN COURS...";
                setTimeout(() => {
                    appState.credits += creditGain;
                    addXP(xpGain);
                    btn.disabled = false;
                    btn.textContent = "Lancer le Minage";
                    notify(`Minage terminé : +${creditGain} CR | +${xpGain} XP`);
                    saveState();
                }, 3000);
            });

    function scheduleBonus() {
        setTimeout(spawnBonusTrigger, Math.random() * 30000 + 20000);
    }

    function spawnBonusTrigger() {
        const el = document.createElement('div');
        el.className = 'bonus-entity';
        el.textContent = "!";
        el.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        el.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        el.onclick = () => {
            el.remove();
            startHackingGame();
        };
        document.body.appendChild(el);
        setTimeout(() => {
            if (el.parentElement) el.remove();
            scheduleBonus();
        }, 5000);
    }

    function startHackingGame() {
        dom.hackGame.style.display = 'flex';
        dom.hackGrid.innerHTML = '';
        let score = 0;
        let timeLeft = 5.00;
        const totalTargets = 5;
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.onclick = () => {
                if (cell.classList.contains('target')) {
                    cell.classList.remove('target');
                    cell.style.backgroundColor = 'black';
                    score++;
                    if (score === totalTargets) endGame(true);
                }
            };
            dom.hackGrid.appendChild(cell);
        }

        let targets = [];
        while (targets.length < totalTargets) {
            let r = Math.floor(Math.random() * 25);
            if (!targets.includes(r)) targets.push(r);
        }
        targets.forEach(t => dom.hackGrid.children[t].classList.add('target'));

        const interval = setInterval(() => {
            timeLeft -= 0.1;
            dom.hackTimer.textContent = timeLeft.toFixed(2);
            if (timeLeft <= 0) {
                clearInterval(interval);
                endGame(false);
            }
            if (dom.hackGame.style.display === 'none') clearInterval(interval);
        }, 100);

        function endGame(win) {
            clearInterval(interval);
            dom.hackGame.style.display = 'none';
            if (win) {
                const creditGain = 200;
                const xpGain = 100;
                appState.credits += creditGain;
                addXP(xpGain);
                notify(`PIRATAGE RÉUSSI : +${creditGain} CR | +${xpGain} XP`, 'success');
                saveState();
            } else {
                notify("ÉCHEC DU PIRATAGE", "error");
            }
            scheduleBonus();
        }
    }
    render();
    scheduleBonus();
});