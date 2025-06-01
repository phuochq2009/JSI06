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

document.getElementById("addForm").addEventListener("submit", add);

function add(e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const about = document.getElementById("productAbout").value;
    const image = document.getElementById("imgLink").value;
    const platforms = document.getElementById("productPlatforms").value;
    const website = document.getElementById("productWebsite").value;
    const ageRating = document.getElementById("productAgeRating").value;
    const metaScore = document.getElementById("productMetaScore").value;
    const genres = document.getElementById("productGenres").value;
    const releaseDate = document.getElementById("productReleaseDate").value;
    const developers = document.getElementById("productDevelopers").value;
    const publishers = document.getElementById("productPublishers").value;
    const tags = document.getElementById("productTags").value;
    const systemRequirements = document.getElementById("productSystemRequirements").value;
    db.collection("products").add({ 
        name: name,
        about: about,
        image: image,
        platforms: platforms,
        website: website,
        ageRating: ageRating,
        metaScore: metaScore,
        genres: genres,
        releaseDate: releaseDate,
        developers: developers,
        publishers: publishers,
        tags: tags,
        systemRequirements: systemRequirements
    })
    .then(() => {
        console.log("Document successfully written!");
        alert("Product added successfully!");
        document.getElementById("addForm").reset();
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        alert("Error adding product: " + error.message);
    })
}
