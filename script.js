document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const nameDisplay = document.getElementById('name-display');
    const imageNames = [
        'Ballerina Cappucina', 'Bananita Dolfinita', 'Blueberrinni Octopussini', 
        'Bobrelli Bananelli', 'Bobrito Bandito', 'Bombardiro Crocodilo', 
        'Boneca Ambalabu', 'Brr Brr Patapim', 'Brri Brri Bicus Dicus Bombicus', 
        'Burbaloni Lulilolli', 'Capuccino Assassino', 'Chai Maestro'
    ];
    const singleCardName = 'Sigma Boy';

    let cardsData = [];
    let flippedCards = [];
    let lockBoard = false;
    let matchedPairs = 0;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Names are in English
        speechSynthesis.speak(utterance);
    }

    function showName(name) {
        nameDisplay.textContent = name;
        nameDisplay.style.opacity = '1';
        setTimeout(() => {
            nameDisplay.style.opacity = '0';
        }, 1500);
    }

    function createGameBoard() {
        matchedPairs = 0;
        gameBoard.innerHTML = '';
        cardsData = [];
        imageNames.forEach(name => {
            cardsData.push({ name: name, image: `images/brainrot_images/${name}.jpg` });
            cardsData.push({ name: name, image: `images/brainrot_images/${name}.jpg` });
        });
        cardsData.push({ name: singleCardName, image: `images/brainrot_images/${singleCardName}.jpg`, isSingle: true });

        cardsData.sort(() => 0.5 - Math.random());

        cardsData.forEach(data => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.name = data.name;
            if (data.isSingle) {
                card.dataset.single = true;
            }

            card.innerHTML = `
                <div class="card-face card-front">
                    <img src="${data.image}" alt="${data.name}">
                </div>
                <div class="card-face card-back"></div>
            `;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped') || this === flippedCards[0]) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        } else if (this.dataset.single) {
            lockBoard = true;
            setTimeout(() => {
                this.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.name === card2.dataset.name;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        const matchedName = flippedCards[0].dataset.name;
        flippedCards.forEach(card => {
            card.classList.add('matched');
            card.removeEventListener('click', flipCard);
        });
        
        showName(matchedName);
        speak(matchedName);

        matchedPairs++;
        resetBoard();

        if (matchedPairs === imageNames.length) {
            setTimeout(() => {
                alert('You found all pairs! The game will restart.');
                createGameBoard();
            }, 2000);
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    createGameBoard();
}); 