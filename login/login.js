// Function to save user data during Sign Up
function registerUser(name, email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if email already exists
  let exists = users.find(u => u.email === email);
  if (exists) {
    alert(" Email already registered. Please login.");
    return false;
  }

  // add new user
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully! Please login.");
  window.location.href = "./login.html";
  return true;
}

// Function to login
function loginUser(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert(" Welcome back " + user.name + "!");
    // redirect to home page after login
    window.location.href = "../checkout/checkout.html";
    return true;
  } else {
    alert(" Invalid email or password");
    return false;
  }
}

// Attach events
document.addEventListener("DOMContentLoaded", () => {
  // Sign Up form
  let signupForm = document.querySelector("#signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let name = document.querySelector("#signupName").value.trim();
      let email = document.querySelector("#signupEmail").value.trim();
      let password = document.querySelector("#signupPassword").value.trim();
      let confirmPassword = document.querySelector("#signupConfirmPassword").value.trim();

      if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match!");
        return;
      }

      registerUser(name, email, password);
    });
  }

  // Login form
  let loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let email = document.querySelector("#loginEmail").value.trim();
      let password = document.querySelector("#loginPassword").value.trim();
      loginUser(email, password);
    });
  }
});
