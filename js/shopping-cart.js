function displayWishlist() {
  const wishlistContainer = document.getElementById("wishlistContainer");
  wishlistContainer.innerHTML = "";

  const email = localStorage.getItem("email");
  if (email) {
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;
          db.collection("users")
            .doc(userDocId)
            .get()
            .then((userDoc) => {
              const userData = userDoc.data();
              const gamesIdList = userData.cart || [];
              if (gamesIdList.length === 0) {
                wishlistContainer.innerHTML = "<p>Your cart is empty.</p>";
                return;
              }
              let totalPrice = 0;
              let loaded = 0;
              gamesIdList.forEach((gameId) => {
                db.collection("products")
                  .doc(gameId)
                  .get()
                  .then((doc) => {
                    loaded++;
                    if (doc.exists) {
                      const game = doc.data();
                      const price = parseFloat(game.price) || 0;
                      totalPrice += price;
                      const gameElement = document.createElement("div");
                      gameElement.classList.add("wishlist-game");
                      gameElement.innerHTML = ` 
                        <div class="result">           
                          <a class="left" href="./detail.html?id=${gameId}" target="_blank" style="text-decoration: none;">
                            <div class="result-game">
                              <div>
                                <img class="result-img" src="${game.image || ""}" alt="Image not found">
                              </div>
                              <div class="result-text">
                                <h3>${game.name}</h3>
                                <p>Tags: ${game.tags || "No tags available"}</p>
                                <p>${game.releaseDate || ""}</p>
                              </div>
                              <div class="result-price">
                                <p>Price: $${game.price || "0.00"}</p>
                              </div>
                            </div>
                          </a>
                          <button class="remove-btn btn btn-danger" onclick="removeFromWishlist('${gameId}')">Remove</button>
                        </div>
                      `;
                      wishlistContainer.appendChild(gameElement);
                    }
                    if (loaded === gamesIdList.length) {
                      const totalDiv = document.createElement("div");
                      totalDiv.className = "cart-total";
                      totalDiv.innerHTML = `<h4>Total: $${totalPrice.toFixed(2)}</h4>
                        <button class="btn btn-success" onclick="checkOut()">Checkout</button>`;
                      wishlistContainer.appendChild(totalDiv);
                    }
                  });
              });
            });
        } else {
          wishlistContainer.innerHTML = "<p>User not found in database.</p>";
        }
      })
      .catch((error) => {
        console.error("Error finding user: ", error);
        wishlistContainer.innerHTML = "<p>Error finding user: " + error.message + "</p>";
      });
  } else {
    wishlistContainer.innerHTML = "<p>Please login to view your cart.</p>";
  }
}

function removeFromWishlist(gameId) {
  const email = localStorage.getItem("email");
  if (!email) {
    alert("Please login to remove items from your cart");
    return;
  }
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        db.collection("users")
          .doc(userDocId)
          .update({
            cart: firebase.firestore.FieldValue.arrayRemove(gameId),
          })
          .then(() => {
            alert("Game removed from cart successfully!");
            displayWishlist();
          })
          .catch((error) => {
            console.error("Error removing game from cart: ", error);
            alert("Error removing game from cart: " + error.message);
          });
      } else {
        alert("User not found in database.");
      }
    })
    .catch((error) => {
      console.error("Error finding user: ", error);
      alert("Error finding user: " + error.message);
    });
}

function checkOut() {
  const email = localStorage.getItem("email");
  if (!email) {
    alert("Please login to proceed with checkout");
    return;
  }
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        db.collection("users")
          .doc(userDocId)
          .get()
          .then((userDoc) => {
            const userData = userDoc.data();
            const gamesIdList = userData.cart || [];
            if (gamesIdList.length === 0) {
              alert("Your cart is empty. Please add items to your cart before checking out.");
              return;
            }
            // history
            db.collection("users")
              .doc(userDocId)
              .update({
                history: firebase.firestore.FieldValue.arrayUnion(...gamesIdList),
              })
              .then(() => {
                // orders 
                db.collection("orders")
                  .doc(email)
                  .set(
                    {
                      games: firebase.firestore.FieldValue.arrayUnion(...gamesIdList),
                      email: email,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                  )
                  .then(() => {
                    // cart 
                    db.collection("users")
                      .doc(userDocId)
                      .update({
                        cart: [],
                      })
                      .then(() => {
                        gamesIdList.forEach((gameId) => {
                          db.collection("products")
                            .doc(gameId)
                            .get()
                            .then((doc) => {
                              if (doc.exists) {
                                const game = doc.data();
                                const gName = game.name || "Unknown Game";
                                const historyDocRef = db.collection("history").doc("purchase data");

                                db.runTransaction((transaction) => {
                                  return transaction.get(historyDocRef).then((historyDoc) => {
                                    const data = historyDoc.exists ? historyDoc.data() : {};
                                    const currentCount = data[gName] || 0;
                                    transaction.update(historyDocRef, {
                                      [gName]: currentCount + 1
                                    });
                                  });
                                }).catch((error) => {
                                  console.error("Error updating purchase count: ", error);
                                });
                              }
                            })
                            .catch((error) => {
                              console.error("Error fetching game data: ", error);
                            });
                        });
                        alert("Checkout successful! Your cart is now empty.");
                        displayWishlist();
                        displayHistory();
                      })
                      .catch((error) => {
                        console.error("Error during checkout: ", error);
                        alert("Error during checkout: " + error.message);
                      });
                  })
                  .catch((error) => {
                    console.error("Error updating orders: ", error);
                    alert("Error updating orders: " + error.message);
                  });
              })
              .catch((error) => {
                console.error("Error updating history: ", error);
                alert("Error updating history: " + error.message);
              });
          });
      } else {
        alert("User not found in database.");
      }
    })
    .catch((error) => {
      console.error("Error finding user: ", error);
      alert("Error finding user: " + error.message);
    });
}




function displayHistory() {
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";

  const email = localStorage.getItem("email");
  if (email) {
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;
          db.collection("users")
            .doc(userDocId)
            .get()
            .then((userDoc) => {
              const userData = userDoc.data();
              const historyList = userData.history || [];
              if (historyList.length === 0) {
                historyContainer.innerHTML = "<p>You have not purchased any games yet.</p>";
                return;
              }
              historyList.forEach((gameId) => {
                db.collection("products").doc(gameId).get().then((doc) => {
                  if (doc.exists) {
                    const game = doc.data();
                    const gameElement = document.createElement("div");
                    gameElement.classList.add("history-game");
                    gameElement.innerHTML = `
                      <div class="result">
                        <a class="left" href="./detail.html?id=${gameId}" target="_blank" style="text-decoration: none;">
                          <div class="result-game">
                            <div>
                              <img class="result-img" src="${game.image || ""}" alt="Image not found">
                            </div>
                            <div class="result-text">
                              <h3>${game.name}</h3>
                              <p>Tags: ${game.tags || "No tags available"}</p>
                              <p>${game.releaseDate || ""}</p>
                            </div>
                            <div class="result-price">
                              <p>Price: $${game.price || "0.00"}</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    `;
                    historyContainer.appendChild(gameElement);
                  }
                });
              });
            });
        } else {
          historyContainer.innerHTML = "<p>User not found in database.</p>";
        }
      })
      .catch((error) => {
        historyContainer.innerHTML = "<p>Error: " + error.message + "</p>";
      });
  } else {
    historyContainer.innerHTML = "<p>Please login to view your purchase history.</p>";
  }
}





displayHistory();
displayWishlist();

