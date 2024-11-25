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

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPhHBzZEOC3JXS7YM5weYF67di3Xegiug",
  authDomain: "junglecookie-7de2c.firebaseapp.com",
  projectId: "junglecookie-7de2c",
  storageBucket: "junglecookie-7de2c.firebasestorage.app",
  messagingSenderId: "719898029958",
  appId: "1:719898029958:web:f5773562d03845d2fcc607",
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State Variables
let signedIn = false;
let initialIngreCount = 3;
let initialInstrCount = 3;

// Initialize Page Listeners
function initListeners() {
  $(window).on("hashchange", loadPage);
}

// Handle Hamburger Menu Toggle
$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});

// Handle Auth Changes
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      updateNavigation(user);
    });
  })
  .catch((error) => console.error("Error setting persistence:", error));

function updateNavigation(user) {
  if (user) {
    signedIn = true;
    $("nav ul, .mobile-menu").html(`
      <li><a href="#home" class="nav-links">Home</a></li>
      <li><a href="#browse" class="nav-links">Browse</a></li>
      <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
      <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
      <li><a href="#login" class="login signOut">Logout</a></li>
    `);
  } else {
    signedIn = false;
    $("nav ul, .mobile-menu").html(`
      <li><a href="#home" class="nav-links">Home</a></li>
      <li><a href="#browse" class="nav-links">Browse</a></li>
      <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
      <li><a href="#login" class="login">Login</a></li>
    `);
  }
}

// Authentication Event Handlers
$(document).on("click", ".signOut", () => {
  signOut(auth)
    .then(() => alert("Logged out successfully"))
    .catch((error) => alert(`Error: ${error.message}`));
});

