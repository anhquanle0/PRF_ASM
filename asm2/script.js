"use strict";

const form = document.querySelector("form");
const containerPetsInfo = document.querySelector("#tbody");

const btnSubmit = document.querySelector("#submit-btn");
const btnHealthy = document.querySelector("#healthy-btn");
const btnBMI = document.querySelector("#bmi-btn");

const inputId = document.querySelector("#input-id");
const inputName = document.querySelector("#input-name");
const inputAge = document.querySelector("#input-age");
// const inputType = document.querySelector("#input-type");
const inputWeight = document.querySelector("#input-weight");
const inputLength = document.querySelector("#input-length");
// const inputBreed = document.querySelector("#input-breed");
const inputColor = document.querySelector("#input-color-1");
const inputVaccinated = document.querySelector("#input-vaccinated");
const inputDewormed = document.querySelector("#input-dewormed");
const inputSterilized = document.querySelector("#input-sterilized");

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

const petArr = new Map(initialPets);
displayPetInfo(petArr);

// Submit form
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

  // validate data
  if (validate(newPet)) {
    // updateData
    petArr.set(newPet.id, newPet);

    // display new pet
    displayPetInfo(petArr);

    // update localStorage
    saveToStorage("pet", petArr);

    // clear input fields
    clearInput();
  }
});

// Validate data function
function validate(pet) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const numberPattern = /^\d+$/;

  // Type-safe
  if (!pet instanceof PetData) return false;

  // Unique ID
  if (!pet.id) {
    showToast("Vui lòng nhập ID");
    inputId.focus();
    return false;
  } else if (Array.from(petArr.keys()).includes(pet.id)) {
    showToast("ID đã tồn tại");
    inputId.focus();
    return false;
  }

  // Name
  if (!pet.name) {
    showToast("Tên không được để trống");
    inputName.focus();
    return false;
  } else {
    if (!namePattern.test(pet.name)) {
      showToast("Tên không được tồn tại chữ số");
      inputName.focus();
      return false;
    }
  }

  // Age
  if (!numberPattern.test(pet.age) || pet.age <= 0 || pet.age > 50) {
    showToast("Tuổi không phù hợp");
    inputAge.focus();
    return false;
  }

  // Type
  if (pet.type == "Select Type") {
    showToast("Hãy chọn loại pet");
    return false;
  }

  // Weight
  if (!numberPattern.test(pet.weight) || pet.weight <= 5 || pet.weight > 100) {
    showToast("Hãy điền số cân nặng phù hợp");
    inputWeight.focus();
    return false;
  }

  // Length
  if (!numberPattern.test(pet.length) || pet.length <= 10 || pet.length > 200) {
    showToast("Hãy điền chiều dài phù hợp");
    inputLength.focus();
    return false;
  }

  // Breed
  if (pet.breed == "Select Breed") {
    showToast("Hãy chọn thức ăn cho pet");
    return false;
  }

  return true;
}

// Display info list
function displayPetInfo(list) {
  // Clear container
  containerPetsInfo.innerHTML = "";

  (list instanceof Map ? Array.from(list.values()) : list).forEach((pet) => {
    const name = pet.name ? pet.name[0].toUpperCase() + pet.name.slice(1).toLowerCase() + "" : "Unnamed";
    const dateAdded = new Date(pet.dateAdded).toLocaleDateString("en-US");

    const html = `
		<tr>
			<th scope="row">${pet.id}</th>
			<td>${name}</td>
			<td>${pet.age}</td>
			<td>${pet.type}</td>
			<td>${pet.weight ? pet.weight + "kg" : undefined}</td>
			<td>${pet.length ? pet.length + "cm" : undefined}</td>
			<td>${pet.breed}</td>
			<td>
			  <i class="bi bi-square-fill" style="color: ${pet.color}"></i>
			</td>
			<td><i class="bi bi-${pet.vaccinated ? "check" : "x"}-circle-fill"></i></td>
			<td><i class="bi bi-${pet.dewormed ? "check" : "x"}-circle-fill"></i></td>
			<td><i class="bi bi-${pet.sterilized ? "check" : "x"}-circle-fill"></i></td>			
			<td>${dateAdded}</td>
			<td>
        <button type="button" class="btn btn-danger">Delete</button>
			</td>
		</tr>  
  `;

    // containerPetsInfo.insertAdjacentHTML("beforeend", html);

    containerPetsInfo.innerHTML += html;
  });
}

// Clear input form
function clearInput() {
  // form.reset();

  inputId.value = inputName.value = inputAge.value = inputWeight.value = inputLength.value = "";
  inputType.value = "Select Type";
  inputBreed.value = "Select Breed";
  inputColor.value = "#000000";
  inputVaccinated.checked = inputDewormed.checked = inputSterilized.checked = false;
}

// Event handler DELETE btn
containerPetsInfo.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest(".btn-danger")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;
      // delete from Map
      petArr.delete(id);

      // remove record
      row.remove();

      // update localStorage
      saveToStorage("pet", petArr);
    }
  }
});

// Show healthy pet
btnHealthy.addEventListener("click", (e) => {
  e.preventDefault();

  // Clear container
  containerPetsInfo.innerHTML = "";
  btnHealthy.classList.toggle("show-all");

  if (btnHealthy.classList.contains("show-all")) {
    btnHealthy.textContent = " Show All Pet";
    displayPetInfo(
      Array.from(petArr.values()).filter((v) => {
        if (v.vaccinated && v.dewormed && v.sterilized) return v;
      })
    );
  } else {
    btnHealthy.textContent = " Show Healthy Pet";
    displayPetInfo(petArr);
  }
});

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
// ASM02

// 1. Sidebar toggle active
// sidebar.addEventListener("click", (e) => {
//   e.preventDefault();

//   if (e.target && e.target.closest("li")) {
//     const href = e.target.closest("a")?.href;
//     window.location.href = href;
//   } else {
//     sidebar.classList.toggle("active");
//   }
// });

// 2. Localstorage
// function saveToStorage(k, v) {
//   if (v instanceof Map) {
//     localStorage.setItem(k, JSON.stringify(Array.from(v.values())));
//   } else {
//     localStorage.setItem(k, JSON.stringify(v));
//   }
// }

// function getFromStorage(k) {
//   return JSON.parse(localStorage.getItem(k));
// }

// 4. Breed
// inputType.addEventListener("change", (e) => {
//   inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

//   const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == inputType.value);

//   breeds.forEach((el) => {
//     inputBreed.innerHTML += `<option>${el.breed}</option>`;
//   });
// });

// function renderBreed(type) {
//   inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

//   const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == type);

//   breeds.forEach((el) => {
//     const option = document.createElement("option");
//     option.innerHTML = el.breed;
//     inputBreed.appendChild(option);
//   });
// }
