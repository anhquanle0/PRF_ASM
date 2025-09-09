"use strict";

class PetData {
  static petInfoArray = new Map();

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

if (!getFromStorage("petInfo")) {
  addPet(new PetData("P001", "Dober Mix", 3, "Dog", 12, 87, "Doberman Pinscher", "#e08f8f", true, true, true, "3/4/2022"));
  addPet(new PetData("P002", "Charlie Tux", 4, "Cat", 4, 65, "Tabby", "#8cee9c", true, false, false, "3/4/2022"));
  addPet(new PetData("P003", "Sweetie Pie", 3, "Dog", 6, 45, "Husky", "#ff1414", false, false, true, "3/4/2022"));
  addPet(new PetData("P004", "Chocolate And Kitten", 4, "Cat", 6, 87, "Mixed Breed", "#e9e22b", false, false, false, "3/4/2022"));
  addPet(new PetData("P005", "Symph", 6, "Dog", 8, 77, "Doberman Pinscher", "#46b4a7", true, true, true, "3/4/2022"));

  saveToStorage("petInfo", PetData.petInfoArray);
} else {
  getFromStorage("petInfo").forEach((e) => {
    const pet = Object.assign(new PetData(), e);
    addPet(pet);
  });
}

function addPet(pet) {
  PetData.petInfoArray.set(pet.id, pet);
}

class BreedData {
  constructor(breed, type) {
    this.breed = breed;
    this.type = type;
  }
}

let initialBreed;
if (!getFromStorage("breed")) {
  initialBreed = [
    new BreedData("Tabby", "Cat"),
    new BreedData("Mixed Breed", "Cat"),
    new BreedData("Mixed Breed", "Dog"),
    new BreedData("Husky", "Dog"),
    new BreedData("Domestic Short Hair", "Cat"),
    new BreedData("Doberman Pinscher", "Dog"),
  ];

  saveToStorage("breed", initialBreed);
} else {
  initialBreed = getFromStorage("breed");
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
