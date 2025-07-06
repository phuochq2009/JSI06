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