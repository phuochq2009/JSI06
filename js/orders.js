displayOrders();

function displayOrders() {
  const ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = "Loading...";

  db.collection("orders")
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        ordersContainer.innerHTML = "<p>No orders found.</p>";
        return;
      }
      ordersContainer.innerHTML = "";

      
      const orderPromises = [];

      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        let totalPrice = 0;
        const gameIds = orderData.games || [];
        const gameHtmlArr = new Array(gameIds.length);

        
        const gamePromises = gameIds.map((gameId, idx) => {
          return db
            .collection("products")
            .doc(gameId)
            .get()
            .then((gameDoc) => {
              if (gameDoc.exists) {
                const gameData = gameDoc.data();
                totalPrice += parseFloat(gameData.price) || 0;
                gameHtmlArr[idx] = `
                  <div class="result">
                    <div class="result-game">
                      <div>
                        <img class="result-img" src="${gameData.image || ""}" alt="Image not found">
                      </div>
                      <div class="result-text">
                        <h4>${gameData.name}</h4>
                        <p>Tags: ${gameData.tags || "No tags available"}</p>
                        <p>${gameData.releaseDate || ""}</p>
                      </div>
                      <div class="result-price">
                        <p>Price: $${gameData.price || "0.00"}</p>
                      </div>
                    </div>
                  </div>
                `;
              } else {
                gameHtmlArr[idx] = `<div class="result"><p>Game not found (ID: ${gameId})</p></div>`;
              }
            });
        });

        
        orderPromises.push(
          Promise.all(gamePromises).then(() => {
            return `
              <h4>User Email: ${orderData.email}</h4>
              ${gameHtmlArr.join("")}
              <p>Total Price: $${totalPrice.toFixed(2)}</p>
              <p>Order Date: ${
                orderData.createdAt && orderData.createdAt.toDate
                  ? orderData.createdAt.toDate().toLocaleString()
                  : "N/A"
              }</p>
              <hr>
            `;
          })
        );
      });

      Promise.all(orderPromises).then((ordersHtmlArr) => {
        ordersContainer.innerHTML = ordersHtmlArr.join("");
      });
    })
    .catch((error) => {
      console.error("Error fetching orders: ", error);
      ordersContainer.innerHTML = "<p>Error fetching orders.</p>";
    });
}

function displayBuyChart() {
  const buyChartContainer = document.getElementById("buyChartContainer");
  buyChartContainer.innerHTML = "Loading...";
  db.collection("history")
    .doc("purchase data")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        
        const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
        const nameList = entries.map(([name]) => name);
        const valueList = entries.map(([, value]) => value);
        
        const buyChart = document.getElementById("buyChartContainer").getContext("2d");
        buyChartContainer.innerHTML = ""; 
        const length = nameList.length;
        const colors = [];
        for (let i = 0; i < length; i++) {
          colors.push(dynamicColors());
        }
        const myChart = new Chart(buyChart, {
          type: "bar", // You can use 'line', 'pie', 'doughnut', etc.
          data: {
            labels: nameList,
            datasets: [
              {
                label: "# of Buyers",
                data: valueList,
                backgroundColor: colors,
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
}

displayBuyChart();


function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      
      console.log("Sign-out successful.");
      alert("You have signed out successfully!");
    })
    .catch((error) => {
      
      console.log("An error happened:", error);
      alert("Error during sign out: " + error.message);
    });
}



function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
}