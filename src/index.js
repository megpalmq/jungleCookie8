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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let signedIn = false;

function initListeners() {
  $(window).on("hashchange", loadPage);
}
$(document).on("click", ".viewRecipePizza", function (e) {
  e.preventDefault();
  alert("That's just an example, silly!");
});

$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      updateNavigation(user);
    });
  })
  .catch((error) => console.error("Error setting persistence:", error));

function updateNavigation(user) {
  signedIn = Boolean(user);
  const navLinks = signedIn
    ? `
      <li><a href="#home" class="nav-links">Home</a></li>
      <li><a href="#browse" class="nav-links">Browse</a></li>
      <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
      <li><a href="#yourRecipes" class="nav-links">Your Recipes</a></li>
      <li><a href="#login" class="login signOut">Logout</a></li>
    `
    : `
      <li><a href="#home" class="nav-links">Home</a></li>
      <li><a href="#browse" class="nav-links">Browse</a></li>
      <li><a href="#createRecipes" class="nav-links">Create Recipe</a></li>
      <li><a href="#login" class="login">Login</a></li>
    `;
  $("nav ul, .mobile-menu").html(navLinks);
}

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
      console.log("User signed in:", userCredential.user);
      showLogInAlert("You have successfully Logged In 😊 !");
      $(".login").addClass("signOut").text("Logout");
    })
    .catch((error) => console.error("Error signing in:", error.message));
});

function showLogInAlert(message) {
  const alertBox = $("#customLogInAlert");
  alertBox.find("#LogInAlertMessage").text(message);
  alertBox.fadeIn();
  setTimeout(() => alertBox.fadeOut(), 7000);
}

$(document).on("click", "#createAcctBtn", (e) => {
  e.preventDefault();
  const email = $("#emailSignUp").val();
  const password = $("#pwSignUp").val();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User  signed up:", userCredential.user);
      showSignUpAlert("You have successfully signed up 🪧⬆️ !");
      $(".login").addClass("signOut").text("Logout");
    })
    .catch((error) => alert("Error Message: " + error.message));
});

function showSignUpAlert(message) {
  const alertBox = $("#customSignUpAlert");
  alertBox.find("#signUpAlertMessage").text(message);
  alertBox.fadeIn();
  setTimeout(() => alertBox.fadeOut(), 7000);
}

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

function saveRecipe(recipeIndex) {
  const updatedRecipe = {
    imagePath: $("#imagePath").val() || "images/default-recipe.jpg",
    recipeName: $("#recipeName").val(),
    recipeDesc: $("#recipeDesc").val(),
    recipeTime: $("#recipeTime").val(),
    recipeServingSize: $("#recipeServingSize").val(),
    ingredients: [],
    instructions: [],
  };

  // Validate inputs
  if (!updatedRecipe.recipeName || !updatedRecipe.recipeDesc) {
    alert("Recipe name and description are required!");
    return;
  }

  $(".formDesc input").each(function () {
    const value = $(this).val();
    if (value) updatedRecipe.ingredients.push(value);
  });

  $(".formInstr input").each(function () {
    const value = $(this).val();
    if (value) updatedRecipe.instructions.push(value);
  });

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  if (recipeIndex !== undefined) {
    recipes[recipeIndex] = updatedRecipe;
    alert("Recipe updated successfully!");
  } else {
    recipes.push(updatedRecipe);
    alert("Recipe saved successfully!");
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));

  window.location.hash = "#yourRecipes";
  loadYourRecipes();
}

function loadYourRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  $.get("pages/yourRecipes.html", (data) => {
    $("#app").html(data);
    if (recipes.length === 0) {
      $(".norecipe").html(
        "<h4>You have no recipes. Start by creating one!</h4>"
      );
    } else {
      $(".recipe-boxes").empty();
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

$(document).on("click", ".viewRecipe", function (e) {
  e.preventDefault();
  const recipeData = JSON.parse(decodeURIComponent($(this).data("recipe")));

  if (!recipeData || !recipeData.recipeName) {
    console.error("Recipe data is missing or invalid.");
    return;
  }

  $.get("pages/viewrecipe.html", (data) => {
    $("#app").html(data);
    populateRecipeDetails(recipeData);
  });
});

function populateRecipeDetails(recipe) {
  if (!recipe) {
    console.error("Recipe is undefined.");
    return;
  }

  $("#recipe-title").text(recipe.recipeName || "No Name Provided");
  $("#recipe-description").text(recipe.recipeDesc || "No Description Provided");
  $("#recipe-time").text(recipe.recipeTime || "N/A");
  $("#recipe-servings").text(recipe.recipeServingSize || "N/A");

  const ingredientsList = $("#recipe-ingredients");
  ingredientsList.empty();
  if (recipe.ingredients && recipe.ingredients.length) {
    recipe.ingredients.forEach(function (ingredient) {
      ingredientsList.append(`<li>${ingredient}</li>`);
    });
  } else {
    ingredientsList.append("<li>No ingredients provided.</li>");
  }

  const instructionsList = $("#recipe-instructions");
  instructionsList.empty();
  if (recipe.instructions && recipe.instructions.length) {
    recipe.instructions.forEach(function (instruction) {
      instructionsList.append(`<li>${instruction}</li>`);
    });
  } else {
    instructionsList.append("<li>No instructions provided.</li>");
  }

  if (recipe.imagePath) {
    $("#recipe-image").attr("src", recipe.imagePath);
  }
}
$(document).on("click", ".cancel", function (e) {
  e.preventDefault();
  window.location.hash = "#viewRecipes";
  loadYourRecipes();
});

$(document).on("click", ".imageBtn", function () {
  $("#imageUpload").click();
});

$(document).on("change", "#imageUpload", function () {
  const filePath = this.files[0] ? URL.createObjectURL(this.files[0]) : "";
  $("#imagePath").val(filePath);
});

$(document).on("click", ".editRecipe", function (e) {
  e.preventDefault();
  const recipeIndex = $(this).data("index");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipeToEdit = recipes[recipeIndex];

  window.location.hash = "#editRecipe";
  $.get("pages/editRecipe.html", (data) => {
    $("#app").html(data);
    $("#recipeName").val(recipeToEdit.recipeName);
    $("#recipeDesc").val(recipeToEdit.recipeDesc);
    $("#recipeTime").val(recipeToEdit.recipeTime);
    $("#recipeServingSize").val(recipeToEdit.recipeServingSize);
    $("#imagePath").val(recipeToEdit.imagePath);

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

    setupFormHandlers();
  });
});

$(document).on("click", ".deleteRecipe", function (e) {
  e.preventDefault();
  const recipeIndex = $(this).data("index");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes.splice(recipeIndex, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadYourRecipes();
  }
});

function setupFormHandlers() {
  if (!signedIn) {
    alert("Can't make a recipe without logging in first.");
    window.location.hash = "#login"; // Redirect to the login page
    return; // Stop further execution
  }

  $(".formDesc").on("click", ".addField", function (e) {
    e.preventDefault();
    $(".formDesc").append('<input type="text" placeholder="Ingredient" />');
  });

  $(".formInstr").on("click", ".addField", function (e) {
    e.preventDefault();
    $(".formInstr").append('<input type="text" placeholder="Instruction" />');
  });

  $(".formCreate").on("submit", function (e) {
    e.preventDefault();
    saveRecipe();
  });
  $(".imageBtn").on("click", () => $("#imageUpload").click());

  $("#imageUpload").on("change", function () {
    const filePath = this.files[0] ? URL.createObjectURL(this.files[0]) : "";
    $("#imagePath").val(filePath);
  });

  $(document).on("click", ".ingreBtn", function () {
    const currentIngreCount = $(".formDesc input").length + 1;
    $(".formDesc").append(
      `<input type="text" placeholder="Ingredient #${currentIngreCount}" />`
    );
  });

  $(document).on("click", ".instrBtn", function () {
    const currentInstrCount = $(".formInstr input").length + 1;
    $(".formInstr").append(
      `<input type="text" placeholder="Instruction #${currentInstrCount}" />`
    );
  });

  $(".submit").on("click", (e) => {
    e.preventDefault();
    saveRecipe();
    window.location.hash = "#yourRecipes";
  });
}

$(document).ready(() => {
  initListeners();
  if (!window.location.hash) {
    window.location.hash = "#home";
  }
  loadPage();
});
