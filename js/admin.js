

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
  const price = document.getElementById("productPrice").value;
  const systemRequirements = document.getElementById(
    "productSystemRequirements"
  ).value;
  db.collection("products")
    .add({
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
      price: price,
      systemRequirements: systemRequirements,
    })
    .then(() => {
      console.log("Document successfully written!");
      alert("Product added successfully!");
      document.getElementById("addForm").reset();
      displayProducts();
      db.collection("products")
        .where("name", "==", name)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
        console.log("No matching products found.");
          } else {
        querySnapshot.forEach((doc) => {
          db.collection("history").doc("purchase data").update({
            [name]: 0,
          });
        });
          }
        });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      alert("Error adding product: " + error.message);
    });
}
function displayProducts() {
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "";
  db.collection("products")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        productContainer.innerHTML = "<p>No products found!</p>";
        return;
      }
      querySnapshot.forEach((doc) => {
        const game = doc.data();
        const gameElement = document.createElement("div");
        gameElement.innerHTML = ` 
          <div class="result">           
            <div class="result-game">
              <div>
                <img class="result-img" src="${
                  game.image || ""
                }" alt="Image not found">
              </div>
              <div class="result-text">
                <h3>${game.name || ""}</h3>
                <p>Tags: ${game.tags || "No tags available"}</p>
                <p>${game.releaseDate || ""}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${
                  doc.id
                }')">Delete</button>
                <button class="btn btn-warning btn-sm" onclick="editProduct('${
                  doc.id
                }')">Edit</button>
              </div>
              <div class="result-price">
                <p>Price: $${game.price || "0.00"}</p>
              </div>
            </div>
          </div>
        `;
        productContainer.appendChild(gameElement);
      });
    })
    .catch((error) => {
      console.log("Error getting documents:", error);
    });
}

displayProducts();

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    db.collection("products")
      .doc(id)
      .delete()
      .then(() => {
        alert("Product deleted!");
        displayProducts();
      })
      .catch((error) => {
        alert("Error deleting product: " + error.message);
      });
  }
}



function editProduct(id) {
  const editsForm = document.getElementById("editsForm");
  editsForm.classList.remove("hide");
  const addsForm = document.getElementById("addsForm");
  addsForm.classList.add("hide");
  db.collection("products")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const game = doc.data();
        document.getElementById("productId").innerHTML = id;
        document.getElementById("productNameEdit").value = game.name || "";
        document.getElementById("productAboutEdit").value = game.about || "";
        document.getElementById("imgLinkEdit").value = game.image || "";
        document.getElementById("productPlatformsEdit").value =
          game.platforms || "";
        document.getElementById("productWebsiteEdit").value =
          game.website || "";
        document.getElementById("productAgeRatingEdit").value =
          game.ageRating || "";
        document.getElementById("productMetaScoreEdit").value =
          game.metaScore || "";
        document.getElementById("productGenresEdit").value = game.genres || "";
        document.getElementById("productReleaseDateEdit").value =
          game.releaseDate || "";
        document.getElementById("productDevelopersEdit").value =
          game.developers || "";
        document.getElementById("productPublishersEdit").value =
          game.publishers || "";
        document.getElementById("productTagsEdit").value = game.tags || "";
        document.getElementById("productSystemRequirementsEdit").value =
          game.systemRequirements || "";
        document.getElementById("productPriceEdit").value = game.price || "";
      } else {
        alert("No such product!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
      alert("Error retrieving product: " + error.message);
    });
}

document.getElementById("editForm").addEventListener("submit", edit);
function edit(e) {
  e.preventDefault();
  const id = document.getElementById("productId").innerHTML;
  const name = document.getElementById("productNameEdit").value;
  const about = document.getElementById("productAboutEdit").value;
  const image = document.getElementById("imgLinkEdit").value;
  const platforms = document.getElementById("productPlatformsEdit").value;
  const website = document.getElementById("productWebsiteEdit").value;
  const ageRating = document.getElementById("productAgeRatingEdit").value;
  const metaScore = document.getElementById("productMetaScoreEdit").value;
  const genres = document.getElementById("productGenresEdit").value;
  const releaseDate = document.getElementById("productReleaseDateEdit").value;
  const developers = document.getElementById("productDevelopersEdit").value;
  const publishers = document.getElementById("productPublishersEdit").value;
  const tags = document.getElementById("productTagsEdit").value;
  const price = document.getElementById("productPriceEdit").value;
  const systemRequirements = document.getElementById(
    "productSystemRequirementsEdit"
  ).value;

  db.collection("products")
    .doc(id)
    .update({
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
      systemRequirements: systemRequirements,
      price: price,
    })
    .then(() => {
      console.log("Document successfully updated!");
      alert("Product updated successfully!");
      displayProducts();
      const editsForm = document.getElementById("editsForm");
      editsForm.classList.add("hide");
      const addsForm = document.getElementById("addsForm");
      addsForm.classList.remove("hide");
      document.getElementById("editForm").reset();
      document.getElementById("productId").innerHTML = "";
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      alert("Error updating product: " + error.message);
    });
}
