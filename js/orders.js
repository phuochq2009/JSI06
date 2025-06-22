displayOrders();

function displayOrders() {
    const ordersContainer = document.getElementById("ordersContainer");
    ordersContainer.innerHTML = "Loading...";

    db.collection("orders")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                ordersContainer.innerHTML = "<p>No orders found.</p>";
                return;
            }
            ordersContainer.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                let totalPrice = 0;
                let gamesHtml = "";

                const gamePromises = (orderData.games || []).map((gameId) => {
                    return db.collection("products").doc(gameId).get().then((gameDoc) => {
                        if (gameDoc.exists) {
                            const gameData = gameDoc.data();
                            totalPrice += parseFloat(gameData.price) || 0;
                            gamesHtml += ` 
                        <div class="result">           
                            <div class="result-game">
                              <div>
                                <img class="result-img" src="${gameData.image || ""}" alt="Image not found">
                              </div>
                              <div class="result-text">
                                <h4>${gameData.name}</h3>
                                <p>Tags: ${gameData.tags || "No tags available"}</p>
                                <p>${gameData.releaseDate || ""}</p>
                              </div>
                              <div class="result-price">
                                <p>Price: $${gameData.price || "0.00"}</p>
                              </div>
                            </div>
                          </a>
                        </div>
                      ` ;
                        }
                    });
                });

                Promise.all(gamePromises).then(() => {
                    ordersContainer.innerHTML += `
                        <h4>User Email: ${orderData.email}</h3>
                        ${gamesHtml}
                        <p>Total Price: $${totalPrice.toFixed(2)}</p>
                        <p>Order Date: ${orderData.createdAt && orderData.createdAt.toDate ? orderData.createdAt.toDate().toLocaleString() : "N/A"} 
                        <hr>
                    `;
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching orders: ", error);
            ordersContainer.innerHTML = "<p>Error fetching orders.</p>";
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

          if (user.email === "admin2k9@gmail.com") {
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
            location.href = "index.html";
          }
          console.log("User is signed in:", user.email);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
          textt.innerHTML = `<a class="nav-link" href="login.html">Log in</a>`;
        });
    }  else {
      textt.innerHTML = `<a class="nav-link" href="login.html">Log in</a>`;
      console.log("No user is signed in.");
      location.href = "login.html";
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

