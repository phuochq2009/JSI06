function validateEmail(email) {
  return email.includes("@");
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
    alert(
      "Password must be at least 6 characters long and contain uppercase letters, lowercase letters, and numbers."
    );
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(emailData, passwordData)
    .then((userCredential) => {
      alert("Log In Successfully, Welcome: " + userCredential.user.email);
      const isLogin = true;
      localStorage.setItem("isLogin", isLogin);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          db.collection("users")
            .where("email", "==", user.email)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                localStorage.setItem("username", userData.username);
                localStorage.setItem("email", userData.email);
                if (userCredential.user.email === "admin2k9@gmail.com") {
                  setTimeout(() => {
                    location.href = "admin.html";
                  }, 2000);
                } else {
                  setTimeout(() => {
                    location.href = "index.html";
                  }, 2000);
                }
              }
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        }
      });
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        alert("Email not found. Please check your email or sign up.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Log In Error: " + error.message);
      }
    });
}



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
