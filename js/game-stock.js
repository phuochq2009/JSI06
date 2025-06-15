function displayGames() {
  const result = document.getElementById("result");
    result.innerHTML = "Loading...";
    db.collection("products")
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.empty) {
            result.innerHTML = "<p>No games found.</p>";
            return;
        }
        result.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const game = doc.data();
            result.innerHTML += `
            <a href="./stock-detail.html?id=${doc.id}" target="_blank" style="text-decoration: none;">
                <div class="result-game">
                <div>
                    <img class="result-img" src="${game.image || ""}" alt="Image not found">
                </div>
                <div class="result-text">
                    <h3>${game.name || ""}</h3>
                    <p>Tags: ${game.tags || "No tags available"}</p>
                    <p>${game.releaseDate || ""}</p>
                </div>
                <div class="result-price">
                <p>Price: $${game.price || "0.00"}</p>
              </div>
                </div>
            </a>
            `;
        });
    })
    .catch((error) => {
        result.innerHTML = "<p>Error loading games: " + error.message + "</p>";
    });
}
displayGames();
// search game
function removeVietnameseTones(str) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special chars (optional)
    .toLowerCase();
}

function searchGames() {
  const gameNameRaw = document.getElementById("searchInput").value.trim();
  const gameName = removeVietnameseTones(gameNameRaw);
  const result = document.getElementById("result");
  result.innerHTML = "Searching...";

  db.collection("products")
    .get()
    .then((querySnapshot) => {
      let found = false;
      result.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const game = doc.data();
        if (
          game.name &&
          removeVietnameseTones(game.name).includes(gameName)
        ) {
          found = true;
          result.innerHTML += `
            <a href="./detail.html?id=${doc.id}" target="_blank" style="text-decoration: none;">
              <div class="result-game">
                <div>
                  <img class="result-img" src="${game.image || ""}" alt="Image not found">
                </div>
                <div class="result-text">
                  <h3>${game.name || ""}</h3>
                  <p>Tags: ${game.tags || "No tags available"}</p>
                  <p>${game.releaseDate || ""}</p>
                </div>
              </div>
            </a>
          `;
        }
      });
      if (!found) {
        result.innerHTML = "<p>No games found.</p>";
      }
    })
    .catch((error) => {
      result.innerHTML = "<p>Error searching games: " + error.message + "</p>";
    });
}

function checkLoginStatus() {
  const textt = document.getElementById("textt");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      db.collection("users")
        .where("email", "==", user.email)
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
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
      alert("You have signed out successfully!");
    })
    .catch((error) => {
      // An error happened.
      console.log("An error happened:", error);
      alert("Error during sign out: " + error.message);
    });
}
