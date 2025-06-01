const API_KEY = "d81ce92c1bcd4d74bba38ee005e26d8c"; // Replace with your RAWG API Key
const BASE_URL = `https://api.rawg.io/api/games`;
const id = new URLSearchParams(window.location.search).get("id"); // Replace with the specific game slug
let currentScreenshot = 0; // Initialize currentScreenshot
console.log(id);
// Fetch game details from RAWG API
async function fetchGameDetails() {
  try {
    const response2 = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
    const data2 = await response2.json();
    displayGameDetail(data2);
  } catch (error) {
    console.error("Error fetching game details:", error);
  }
}

function displayGameDetail(data2) {
  const game = data2;
  console.log(game);
  const firstDetail = document.getElementById("firstDetail");
  let minimum;
  if (
    game.platforms[0].requirements &&
    game.platforms[0].requirements.minimum
  ) {
    minimum = game.platforms[0].requirements.minimum.replace("Minimum:", "");
  } else {
    minimum = "No system requirements available";
  }

  firstDetail.innerHTML = `
                <h2 class="game-header">${game.name}</h2>
                <h3>About</h2>
                ${game.description} 
                <div class="row">
                    <div class="col-6">
                        <h4>Platforms</h2>
                        <p>${game.platforms
                          .map((platform) => platform.platform.name)
                          .join(", ")}</p>
                    </div>
                    <div class="col-6">
                        <h4>Metascore</h2>
                        <p>${game.metacritic || "No metascrore available"}</p>
                    </div>
                    <div class="col-6">
                        <h4>Genres</h2>
                        <p>${game.genres
                          .map((genre) => genre.name)
                          .join(", ")}</p>
                    </div>
                    <div class="col-6">
                        <h4>Release date</h2>
                        <p>${game.released}</p>
                    </div>
                    <div class="col-6">
                        <h4>Developer</h2>
                        <p>${game.developers
                          .map((developer) => developer.name)
                          .join(", ")}</p>
                    </div>
                    <div class="col-6">
                        <h4>Publisher</h2>
                        <p>${game.publishers
                          .map((publisher) => publisher.name)
                          .join(", ")}</p>
                    </div>
                    <div class="col-6">
                        <h4>Age rating</h2>
                        <p>${
                          game.esrb_rating.name || "No age rating available"
                        }</p>
                    </div>
                    <div class="col-12">
                        <h4>Tags</h2>
                        <p>${
                          game.tags.map((tag) => tag.name).join(", ") ||
                          "No tags available"
                        }</p>
                    </div>
                    <div class="col-12">
                        <h4>Website</h2>
                        <p><a target="blank" class="link" href="${
                          game.website
                        }">${game.website}</a></p>
                    </div>
                </div>
                <h3>System Requirements</h3>
                <h4>Minimum</h4>
                <p>${minimum}</p>
                
                `;
  const secondDetail = document.getElementById("secondDetail");
  secondDetail.innerHTML = `
                <div class="btn-link link wishlist-button" onclick="addWish()">Add to wishlist</div>
                <h3>Where to buy</h3>
                <div class="row">${game.stores
                  .map(
                    (st) =>
                      `<div class="col-6 btn-link-container  "><a target="blank" class="link btn-link" href="http://${st.store.domain}">${st.store.name}</a></div>`
                  )
                  .join("")}</div>`;

  const gameDetail = document.getElementById("gameDetail");

  gameDetail.innerHTML = `
                    <div class="carousel">
                        <div id="carouselInner" class="carousel-inner">
                            <div class="carousel-item active ">
                                    <img src="${game.background_image}" alt="Screenshot">
                                </div>
                            <div class="carousel-item">
                                    <img src="${game.background_image_additional}" alt="Screenshot">
                                </div>
                            
                        </div>
                    </div>
                    <button class="carousel-button prev" onclick="changeScreenshot(-1)">
                ❮
              </button>
              <button class="carousel-button next" onclick="changeScreenshot(1)">
                ❯
              </button>
                    
                `;
}
// Change screenshot
function changeScreenshot(direction) {
  const screenshots = document.querySelectorAll(".carousel-item");
  if (screenshots.length === 0) return; // Handle case where there are no screenshots
  screenshots[currentScreenshot].classList.remove("active");
  currentScreenshot =
    (currentScreenshot + direction + screenshots.length) % screenshots.length;
  screenshots[currentScreenshot].classList.add("active");
}

// Example usage
fetchGameDetails();


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

function getUserName() {
  const userName = localStorage.getItem("userName");
  return userName;
}


function addWish() {
  const isLogin = localStorage.getItem("isLogin");
  if (!isLogin) {
    alert("Please login to add game to wishlist");
    return;
  }

  const userName = getUserName();
  let wishlistKey = `wishlist-${userName}`;
  let wishlistLocalStorage = localStorage.getItem(wishlistKey) || [];
  
  if (wishlistLocalStorage.length != 0) {
    const wishlist = JSON.parse(wishlistLocalStorage);
    for (let i = 0; i < wishlist.length; i++) {
      if (wishlist[i] === id) {
        alert("Game already in wishlist");
        return;
      }
    }
    wishlist.push(id);
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    alert("Game added to wishlist");
  }
  else {
    localStorage.setItem(wishlistKey, JSON.stringify([id]));
    alert("Game added to wishlist");
  }
}
