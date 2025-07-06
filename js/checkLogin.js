function checkLoginStatus() {
  const textt = document.getElementById("textt");
  const isLogin = localStorage.getItem("isLogin");
  const username = localStorage.getItem("username");
  if (isLogin === "true") {
    textt.innerHTML = `
                        <div class="dropdown">
                            <p class="nav-link">
                                ${username} <i class="fa-solid fa-caret-down">
                                    <button class="drop-content" onclick="logout()">Log Out</button>
                                </i>
                            </p>
                        </div>
                    `;
  } else {
    textt.innerHTML = `<a class="nav-link" href="login.html">Log in</a>`;
  }
}

checkLoginStatus();

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.setItem("isLogin", false);
      alert("You have signed out successfully!");
    })
    .catch((error) => {
      // An error happened.
      console.log("An error happened:", error);
      alert("Error during sign out: " + error.message);
    });
}