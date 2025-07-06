const API_KEY = 'd81ce92c1bcd4d74bba38ee005e26d8c'; 
const BASE_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

const carouselInner = document.getElementById('carouselInner');
let currentSlide = 0; 

let y = 1;
async function fetchGames(page = 1, pageSize = 20, totalPages = y) {
  try {
      let allGames = [];
      for (let i = 1; i <= totalPages; i++) {
          const response = await fetch(`${BASE_URL}&page=${i}&page_size=${pageSize}`);
          const data = await response.json();   
          allGames = allGames.concat(data.results);
      }
      displayGames(allGames);
  } catch (error) {
      console.error('Error fetching game data:', error);
  }
}

function displayGames(games) {
  let x = Math.floor(Math.random() * (20*y+6));

  
    games.slice(x-6, x).forEach((game, index) => { 
        const gameSlide = document.createElement('div');
        gameSlide.classList.add('carousel-item');
        if (index === 0) gameSlide.classList.add('active'); 

        gameSlide.innerHTML = `
            <a href="./detail.html?id=${game.id}" target="_blank" class="carousel-link">
                <div class="carousel-content">
                    <img src="${game.background_image}" alt="${game.name}">
                    <div class="carousel-text"> 
                        <h3>${game.name}</h3>
                        <p>Tags: ${game.tags.map(tag => tag.name).slice(0, 3).join(', ') || 'No tags available'}</p>
                    </div>
                </div>
            </a>
        `

        carouselInner.appendChild(gameSlide);
    });
    copyGames=games;
    copyGames.splice(x-6, 6);
    copyGames.forEach((game, index) => {
        const newTrending = document.getElementById('newTrending');
        newTrending.innerHTML += `
            <a href="./detail.html?id=${game.id}" target="_blank" style="text-decoration: none;">
                <div class="trending-game">
                    <div class="">
                        <img class="trending-img" src="${game.background_image}" alt="${game.name}">
                    </div>
                    <div class="trending-text">
                        <h3>${game.name}</h3>
                    
                        <p>Tags: ${game.tags.map(tag => tag.name).slice(0, 5).join(', ') || 'No tags available'}</p>
                    
                        <p>${game.released}</p>
                    </div>
                </div>
            </a>`;
});}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-item');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}


fetchGames();