$(document).on("click", "#signIn", (e) => {
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

$(document).on("click", "#createAcctBtn", (e) => {
  e.preventDefault();
  const email = $("#emailSignUp").val();
  const password = $("#pwSignUp").val();
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

// Recipe Form Handlers

// Load Pages Based on Hash
function loadPage() {
  const hash = window.location.hash.replace("#", "");
  if (["home", "browse", "login", "createRecipes"].includes(hash)) {
    $.get(`pages/${hash}.html`, (data) => {
      $("#app").html(data);
      if (hash === "createRecipes") setupFormHandlers();
    });
  } else if (hash === "yourRecipes") {
    loadYourRecipes();
  }
}

// Load Your Recipes Page
function loadYourRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  $.get("pages/yourRecipes.html", (data) => {
    $("#app").html(data); // Load the page content
    if (recipes.length === 0) {
      $(".norecipe").html(
        "<h4>You have no recipes. Start by creating one!</h4>"
      );
    } else {
      $(".recipe-boxes").empty(); // Clear existing recipes
      recipes.forEach((recipe, idx) => {
        $(".recipe-boxes").append(`
          <div class="recipe-box-ED">
            <div class="recipe-box">
              <div class="recipe-img">
                <a href="#viewrecipe" class="viewRecipe" data-recipe="${encodeURIComponent(
                  JSON.stringify(recipe)
                )}">View</a>
                <img src="${recipe.imagePath}" alt="${recipe.recipeName}" />
              </div>
              <div class="recipe-info">
                <h4>${recipe.recipeName}</h4>
                <p class="recipe-info-desc">${recipe.recipeDesc}</p>
                <div class="time">
                  <img src="images/time.svg" alt="time" />
                  <p>${recipe.recipeTime || "N/A"}</p>
                </div>
                <div class="servings">
                  <img src="images/servings.svg" alt="servings" />
                  <p>${recipe.recipeServingSize || "N/A"} servings</p>
                </div>
              </div>
            </div>
            <div class="edit-delete-buttons">
              <a href="#" class="editRecipe" data-index="${idx}">Edit Recipe</a>
              <a href="#" class="deleteRecipe" data-index="${idx}">Delete</a>
            </div>
          </div>
        `);
      });
    }
  });
}

$(document).on("click", ".editRecipe", function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  const recipeIndex = $(this).data("index"); // Get the index of the recipe to edit
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipeToEdit = recipes[recipeIndex];

  // Navigate to the edit page
  window.location.hash = "#editRecipe"; // You can create an edit page if you want

  // Prepopulate the form fields with the recipe data
  $.get("pages/editRecipe.html", (data) => {
    $("#app").html(data); // Load the edit page content into #app

    // Populate form fields with current recipe data
    $("#recipeName").val(recipeToEdit.recipeName);
    $("#recipeDesc").val(recipeToEdit.recipeDesc);
    $("#recipeTime").val(recipeToEdit.recipeTime);
    $("#recipeServingSize").val(recipeToEdit.recipeServingSize);
    $("#imagePath").val(recipeToEdit.imagePath);

    // Prepopulate ingredients and instructions
    recipeToEdit.ingredients.forEach((ingredient, idx) => {
      $(".formDesc").append(
        `<input type="text" value="${ingredient}" placeholder="Ingredient #${
          idx + 1
        }" />`
      );
    });

    recipeToEdit.instructions.forEach((instruction, idx) => {
      $(".formInstr").append(
        `<input type="text" value="${instruction}" placeholder="Instruction #${
          idx + 1
        }" />`
      );
    });

    // Attach submit handler for saving changes
    $(".submit").on("click", (e) => {
      e.preventDefault();
      updateRecipe(recipeIndex); // Update the selected recipe
    });
  });
});
function updateRecipe(recipeIndex) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Get updated data from the form
  const updatedRecipe = {
    imagePath: $("#imagePath").val() || "images/default-recipe.jpg", // Default image if none provided
    recipeName: $("#recipeName").val(),
    recipeDesc: $("#recipeDesc").val(),
    recipeTime: $("#recipeTime").val(),
    recipeServingSize: $("#recipeServingSize").val(),
    ingredients: [],
    instructions: [],
  };

  $(".formDesc input").each(function () {
    const value = $(this).val();
    if (value) updatedRecipe.ingredients.push(value);
  });

  $(".formInstr input").each(function () {
    const value = $(this).val();
    if (value) updatedRecipe.instructions.push(value);
  });

  // Update the recipe in the array
  recipes[recipeIndex] = updatedRecipe;

  // Save the updated recipes list back to localStorage
  localStorage.setItem("recipes", JSON.stringify(recipes));

  // Navigate back to your recipes page
  alert("Recipe updated successfully!");
  window.location.hash = "#yourRecipes";
}
$(document).on("click", ".cancel", function (e) {
  e.preventDefault();
  window.location.hash = "#yourRecipes"; // Redirect to the yourRecipes page
});

//span + button thingy works
$(document).on("click", ".instrBtn", ".ingreBtn", function (e) {
  e.preventDefault();

  const currentInstrCount = $(".formInstr input").length + 1;

  $(".formInstr").append(`
    <input type="text" placeholder="Instruction #${currentInstrCount}" />
  `);
});

//Delete Recipe
$(document).on("click", ".deleteRecipe", function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  const recipeIndex = $(this).data("index"); // Get the index of the recipe to delete
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Confirm deletion
  const isConfirmed = confirm("Are you sure you want to delete this recipe?");
  if (isConfirmed) {
    // Remove the recipe from the array
    recipes.splice(recipeIndex, 1);

    // Update localStorage with the updated recipes array
    localStorage.setItem("recipes", JSON.stringify(recipes));

    // Reload the recipes page to reflect the changes
    loadYourRecipes();
  }
});
function setupFormHandlers() {
  // Handle the image upload button click
  $(".imageBtn").on("click", () => $("#imageUpload").click());

  $("#imageUpload").on("change", function () {
    $("#imagePath").val(this.files[0]?.name || ""); // Update the file name
  });

  // Add Ingredient button click handler
  $(".ingreBtn").on("click", () => {
    initialIngreCount++;
    $(".formDesc").append(
      `<input type="text" placeholder="Ingredient #${initialIngreCount}" />`
    );
  });

  // Add Instruction button click handler
  $(".instrBtn").on("click", () => {
    initialInstrCount++;
    $(".formInstr").append(
      `<input type="text" placeholder="Instruction #${initialInstrCount}" />`
    );
  });

  // Submit Recipe button click handler
  $(".submit").on("click", (e) => {
    e.preventDefault();
    saveRecipe(); // Call the function to save the recipe
    window.location.hash = "#yourRecipes"; // Redirect to the 'yourRecipes' page after saving
  });
}

// Save Recipe Function with Styling for New Recipes
function saveRecipe() {
  const newRecipe = {
    imagePath: $("#imagePath").val() || "", // Default image if none provided
    recipeName: $("#recipeName").val(),
    recipeDesc: $("#recipeDesc").val(),
    recipeTime: $("#recipeTime").val(),
    recipeServingSize: $("#recipeServingSize").val(),
    ingredients: [],
    instructions: [],
  };

  $(".formDesc input").each(function () {
    const value = $(this).val();
    if (value) newRecipe.ingredients.push(value);
  });

  $(".formInstr input").each(function () {
    const value = $(this).val();
    if (value) newRecipe.instructions.push(value);
  });

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes.push(newRecipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));

  alert("Recipe saved successfully");
  window.location.hash = "#yourRecipes";
  loadYourRecipes(); // Reload the recipes page to reflect the new recipe
}
function createRecipeCard(recipe) {
  return `
    <div class="recipe-card">
      <img src="${recipe.imagePath}" alt="${
    recipe.recipeName
  }" class="recipe-image" />
      <h4 class="recipe-title">${recipe.recipeName}</h4>
      <p class="recipe-description">${recipe.recipeDesc}</p>
      <button class="viewRecipe" data-recipe="${encodeURIComponent(
        JSON.stringify(recipe)
      )}">View Recipe</button>
    </div>
  `;
}

