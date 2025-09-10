"use strict";

const sidebar = document.querySelector("#sidebar");

const inputType = document.querySelector("#input-type");
const inputBreed = document.querySelector("#input-breed");

// Utils

// Alert pop-up
function showAlert(message) {
  if (!document.getElementById("toast-style")) {
    const css = `
        .toast {
          position: fixed; 
          top: 0; 
          right: 20px; 
          margin-top: 20px; 
          z-index: 9999;
          background:#fff; 
          color:#ff1a1a; 
          font-size: 16px;
          padding:10px 16px; 
          border-radius:6px;
          font-family:sans-serif; 
          box-shadow:0 2px 8px rgba(0,0,0,.2);
          display:inline-block; 
          width:fit-content; 
          width:-moz-fit-content; 
          width:max-content;
          max-width:80vw; 
          white-space:normal; 
          overflow-wrap:anywhere; 
          word-break:break-word;
          opacity:0; 
          transform:translateY(-100%); 
          transition:transform .35s ease, opacity .35s ease;
        }

        .toast.show { opacity:1; transform:translateX(0); }
        .toast.hide { opacity:0; transform:translateX(60%); }
      `;
    const s = document.createElement("style");
    s.id = "toast-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.add("hide");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  }, 3000);
}

// Sidebar active toggle
sidebar.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest("li")) {
    const href = e.target.closest("a")?.href;
    window.location.href = href;
  } else {
    sidebar.classList.toggle("active");
    const isActived = sidebar.classList.contains("active");
    saveToStorage("sidebar", isActived);
  }
});

// Show breeds based on selected type
function renderBreed(type) {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == type);

  breeds?.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
// Retrieve data
class PetData {
  constructor(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded) {
    if (arguments.length === 11) {
      this._create(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized);
      this.dateAdded = new Date().toLocaleDateString("en-GB");
    } else if (arguments.length === 12) {
      this._create(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized);
      this.dateAdded = new Date(dateAdded).toLocaleDateString("en-GB");
    }
  }

  _create(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.type = type;
    this.weight = weight;
    this.length = length;
    this.breed = breed;
    this.color = color;
    this.vaccinated = vaccinated;
    this.dewormed = dewormed;
    this.sterilized = sterilized;
  }
}
let initialPets = new Map();

if (!getFromStorage("pet")) {
  addPet(new PetData("P001", "Dober Mix", 3, "Dog", 12, 87, "Doberman Pinscher", "#e08f8f", true, true, true, "3/4/2022"));
  addPet(new PetData("P002", "Charlie Tux", 4, "Cat", 4, 65, "Tabby", "#8cee9c", true, false, false, "3/4/2022"));
  addPet(new PetData("P003", "Sweetie Pie", 3, "Dog", 6, 45, "Husky", "#ff1414", false, false, true, "3/4/2022"));
  addPet(new PetData("P004", "Chocolate And Kitten", 4, "Cat", 6, 87, "Mixed Breed", "#e9e22b", false, false, false, "3/4/2022"));
  addPet(new PetData("P005", "Symph", 6, "Dog", 8, 77, "Doberman Pinscher", "#46b4a7", true, true, true, "3/4/2022"));

  saveToStorage("pet", initialPets);
} else {
  getFromStorage("pet").forEach((e) => {
    const pet = Object.assign(new PetData(), e);
    addPet(pet);
  });
}

function addPet(pet) {
  initialPets.set(pet.id, pet);
}

class BreedData {
  constructor(breed, type) {
    this.breed = breed;
    this.type = type;
  }
}

let initialBreeds;
if (!getFromStorage("breed")) {
  initialBreeds = [
    new BreedData("Tabby", "Cat"),
    new BreedData("Mixed Breed", "Cat"),
    new BreedData("Mixed Breed", "Dog"),
    new BreedData("Husky", "Dog"),
    new BreedData("Domestic Short Hair", "Cat"),
    new BreedData("Doberman Pinscher", "Dog"),
  ];

  saveToStorage("breed", initialBreeds);
} else {
  initialBreeds = getFromStorage("breed");
}

if (localStorage.getItem("sidebar")) {
  if (getFromStorage("sidebar")) {
    sidebar.classList.add("active");
  } else {
    sidebar.classList.remove("active");
  }
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function saveToStorage(k, v) {
  if (v instanceof Map) {
    localStorage.setItem(k, JSON.stringify(Array.from(v.values())));
  } else {
    localStorage.setItem(k, JSON.stringify(v));
  }
}

function getFromStorage(k) {
  return JSON.parse(localStorage.getItem(k));
}
