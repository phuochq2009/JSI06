
function validateEmail(email) {
    return email.includes('@');
}

function validatePassword(password) {
    return (
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
    );
}
document.getElementById("loginForm").addEventListener("submit", login);

function login(event) {
    event.preventDefault();
    let emailData = document.getElementById("email").value.trim();
    let passwordData = document.getElementById("password").value;
    if (emailData === "" || passwordData === "") {
      alert("Please fill in all fields");
      return;
    }
    if (!validateEmail(emailData)) {
        alert("Please enter a valid email address containing '@'");
        return;
    }
    if (!validatePassword(passwordData)) {
        alert("Password must be at least 6 characters long and contain uppercase letters, lowercase letters, and numbers.");
        return;
    }

    firebase.auth().signInWithEmailAndPassword(emailData, passwordData)
        .then(userCredential => {
            alert("Log In Successfully, Welcome: " + userCredential.user.email);
            setTimeout(() => {
                location.href = "index.html";
            }, 2000);
        })
            .catch(error => {
            if (error.code === "auth/user-not-found") {
                alert("Email not found. Please check your email or sign up.");
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password. Please try again.");
            } else {
                alert("Log In Error: " + error.message);
            }
        });
};
  
  



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