$(document).on("click", ".viewRecipe", function () {
  const recipeData = JSON.parse(decodeURIComponent($(this).data("recipe")));
  localStorage.setItem("currentRecipe", JSON.stringify(recipeData));
  window.location.hash = "#viewrecipe";
});

$(document).ready(function () {
  // Check if a recipe is stored in localStorage
  const currentRecipe = JSON.parse(localStorage.getItem("currentRecipe"));

  if (currentRecipe) {
    // Populate the recipe details dynamically
    $("#recipeImage").attr("src", currentRecipe.imagePath);
    $("#recipeName").text(currentRecipe.recipeName);
    $("#recipeDesc").text(currentRecipe.recipeDesc);
    $("#recipeTime").text(currentRecipe.recipeTime);
    $("#recipeServingSize").text(currentRecipe.recipeServingSize);

    // Populate Ingredients
    const ingredientsList = $("#recipeIngredients");
    ingredientsList.empty();
    currentRecipe.ingredients.forEach(function (ingredient) {
      ingredientsList.append(`<li>${ingredient}</li>`);
    });

    // Populate Instructions
    const instructionsDiv = $(".view-instructions");
    instructionsDiv.empty();
    currentRecipe.instructions.forEach(function (instruction, index) {
      instructionsDiv.append(
        `<p><strong>Step ${index + 1}:</strong> ${instruction}</p>`
      );
    });
  } else {
    alert("Recipe not found.");
  }

  // Back button functionality
  $(".backToRecipes").on("click", function () {
    window.location.hash = "#yourRecipes";
  });
});

$(document).on("click", ".viewRecipe", function () {
  const recipeData = JSON.parse(decodeURIComponent($(this).data("recipe")));
  $.get("pages/viewrecipe.html", (data) => {
    $("#app").html(data); // Load viewrecipe.html content into #app
    populateRecipeDetails(recipeData);
  });
});

function populateRecipeDetails(recipe) {
  // Set image, name, description, time, and serving size
  $("#recipeImage").attr("src", recipe.imagePath);
  $("#recipeName").text(recipe.recipeName);
  $("#recipeDesc").text(recipe.recipeDesc);
  $("#recipeTime").text(recipe.recipeTime);
  $("#recipeServingSize").text(recipe.recipeServingSize);

  // Populate ingredients
  const ingredientsList = $("#recipe-ingredients");
  ingredientsList.empty();
  recipe.ingredients.forEach((ingredient) => {
    ingredientsList.append(`<li>${ingredient}</li>`);
  });

  // Populate instructions
  const instructionsDiv = $(".view-instructions");
  instructionsDiv.empty();
  instructionsDiv.append("<h3>Instructions:</h3>");
  recipe.instructions.forEach((instruction, index) => {
    instructionsDiv.append(
      `<p><strong>Step ${index + 1}:</strong> ${instruction}</p>`
    );
  });
}
const currentRecipe = JSON.parse(localStorage.getItem("currentRecipe"));

if (currentRecipe) {
  // Populate the recipe details dynamically
  $("#recipe-image").attr("src", currentRecipe.imagePath);
  $("#recipe-title").text(currentRecipe.recipeName);
  $("#recipe-description").text(currentRecipe.recipeDesc);
  $("#recipe-time").text(currentRecipe.recipeTime);
  $("#recipe-servings").text(currentRecipe.recipeServingSize);

  // Populate Ingredients
  const ingredientsList = $("#recipe-ingredients");
  ingredientsList.empty();
  currentRecipe.ingredients.forEach(function (ingredient) {
    ingredientsList.append(`<li>${ingredient}</li>`);
  });

  // Populate Instructions
  const instructionsDiv = $("#recipe-instructions");
  instructionsDiv.empty();
  currentRecipe.instructions.forEach(function (instruction, index) {
    instructionsDiv.append(
      `<li><strong>Step ${index + 1}:</strong> ${instruction}</li>`
    );
  });

  // Add Edit functionality
  $("#edit-recipe").on("click", function (e) {
    e.preventDefault();
    window.location.hash = "#editRecipe"; // Navigate to the edit page
  });
} else {
  alert("Recipe not found.");
}

// Back to Recipes Button
$(".backToRecipes").on("click", function () {
  window.location.hash = "#yourRecipes";
});
// Back to Recipes Button
$(document).on("click", ".backToRecipes", function () {
  window.location.hash = "#yourrecipes";
});

// View Recipe Details

// Back to Recipes Button
$(document).on("click", ".backToRecipes", function () {
  window.location.hash = "#yourRecipes";
});

// Initialize Application
$(document).ready(() => {
  initListeners();
});
