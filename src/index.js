import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPhHBzZEOC3JXS7YM5weYF67di3Xegiug",
  authDomain: "junglecookie-7de2c.firebaseapp.com",
  projectId: "junglecookie-7de2c",
  storageBucket: "junglecookie-7de2c.firebasestorage.app",
  messagingSenderId: "719898029958",
  appId: "1:719898029958:web:f5773562d03845d2fcc607",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function initListeners() {
  $(window).on("hashchange", getPage);
  getPage();
}

$(document).on("click", ".signOut", function () {
  signOut(auth)
    .then(() => {
      console.log("User  signed out");
      $(".login").removeClass("signOut").text("Login");
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
    });
});

$(document).on("click", "#signIn", function (e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#pw").val();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User  signed in:", user);
      showLogInAlert("You have successfully Logged In 😊 !");

      $(".login").addClass("signOut").text("Logout");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorMessage);
    });
});
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User  is signed in:", user);
        $(".login").addClass("signOut").text("Logout");
      } else {
        console.log("No user is signed in.");
        $(".login").removeClass("signOut").text("Login");
      }
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

function showLogInAlert(message) {
  const alertBox = document.getElementById("customLogInAlert");
  const alertMessage = document.getElementById("LogInAlertMessage");
  alertMessage.textContent = message;
  alertBox.style.display = "flex";
  document.getElementById("closeLogInAlert").onclick = function () {
    alertBox.style.display = "none";
  };

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 7000);
}
function showSignUpAlert(message) {
  const alertBox = document.getElementById("customSignUpAlert");
  const alertMessage = document.getElementById("signUpAlertMessage");
  alertMessage.textContent = message;
  alertBox.style.display = "flex";
  document.getElementById("closeSignUpAlert").onclick = function () {
    alertBox.style.display = "none";
  };

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 7000);
}

$(document).on("click", "#createAcctBtn", function (e) {
  e.preventDefault();
  let emailSignUp = $("#emailSignUp").val();
  let pwSignUp = $("#pwSignUp").val();

  createUserWithEmailAndPassword(auth, emailSignUp, pwSignUp)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);

      showSignUpAlert("You have successfully signed up 🪧⬆️ !");
      $(".login").addClass(".signOut");
      $(".login").html("Logout");
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

function getPage() {
  let hash = window.location.hash;
  let pageID = hash.replace("#", "");

  if (pageID != "") {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
    });
  }
}

$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});

$(document).ready(function () {
  initListeners();
});
