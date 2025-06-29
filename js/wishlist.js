const API_KEY = 'd81ce92c1bcd4d74bba38ee005e26d8c'; // Replace with your RAWG API Key
const BASE_URL = `https://api.rawg.io/api/games`;

async function fetchGameDetails(gameId) {
    const response = await fetch(`${BASE_URL}/${gameId}?key=${API_KEY}`);
    const data = await response.json();
    return data;
}

function getUserName() {
    const userName = localStorage.getItem("userName");
    return userName;
  }
async function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlistContainer');
    wishlistContainer.innerHTML = '';

    firebase.auth().onAuthStateChanged(async function (user) {
    if (!user) {
      alert("Please login to add game to wishlist");
      return;
    }

    // Get wishlist from Firestore
    try {
        const userDoc = await db.collection("users").where("email", "==", user.email).get();
        if (userDoc.empty) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }
        const userData = userDoc.docs[0].data();
        const wishlist = userData.wishlist || [];

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        for (const gameId of wishlist) {
            const game = await fetchGameDetails(gameId);

            const gameElement = document.createElement('div');
            gameElement.classList.add('wishlist-game');
            gameElement.innerHTML = ` 
            <div class="result">           
                        <a class="left" href="./detail.html?id=${game.id}" target="_blank" style="text-decoration: none;">
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
                        </a>
                        <button class="remove-btn btn btn-danger" onclick="removeFromWishlist(${game.id})">Remove</button>
            </div>
                        `;

            wishlistContainer.appendChild(gameElement);
        }
    } catch (error) {
        wishlistContainer.innerHTML = '<p>Error loading wishlist.</p>';
        console.error(error);
    }
})
}

function removeFromWishlist(gameId) {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (!user) {
            alert("Please login to remove game from wishlist");
            return;
        }
        try {
            const userDoc = await db.collection("users").where("email", "==", user.email).get();
            if (userDoc.empty) {
                alert("User not found.");
                return;
            }
            const userData = userDoc.docs[0];
            const wishlist = userData.data().wishlist || [];
            const updatedWishlist = wishlist.filter(id => String(id) !== String(gameId));

            await db.collection("users").doc(userData.id).update({
                wishlist: updatedWishlist
            });
            alert("Game removed from wishlist successfully.");
            displayWishlist(); // Refresh the wishlist display
        } catch (error) {
            console.error("Error removing game from wishlist:", error);
            alert("Error removing game from wishlist.");
        }
    });
}

document.addEventListener('DOMContentLoaded', displayWishlist);

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