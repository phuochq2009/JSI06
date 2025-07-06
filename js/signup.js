
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
document.getElementById("signupForm").addEventListener("submit", signUp);

function signUp(event) {
    event.preventDefault();
    let emailData = document.getElementById("email").value.trim();
    let passwordData = document.getElementById("password").value;
    let confirmPasswordData = document.getElementById("confirmPassword").value;
    let usernameData = document.getElementById("username").value;
    if (emailData === "" || passwordData === "" || confirmPasswordData === "" || usernameData === "") {
      alert("Please fill in all fields");
      return;
    }
    if (passwordData !== confirmPasswordData) {
      alert("Password and confirm password do not match");
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

    firebase.auth().createUserWithEmailAndPassword(emailData, passwordData)
        .then(userCredential => {
            db.collection("users").add({
                email: emailData,
                username: usernameData

            })
            .then(() => {
                console.log("User data added successfully");
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
            .catch(error => {
                console.error("Error adding user data: ", error);
            });
            

        })
        .catch(error => {
            alert("Lỗi đăng ký: " + error.message);
        });
}
  
  
  
  
  
 
  
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
