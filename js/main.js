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
// search game
// async function searchGameByName(gameName) {
//     const searchUrl = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(gameName)}`;
//     try {
//         const response = await fetch(searchUrl);
//         const data = await response.json();
//         if (data.results && data.results.length > 0) {
//             const gameId = data.results[0].id;
//             getGameDetails(gameId);
//         } else {
//             console.log('Game not found');
//         }
//     } catch (error) {
//         console.error('Error searching for game:', error);
//     }
// }


function checkLoginStatus() {
    const textt = document.getElementById('textt'); 
    firebase.auth().onAuthStateChanged(function(user) {
      
        if (user) {
            db.collection("users").where("email", "==", user.email)
            .get()
            .then((querySnapshot) => {
              console.log("Query Snapshot:", querySnapshot);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    
                    textt.innerHTML = `
                        <div class="dropdown">
                            <p class="nav-link">
                                ${userData.username} <i class="fa-solid fa-caret-down">
                                    <button class="drop-content" onclick="logout()">Log Out</button>
                                </i>
                            </p>
                        </div>
                    `;
                } else {
                    textt.innerHTML = `
                        <div class="dropdown">
                            <p class="nav-link">
                                ${user.email} <i class="fa-solid fa-caret-down">
                                    <button class="drop-content" onclick="logout()">Log Out</button>
                                </i>
                            </p>
                        </div>
                    `;
                }
                console.log("User is signed in:", user.email);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                textt.innerHTML = `<a class="nav-link" href="login.html">Log in</a>`;
            });
        } else {
            textt.innerHTML = `<a class="nav-link" href="login.html">Log in</a>`;
            console.log("No user is signed in.");
        }
    });
}

checkLoginStatus();
  
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