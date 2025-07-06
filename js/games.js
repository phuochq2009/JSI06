const API_KEY = 'd81ce92c1bcd4d74bba38ee005e26d8c'; // Replace with your RAWG API Key
const BASE_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;
const y=1;

async function displayGames(page = 1, pageSize = 20, totalPages = y) {
    try {
        let allGames = [];
        for (let i = 1; i <= totalPages; i++) {
            const response = await fetch(`${BASE_URL}&page=${i}&page_size=${pageSize}`);
            const data = await response.json();
            allGames = allGames.concat(data.results);
        }
        allGames.forEach((game, index) => {
            const result = document.getElementById('result');
            
            result.innerHTML += `
                <a href="./detail.html?id=${game.id}" target="_blank" style="text-decoration: none;">
                    <div class="result-game">
                        <div class="">
                            <img class="result-img" src="${game.background_image}" alt="Image not found">
                        </div>
                        <div class="result-text">
                            <h3>${game.name}</h3>
                        
                            <p>Tags: ${game.tags.map(tag => tag.name).slice(0, 5).join(', ') || 'No tags available'}</p>
                        
                            <p>${game.released}</p>
                        </div>
                    </div>
                </a>`;
    });
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
  }
  displayGames();
// search game
function searchGames() {
    gameName = document.getElementById('searchInput').value;
    searchGameByName(gameName);
}
async function searchGameByName(gameName) {
    const searchUrl = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(gameName)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const games = data.results;
            result.innerHTML = '';
            games.forEach((game, index) => {
                const result = document.getElementById('result');
                
                result.innerHTML += `
                    <a href="./detail.html?id=${game.id}" target="_blank" style="text-decoration: none;">
                        <div class="result-game">
                            <div class="">
                                <img class="result-img" src="${game.background_image}" alt="Image not found">
                            </div>
                            <div class="result-text">
                                <h3>${game.name}</h3>
                            
                                <p>Tags: ${game.tags.map(tag => tag.name).slice(0, 5).join(', ') || 'No tags available'}</p>
                            
                                <p>${game.released}</p>
                            </div>
                        </div>
                    </a>`;
        });
        } else {

            result.innerHTML = '<p>No games found.</p>';
        }
    } catch (error) {
        console.error('Error searching for game:', error);
    }
}



  
  function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("Sign-out successful.");
        alert("You have signed out successfully!");
    }).catch((error) => {
        // An error happened.
        console.log("An error happened:", error);
        alert("Error during sign out: " + error.message);
    });
  }