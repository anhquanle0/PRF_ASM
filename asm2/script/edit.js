"use strict";

const containerPetsEdit = document.querySelector("#tbody");
const form = document.querySelector("#container-form");

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

// Render data
displayPetInfo(PetData.petInfoArray);

// // Display info list
function displayPetInfo(list) {
  containerPetsEdit.innerHTML = "";

  list.forEach((pet) => {
    const name = pet.name ? pet.name[0].toUpperCase() + pet.name.slice(1).toLowerCase() + "" : "Unnamed";

    const html = `
		<tr>
			<th scope="row">${pet.id}</th>
			<td id="pet-name">${name}</td>
			<td id="pet-age">${pet.age}</td>
			<td id="pet-type">${pet.type}</td>
			<td id="pet-weight">${pet.weight ? pet.weight + "kg" : undefined}</td>
			<td id="pet-length">${pet.length ? pet.length + "cm" : undefined}</td>
			<td id="pet-breed">${pet.breed}</td>
			<td id="pet-color">
			  <i class="bi bi-square-fill" style="color: ${pet.color}"></i>
			</td>
			<td id="pet-vaccinated"><i class="bi bi-${pet.vaccinated ? "check" : "x"}-circle-fill"></i></td>
			<td id="pet-dewormed"><i class="bi bi-${pet.dewormed ? "check" : "x"}-circle-fill"></i></td>
			<td id="pet-sterilized"><i class="bi bi-${pet.sterilized ? "check" : "x"}-circle-fill"></i></td>			
			<td id="pet-date">${pet.dateAdded}</td>
			<td>
        <button type="button" class="btn btn-warning">Edit</button>
			</td>
		</tr>  
  `;

    containerPetsEdit.innerHTML += html;
  });
}

// Edit event handle
containerPetsEdit.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest(".btn-warning")) {
    const row = e.target.closest("tr");
    const id = row.querySelector("th").textContent;
    const name = row.querySelector("#pet-name").textContent;
    const age = row.querySelector("#pet-age").textContent;
    const type = row.querySelector("#pet-type").textContent;
    const weight = row.querySelector("#pet-weight").textContent;
    const length = row.querySelector("#pet-length").textContent;
    const breed = row.querySelector("#pet-breed").textContent;
    const color = window.getComputedStyle(row.querySelector("#pet-color").querySelector("i")).color;
    const vaccinated = row.querySelector("#pet-vaccinated");
    const dewormed = row.querySelector("#pet-dewormed");
    const sterilized = row.querySelector("#pet-sterilized");

    inputId.value = id;
    inputName.value = name;
    inputAge.value = age;
    inputType.value = type;
    inputWeight.value = retrieveNumbers(weight);
    inputLength.value = retrieveNumbers(length);
    // inputBreed.value = breed;
    inputColor.value = rgbToHex(color);
    inputVaccinated.checked = isChecked(vaccinated);
    inputDewormed.checked = isChecked(dewormed);
    inputSterilized.checked = isChecked(sterilized);

    inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

    const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == inputType.value);
    breeds.forEach((el) => {
      inputBreed.innerHTML += `<option>${el.breed}</option>`;
    });
    inputBreed.value = breed;

    form.classList.remove("hide");
  }
});

inputType.addEventListener("change", (e) => {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == inputType.value);

  breeds.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
});

function retrieveNumbers(input) {
  return +input.match(/\d+/g);
}

function rgbToHex(rgb) {
  const rgbArray = rgb.match(/\d+/g);
  const hex = rgbArray
    .map((x) => {
      const hexValue = parseInt(x).toString(16);
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    })
    .join("");
  return `#${hex}`;
}

function isChecked(input) {
  return input.querySelector("i").classList.contains("bi-check-circle-fill");
}

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  // retrieve data
  const id = inputId.value;
  const name = inputName.value;
  const age = inputAge.value;
  const type = inputType.value;
  const weight = inputWeight.value;
  const lenght = inputLength.value;
  const breed = inputBreed.value;
  const color = inputColor.value;
  const vaccinated = inputVaccinated.checked;
  const dewormed = inputDewormed.checked;
  const sterilized = inputSterilized.checked;

  const newPet = new PetData(id.toUpperCase(), name, age, type, weight, lenght, breed, color, vaccinated, dewormed, sterilized);

  // updateData
  PetData.petInfoArray.set(newPet.id, newPet);

  // display pets
  displayPetInfo(PetData.petInfoArray);

  // update localStorage
  saveToStorage("petInfo", PetData.petInfoArray);

  document.querySelector("form").reset();

  form.classList.add("hide");
});
