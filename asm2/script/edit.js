"use strict";

const form = document.querySelector("#container-form");
const containerPetsEdit = document.querySelector("#tbody");
const btnSubmit = document.querySelector("#submit-btn");

const inputId = document.querySelector("#input-id");
const inputName = document.querySelector("#input-name");
const inputAge = document.querySelector("#input-age");
const inputType = document.querySelector("#input-type");
const inputWeight = document.querySelector("#input-weight");
const inputLength = document.querySelector("#input-length");
const inputBreed = document.querySelector("#input-breed");
const inputColor = document.querySelector("#input-color-1");
const inputVaccinated = document.querySelector("#input-vaccinated");
const inputDewormed = document.querySelector("#input-dewormed");
const inputSterilized = document.querySelector("#input-sterilized");

// Render data from localStorage
const petArr = [...initialPets];
renderTableData(petArr);

// Display pet's info list
function renderTableData(pets) {
  // Clear container
  containerPetsEdit.innerHTML = "";

  [...pets].forEach((pet) => {
    const { id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded } = pet;
    const petName = name[0].toUpperCase() + name.slice(1).toLowerCase() + "";

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateAdded));

    const html = `
		<tr>
			<th scope="row">${id}</th>
			<td>${petName}</td>
			<td>${age}</td>
			<td>${type}</td>
			<td>${weight} kg</td>
			<td>${length} cm</td>
			<td>${breed}</td>
			<td>
			  <i class="bi bi-square-fill" style="color: ${color}"></i>
			</td>
			<td><i class="bi bi-${vaccinated ? "check" : "x"}-circle-fill"></i></td>
			<td><i class="bi bi-${dewormed ? "check" : "x"}-circle-fill"></i></td>
			<td><i class="bi bi-${sterilized ? "check" : "x"}-circle-fill"></i></td>
			<td>${formattedDate}</td>
			<td>
        <button type="button" class="btn btn-warning">Edit</button>
			</td>
		</tr>  
  `;

    containerPetsEdit.insertAdjacentHTML("beforeend", html);
  });
}

// Event handler for EDIT btn
containerPetsEdit.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.matches("button")) {
    const row = e.target.closest("tr");
    const petId = row.querySelector("th").textContent;

    const [{ id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized }] = findPet(petId);

    inputId.value = id;
    inputName.value = name;
    inputAge.value = age;
    inputType.value = type;
    inputWeight.value = weight;
    inputLength.value = length;
    // inputBreed.value = breed;
    inputColor.value = color;
    inputVaccinated.checked = vaccinated;
    inputDewormed.checked = dewormed;
    inputSterilized.checked = sterilized;

    renderBreed(inputType.value);
    inputBreed.value = breed;

    form.classList.remove("hide");
  }
});

// Find pet function
function findPet(id) {
  const existedPet = petArr.find((pet) => pet.id == id);
  const index = petArr.findIndex((pet) => pet.id == id);
  return [existedPet, index];
}

// Render breed list based on selected type
function renderBreed(type) {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = [...getFromStorage(BREED_KEY)].filter((el) => el.type == type);

  breeds?.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
}

// Event handler for SUBMIT form for pet info changing
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const id = inputId.value;

  const [, i] = findPet(id);

  const name = inputName.value;
  const age = inputAge.value;
  const type = inputType.value;
  const weight = inputWeight.value;
  const length = inputLength.value;
  const breed = inputBreed.value;
  const color = inputColor.value;
  const vaccinated = inputVaccinated.checked;
  const dewormed = inputDewormed.checked;
  const sterilized = inputSterilized.checked;

  const newPet = new PetData(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized);

  if (!validate(newPet)) return;

  // updateData
  petArr.splice(i, 1, newPet);

  // display pets
  renderTableData(petArr);

  // update localStorage
  saveToStorage(PET_KEY, petArr);

  // Clear input fields
  document.querySelector("form").reset();

  // Hide form
  form.classList.add("hide");

  // annoucement
  showToast("Data is updated!", "success");
});

// Form submit event handler
form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

// Validate function
function validate(pet) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const numberPattern = /^\d+$/;

  const { name, age, type, weight, length, breed } = pet;

  // Type-safe
  if (!pet instanceof PetData) return false;

  // Non-fields empty
  if (!name || !age || !weight || !length) {
    warning("Inputs cannot be empty");
    return false;
  }

  // Name
  if (!namePattern.test(name)) {
    warning("Name cannot be included number!", inputName);
    return false;
  }

  // Age
  if (!numberPattern.test(age) || age < 1 || age > 15) {
    warning("Age must be between 1 and 15!", inputAge);
    return false;
  }

  // Type
  if (type == "Select Type") {
    warning("Please select Type!", inputType);
    return false;
  }

  // Weight
  if (!numberPattern.test(weight) || weight < 1 || weight > 15) {
    warning("Weight must be between 1 and 15!", inputWeight);
    return false;
  }

  // Length
  if (!numberPattern.test(length) || length < 1 || length > 100) {
    warning("Length must be between 1 and 100!", inputLength);
    return false;
  }

  // Breed
  if (breed == "Select Breed") {
    warning("Please select Breed!", inputBreed);
    return false;
  }

  return true;
}

// Annoucement
function warning(message, selector) {
  selector?.focus();
  showToast(message);
}
