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

var signedIn = false;
var initalIngreCount = 3;
var initalInstrCount = 3;
//var recipes = [];

function initListeners() {
  $(window).on("hashchange", getPage);
  getPage();
}

$(document).on("click", ".signOut", function (e) {
  signOut(auth)
    .then(() => {
      signedIn = false;
      $("nav ul").html(
        `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#login" class="login" id="loginbtn">Login</a></li>
            `
      );
      $(".mobile-menu").html(
        `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#login" class="login" id="loginbtn">Login</a></li>
            `
      );
      $(".login").html("Login");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

$(document).on("click", "#signIn", function (e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#pw").val();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
      // Check if the nav is updated
      $("nav ul").html(
        `<li><a href="#home" class="nav-links">Home</a></li>
        <li><a href="#browse" class="nav-links">Browse</a></li>
        <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
        <li><a href="#yourrecipes" class="nav-links">Your Recipes</a></li>
        <li><a href="#login" class="login signOut" id="loginbtn">Logout</a></li>`
      );
      console.log("Nav updated after login");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user); // Confirm user is signed in
        $(".login").addClass("signOut").text("Logout");
        // User is signed in, update the nav links
        $("nav ul").html(
          `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
            <li><a href="#login" class="login signOut" id="loginbtn">Logout</a></li>`
        );
        $(".mobile-menu").html(
          `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
            <li><a href="#login" class="login signOut" id="loginbtn">Logout</a></li>`
        );
      } else {
        console.log("No user is signed in.");
        $(".login").removeClass("signOut").text("Login");

        $("nav ul").html(
          `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#login" class="login" id="loginbtn">Login</a></li>`
        );
        $(".mobile-menu").html(
          `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#login" class="login" id="loginbtn">Login</a></li>`
        );
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
      signedIn = true;

      showSignUpAlert("You have successfully signed up 🪧⬆️ !");
      $(".login").addClass(".signOut");
      $(".login").html("Logout");
      $("nav ul").html(
        `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
            <li><a href="#login" class="login signOut" id="loginbtn">Login</a></li>
            `
      );
      $(".mobile-menu").html(
        `<li><a href="#home" class="nav-links">Home</a></li>
            <li><a href="#browse" class="nav-links">Browse</a></li>
            <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
            <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
            <li><a href="#login" class="login signOut" id="loginbtn">Login</a></li>
            `
      );
      $(".login").html("Logout");
      window.location.hash = "#yourRecipes";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

function formAdders() {
  // Add event listener to image button
  $(".imageBtn").on("click", function () {
    $("#imageUpload").click();
  });

  // Handle image upload and setting image path in input
  $("#imageUpload").on("change", function () {
    var file = this.files[0];
    if (file) {
      $("#imagePath").val(file.name); // Storing file name in the input field
    }
  });

  // Dynamically add ingredients
  $(".ingreBtn").on("click", (e) => {
    initalIngreCount++; // Increment ingredient counter
    $(".formDesc").append(
      `<input id="ingre${initalIngreCount}" type="text" placeholder="Ingredient #${initalIngreCount}" />`
    );
  });

  // Dynamically add instructions
  $(".instrBtn").on("click", (e) => {
    initalInstrCount++; // Increment instruction counter
    $(".formInstr").append(
      `<input id="instr${initalInstrCount}" type="text" placeholder="Instruction #${initalInstrCount}" />`
    );
  });

  // Save Recipe Button Handler
  $(".submit").on("click", (e) => {
    e.preventDefault();

    // Create new recipe object
    let newItemObj = {
      imagePath: $("#imagePath").val(),
      recipeName: $("#recipeName").val(),
      recipeDesc: $("#recipeDesc").val(),
      recipeTime: $("#recipeTime").val(),
      recipeServingSize: $("#recipeServingSize").val(),
      ingredients: [],
      instructions: [],
    };

    // Collect ingredients from form inputs
    $(".formDesc input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        newItemObj.ingredients.push(value);
      }
    });

    // Collect instructions from form inputs
    $(".formInstr input").each(function (index, data) {
      var value = $(this).val();
      if (value != "") {
        newItemObj.instructions.push(value);
      }
    });

    // Save the new recipe to local storage (or Firebase)
    addRecipe(newItemObj);

    window.location.hash = "#yourRecipes";
  });
}

// Store the updated count persistently if necessary
function storeIngredientCount() {
  localStorage.setItem("initalIngreCount", initalIngreCount);
}

function storeInstructionCount() {
  localStorage.setItem("initalInstrCount", initalInstrCount);
}

// Initialize counts on page load
function initializeCounts() {
  initalIngreCount = parseInt(localStorage.getItem("initalIngreCount") || 3);
  initalInstrCount = parseInt(localStorage.getItem("initalInstrCount") || 3);
}

// Initialize counts
initializeCounts();
function addRecipe(recipe) {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  recipes.push(recipe);
  alert("Your recipe was successfully created 🍴");

  // Save the updated recipes back to localStorage
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// Example of using the addRecipe function when the form is submitted
$(".submit").on("click", (e) => {
  e.preventDefault();

  // Create new recipe object
  let newItemObj = {
    imagePath: $("#imagePath").val(),
    recipeName: $("#recipeName").val(),
    recipeDesc: $("#recipeDesc").val(),
    recipeTime: $("#recipeTime").val(),
    recipeServingSize: $("#recipeServingSize").val(),
    ingredients: [],
    instructions: [],
  };

  // Gather ingredients
  $(".formDesc input").each(function (index, data) {
    var value = $(this).val();
    if (value != "") {
      let keyName = "ingredients" + index;
      let ingreObj = {};
      ingreObj[keyName] = value;
      newItemObj.ingredients.push(ingreObj);
    }
  });

  $(".formInstr input").each(function (index, data) {
    var value = $(this).val();
    if (value != "") {
      let keyName = "instruction" + index;
      let instrObj = {};
      instrObj[keyName] = value;
      newItemObj.instructions.push(instrObj);
    }
  });

  addRecipe(newItemObj);

  window.location.hash = "#yourRecipes";
});

// Step 2: Your page loading logic
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

function getPage() {
  let hash = window.location.hash;
  let pageID = hash.replace("#", "");

  if (
    pageID == "home" ||
    pageID == "browse" ||
    pageID == "login" ||
    pageID == "viewrecipe"
  ) {
    $.get(`pages/${pageID}.html`, (data) => {
      $("#app").html(data);

      // If the page is 'viewrecipe', display the recipe details
      if (pageID == "viewrecipe") {
        const recipeIndex = window.location.hash.split("-")[1]; // Extract index from hash like #viewrecipe-0
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

        if (recipeIndex >= 0 && recipeIndex < recipes.length) {
          const recipe = recipes[recipeIndex];

          // Populate the recipe details on the page
          $("#recipeName").text(recipe.recipeName);
          $("#recipeDesc").text(recipe.recipeDesc);
          $("#recipeTime").text(recipe.recipeTime);
          $("#recipeServingSize").text(`${recipe.recipeServingSize} servings`);
          $("#recipeImage").attr("src", recipe.imagePath);

          // Display ingredients
          let ingredientsHtml = "";
          recipe.ingredients.forEach((ingredient) => {
            ingredientsHtml += `<li>${ingredient}</li>`;
          });
          $("#recipeIngredients").html(ingredientsHtml);

          // Display instructions
          let instructionsHtml = "";
          recipe.instructions.forEach((instruction) => {
            instructionsHtml += `<li>${instruction}</li>`;
          });
          $("#recipeInstructions").html(instructionsHtml);
        } else {
          // If the index is invalid or no recipe is found, display an error message
          $("#app").html("<h3>Recipe not found!</h3>");
        }
      }
    });
  } else if (pageID == "createRecipes") {
    $.get(`pages/${pageID}.html`, (data) => {
      $("#app").html(data);
      formAdders();
    });
  } else if (pageID == "editRecipe") {
    $.get(`pages/${pageID}.html`, (data) => {
      $("#app").html(data);

      // Get the index of the recipe being edited
      const recipeIndex = window.location.hash.split("-")[0]; // Extract index from hash like #editRecipe-0
      const recipe = recipes[recipeIndex];

      // Populate the form with the current recipe details
      $("#imagePath").val(recipe.imagePath);
      $("#recipeName").val(recipe.recipeName);
      $("#recipeDesc").val(recipe.recipeDesc);
      $("#recipeTime").val(recipe.recipeTime);
      $("#recipeServingSize").val(recipe.recipeServingSize);

      // Populate ingredients
      recipe.ingredients.forEach((ingredient, index) => {
        $(`#ingre${index}`).val(ingredient);
      });

      // Populate instructions
      recipe.instructions.forEach((instruction, index) => {
        $(`#instr${index}`).val(instruction);
      });

      // Save button to save changes
      $("#saveButton").on("click", () => saveRecipe(recipeIndex));
      $("#cancelButton").on(
        "click",
        () => (window.location.hash = "#yourRecipes")
      );
    });
  } else if (pageID == "yourRecipes") {
    $.get(`pages/${pageID}.html`, (data) => {
      $("#app").html(data);
      recipes = JSON.parse(localStorage.getItem("recipes")) || [];

      if (recipes.length === 0) {
        $(".norecipe").append(`<h4>You have no recipes.</h4>`);
      } else {
        $(".recipe-boxes").empty();

        $.each(recipes, (idx, recipe) => {
          $(".recipe-boxes").append(`
            <div class="recipe-box-ED">
              <div class="recipe-box">
                <div class="recipe-img">
                  <a href="#viewrecipe-${idx}" class="viewRecipe" data-index="${idx}">View</a>
                  <img src="${recipe.imagePath}" alt="your recipe" />
                </div>
                <div class="recipe-info">
                  <h4>${recipe.recipeName}</h4>
                  <p class="recipe-info-desc">${recipe.recipeDesc}</p>
                  <div class="time">
                    <img src="images/time.svg" alt="time" />
                    <p>${recipe.recipeTime}</p>
                  </div>
                  <div class="servings">
                    <img src="images/servings.svg" alt="servings" />
                    <p>${recipe.recipeServingSize} servings</p>
                  </div>
                </div>
              </div>
              <div class="edit-delete-buttons">
                <a href="#editRecipe-${idx}" class="editRecipe" data-index="${idx}">Edit Recipe</a>
                <a href="#" class="deleteRecipe" data-index="${idx}">Delete</a>
              </div>
            </div>
          `);
        });
      }
    });
  }

  function saveRecipe(recipeIndex) {
    // Grab updated values from the form
    const updatedRecipe = {
      imagePath: $("#imagePath").val(),
      recipeName: $("#recipeName").val(),
      recipeDesc: $("#recipeDesc").val(),
      recipeTime: $("#recipeTime").val(),
      recipeServingSize: $("#recipeServingSize").val(),
      ingredients: [],
      instructions: [],
    };

    // Collect ingredients
    $(".formDesc input").each(function () {
      let value = $(this).val();
      if (value) updatedRecipe.ingredients.push(value);
    });

    // Collect instructions
    $(".formInstr input").each(function () {
      let value = $(this).val();
      if (value) updatedRecipe.instructions.push(value);
    });

    // Update the recipe in localStorage (or Firebase)
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes[recipeIndex] = updatedRecipe; // Update the recipe at the given index
    localStorage.setItem("recipes", JSON.stringify(recipes)); // Save updated recipes back to localStorage

    alert("Your recipe has been updated!");
    window.location.hash = "#yourRecipes"; // Redirect back to the "Your Recipes" page
  }
}

$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});

$(document).ready(function () {
  initListeners();
  formAdders();
});
$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});
