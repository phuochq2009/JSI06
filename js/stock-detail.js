const id = new URLSearchParams(window.location.search).get("id");
function displayGameDetail(id) {
  db.collection("products")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        document.getElementById("firstDetail").innerHTML = "<p>Game not found.</p>";
        return;
      }
      const game = doc.data();
      const firstDetail = document.getElementById("firstDetail");
      firstDetail.innerHTML = `
        <h2 class="game-header">${game.name}</h2>
        <h3>About</h3>
        ${game.about} 
        <div class="row">
            <div class="col-6">
                <h4>Platforms</h4>
                <p>${game.platforms}</p>
            </div>
            <div class="col-6">
                <h4>Metascore</h4>
                <p>${game.metaScore}</p>
            </div>
            <div class="col-6">
                <h4>Genres</h4>
                <p>${game.genres}</p>
            </div>
            <div class="col-6">
                <h4>Release date</h4>
                <p>${game.releaseDate}</p>
            </div>
            <div class="col-6">
                <h4>Developer</h4>
                <p>${game.developers}</p>
            </div>
            <div class="col-6">
                <h4>Publisher</h4>
                <p>${game.publishers}</p>
            </div>
            <div class="col-6">
                <h4>Age rating</h4>
                <p>${game.ageRating}</p>
            </div>
            <div class="col-12">
                <h4>Tags</h4>
                <p>${game.tags}</p>
            </div>
            <div class="col-12">
                <h4>Website</h4>
                <p><a target="blank" class="link" href="${game.website}">${game.website}</a></p>
            </div>
        </div>
        <h3>System Requirements</h3>
        <h4>Minimum</h4>
        <p>${game.systemRequirements}</p>
      `;
      const secondDetail = document.getElementById("secondDetail");
      secondDetail.innerHTML = `    
        <div class="game-price">
            <p class="game-price-text">Price: $${game.price}</p>
        </div>
        <div class="btn-link link wishlist-button" onclick="addCart()">Add to shopping cart</div>
      `;
      const gameDetail = document.getElementById("gameDetail");
      gameDetail.innerHTML = `
        <img class="game-img" src="${game.image}" alt="Image not found">   
      `;
    })
    .catch((error) => {
      document.getElementById("firstDetail").innerHTML = "<p>Error loading game: " + error.message + "</p>";
    });
}

displayGameDetail(id);





  
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



function addCart() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection("users").where("email", "==", user.email)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userDocId = querySnapshot.docs[0].id;
                    const userData = querySnapshot.docs[0].data();
                    
                    if (userData.cart && userData.cart.includes(id)) {
                        alert("This game is already in your cart.");
                        return;
                    }
                    
                    if (userData.history && userData.history.includes(id)) {
                        alert("This game is already in your history.");
                        return;
                    }
                    
                    db.collection("users").doc(userDocId).update({
                        cart: firebase.firestore.FieldValue.arrayUnion(id)
                    })
                    .then(() => {
                        alert("Game added to cart successfully!");
                    })
                    .catch((error) => {
                        console.error("Error adding game to cart: ", error);
                        alert("Error adding game to cart: " + error.message);
                    });
                } else {
                    alert("User not found in database.");
                }
            })
            .catch((error) => {
                console.error("Error finding user: ", error);
                alert("Error finding user: " + error.message);
            });
        } else {
            alert("Please login to add game to cart");
            return;
        }
    });
}
document.getElementById("commentForm").addEventListener("submit", comment);

    function comment(event) {
        event.preventDefault();
        const commentText = document.getElementById("comment").value;
        const commendation = document.getElementsByName("recommendation");
        let selectedCommendation = "";
        if (commendation[0].checked) {
            selectedCommendation = "recommended";
        }
        else if (commendation[1].checked) {
            selectedCommendation = "not-recommended";
        }
        else {
            if (!selectedCommendation) {    
            alert("Please select a commendation.");
            return;
        }  
        }
        if (selectedCommendation === "recommended") {
            selectedCommendation = "<i class='fas fa-thumbs-up'></i> Recommended";
        } else if (selectedCommendation === "not-recommended") {
            selectedCommendation = "<i class='fas fa-thumbs-down'></i> Not Recommended";
        }                 
        if (!commentText) {
            alert("Please enter a comment.");
            return;
        }
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                db.collection("users").where("email", "==", user.email)
                .get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const username = querySnapshot.docs[0].data().username;
                        db.collection("comments").add({
                            gameId: id,
                            username: username,
                            comment: commentText,
                            commendation: selectedCommendation,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                            alert("Comment added successfully!");
                            document.getElementById("comment").value = ""; 
                            displayComments(); 
                        })
                        .catch((error) => {
                            console.error("Error adding comment: ", error);
                            alert("Error adding comment: " + error.message);
                        });
                    }
                    else {
                        alert("User not found in database.");
                    }
                })
                .catch((error) => {
                    console.error("Error finding user: ", error);
                    alert("Error finding user: " + error.message);
                });
            } else {
                alert("Please login to comment on this game.");
                return;
            }
        })
    }
    function displayComments() {
    db.collection("comments")
      .where("gameId", "==", id)
      .orderBy("timestamp", "desc") 
      .get()
      .then((querySnapshot) => {
        const commentsContainer = document.getElementById("commentsContainer");
        commentsContainer.innerHTML = "";
        if (querySnapshot.empty) {
            commentsContainer.innerHTML = "<p>No comments yet.</p>";
            return;
        }
        querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            commentsContainer.innerHTML += `
                <div class="comment">
                    <h3 class="commendation">${commentData.commendation}</h3>
                    <h3>by ${commentData.username}</h3>
                    <p class="timestamp">Comment in: ${
                      commentData.timestamp && commentData.timestamp.toDate
                        ? commentData.timestamp.toDate().toLocaleString()
                        : "N/A"
                    } </p>
                    <p>${commentData.comment}</p>
                </div>
            `;
        });
      })
      .catch((error) => {
        console.error("Error fetching comments: ", error);
        const commentsContainer = document.getElementById("commentsContainer");
        commentsContainer.innerHTML = "<p>Error loading comments: " + error.message + "</p>";
      });
}
    displayComments();
