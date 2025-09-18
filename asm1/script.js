"use strict";

const form = document.querySelector("form");
const containerPetsInfo = document.querySelector("#tbody");

const btnSubmit = document.querySelector("#submit-btn");
const btnHealthy = document.querySelector("#healthy-btn");
const btnBMI = document.querySelector("#bmi-btn");

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
class PetData {
  bmi = 0;

  constructor(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded) {
    this.id = id.toUpperCase();
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
    this.dateAdded = new Date(dateAdded || Date.now());
    this.bmi = this._getBMI();
  }

  _getBMI() {
    if ((this.type + "").toLowerCase() == "dog") {
      return (this.weight * 703) / this.length ** 2;
    }
    return (this.weight * 886) / this.length ** 2;
  }
}

const pet1 = new PetData("P001", "Tom", 3, "Cat", 5, 50, "Tabby", "red", true, true, true, "2022/03/01");
const pet2 = new PetData("P002", "Tyke", 5, "Dog", 3, 40, "Mixed Breed", "green", false, false, false, "2022/03/02");

const petArr = [];
petArr.push(pet1);
petArr.push(pet2);

// print out the initial data
renderTableData(petArr);

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

// 1. Submit form
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  // 2. retrieve data
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

  const newPet = new PetData(id, name, age, type, weight, lenght, breed, color, vaccinated, dewormed, sterilized, 0);

  // 3. validate data
  if (validate(newPet)) {
    petArr.push(newPet);

    // 4. Render pet list
    renderTableData(petArr);

    // 5. Clear input fields
    clearInput();
  }
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
    alert("Inputs cannot be empty");
    return false;
  }

  // Unique ID
  const [existedPet] = findPet(id);
  if (existedPet) {
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

// Find pet function
function findPet(id) {
  const existedPet = petArr.find((pet) => pet.id == id);
  const index = petArr.findIndex((pet) => pet.id == id);

  return [existedPet, index];
}

// Warning message and focus on its input field
function warning(messages, inputSelector) {
  showAlert(messages);
  inputSelector?.focus();
}

// Display info list function
function renderTableData(pets) {
  // Clear container
  containerPetsInfo.innerHTML = "";

  [...pets].forEach((pet) => {
    const { id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded } = pet;
    const petName = name[0].toUpperCase() + name.slice(1).toLowerCase() + "";

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dateAdded);

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
			<td><span class="bmi">?</span></td>
			<td>${formattedDate}</td>
			<td>
        <button type="button" class="btn btn-danger">Delete</button>
			</td>
		</tr>  
  `;

    containerPetsInfo.insertAdjacentHTML("beforeend", html);
  });
}

// Clear input form function
function clearInput() {
  // form.reset();

  inputId.value = inputName.value = inputAge.value = inputWeight.value = inputLength.value = "";
  inputType.value = "Select Type";
  inputBreed.value = "Select Breed";
  inputVaccinated.checked = inputDewormed.checked = inputSterilized.checked = false;
}

// Alert announcement
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
        .toast.show { opacity:1; transform:translateY(0); }
        .toast.hide { opacity:0; transform:translateY(-60%); }
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

// 6. Delete record
containerPetsInfo.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.matches("button")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;
      const [, petIndex] = findPet(id);

      petArr.splice(petIndex, 1);

      row.remove();
    }
  }
});

// 7. Show healthy pet
btnHealthy.addEventListener("click", (e) => {
  e.preventDefault();

  // Clear container
  btnHealthy.classList.toggle("show-all");

  if (btnHealthy.classList.contains("show-all")) {
    btnHealthy.textContent = " Show All Pet";

    const healthyPets = petArr.filter((pet) => pet.vaccinated && pet.dewormed && pet.sterilized);
    renderTableData(healthyPets);
  } else {
    btnHealthy.textContent = " Show Healthy Pet";
    renderTableData(petArr);
  }
});

// 9. Calculate BMI
btnBMI.addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelectorAll(".bmi").forEach((e) => {
    const id = e.closest("tr").querySelector("th").textContent;

    const [currPet] = findPet(id);
    e.textContent = Math.round(currPet.bmi * 100) / 100;
  });
});
