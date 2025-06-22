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