let data = fetch('js/boardingData.json')
    .then(response => response.json())
    .then(data => {
        return data;
    });

let button = document.getElementById('changeThemeBtn');

button.addEventListener('click', function() {
    data.then(boardingData => {
        document.title = boardingData.title;
        document.getElementById('styleName').textContent = boardingData.header;
        document.getElementById('heroTitle').textContent = boardingData.hero.headline;
        document.getElementById('heroDesc').textContent = boardingData.hero.description;
        document.getElementById('heroSection').style.setProperty('background-image', `url('${boardingData.hero.image}')`);
        document.getElementById('sec1Title').textContent = boardingData.sections.overview.title;
        document.getElementById('sec1Subtitle').textContent = boardingData.sections.overview.subtitle;
        document.getElementById('sec1Grid').textContent = boardingData.sections.overview.cards.title;
        
        const overviewCards = document.getElementById('sec1Grid');
        overviewCards.innerHTML = '';
        boardingData.sections.overview.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <h3>${card.title}</h3>
                <p>${card.description}</p>
            `;
            overviewCards.appendChild(cardElement);
        });

        const equipmentCards = document.getElementById('sec2Grid');
        equipmentCards.innerHTML = '';
        boardingData.sections.equipment.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <h3>${card.title}</h3>
                <p>${card.description}</p>
            `;
            equipmentCards.appendChild(cardElement);
        });
        
    });

});
