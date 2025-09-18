"use strict";

const form = document.querySelector("form");
const containerPetsInfo = document.querySelector("#tbody");

const btnSubmit = document.querySelector("#submit-btn");
const btnHealthy = document.querySelector("#healthy-btn");

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

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

const petMap = new Map(
  initialPets.map((pet) => {
    return [pet.id, pet];
  })
);
renderTableData(petMap.values());

// Submit form
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

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

  const newPet = new PetData(id, name, age, type, weight, lenght, breed, color, vaccinated, dewormed, sterilized);

  // validate data
  if (!validate(newPet)) return;

  // updateData
  petMap.set(newPet.id, newPet);

  // display new pet
  renderTableData(petMap.values());

  // update localStorage
  saveToStorage(PET_KEY, petMap.values());

  // clear input fields
  clearInput();

  // annoucement
  showToast("New pet added!", "success");
});

// Form submit event handler
form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

// Validate data function
function validate(pet) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const numberPattern = /^\d+$/;

  const { id, name, age, type, weight, length, breed } = pet;

  // Type-safe
  if (!pet instanceof PetData) return false;

  if (!id || !name || !age || !weight || !length) {
    warning("Inputs cannot be empty");
    return false;
  }

  // Unique ID
  if (petMap.get(id)) {
    warning("ID must be unique!", inputId);
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

// Display info list
function renderTableData(pets) {
  // Clear container
  containerPetsInfo.innerHTML = "";

  [...pets].forEach((pet) => {
    const { id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded } = pet;
    const petName = name[0].toUpperCase() + name.slice(1).toLowerCase() + "";

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
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
        <button type="button" class="btn btn-danger">Delete</button>
			</td>
		</tr>  
  `;

    containerPetsInfo.insertAdjacentHTML("beforeend", html);
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

  if (e.target && e.target.matches("button")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;
      // delete from Map
      petMap.delete(id);

      // remove record
      row.remove();

      // update localStorage
      saveToStorage(PET_KEY, petMap.values());

      // annoucement
      showToast("Pet removed!", "success");
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

    const healthyPets = [...petMap.values()].filter((v) => v.vaccinated && v.dewormed && v.sterilized);
    renderTableData(healthyPets);
  } else {
    btnHealthy.textContent = " Show Healthy Pet";
    renderTableData(petMap.values());
  }
});

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
// ASM2

// Render breed list based on selected type
function renderBreed(type) {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = [...getFromStorage(BREED_KEY)].filter((el) => el.type == type);

  breeds.map(({ breed }) => {
    inputBreed.innerHTML += `<option>${breed}</option>`;
  });
}
// Annoucement
function warning(message, selector) {
  selector?.focus();
  showToast(message);
}
