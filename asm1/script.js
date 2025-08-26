"use strict";

const containerPetsInfo = document.querySelector("#tbody");
const form = document.querySelector("form");

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

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
class PetData {
  constructor(
    id,
    name,
    age,
    type,
    weight,
    length,
    breed,
    color,
    vaccinated,
    dewormed,
    sterilized,
    dateAdded
  ) {
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
    this.dateAdded = dateAdded;
  }
}

const pet1 = new PetData(
  "P001",
  "Tom",
  3,
  "Cat",
  5,
  50,
  "Tabby",
  "red",
  true,
  true,
  true,
  "2022-03-01"
);
const pet2 = new PetData(
  "P002",
  "Tyke",
  5,
  "Dog",
  3,
  40,
  "Mixed Breed",
  "green",
  false,
  false,
  false,
  "2022-03-02"
);
const petInfoArray = new Map();
petInfoArray.set(pet1.id, pet1);
petInfoArray.set(pet2.id, pet2);
petInfoArray.forEach((pet) => displayPetInfo(pet));

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

// 1. Submit form
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

  const newPet = new PetData(
    id,
    name,
    age,
    type,
    weight,
    lenght,
    breed,
    color,
    vaccinated,
    dewormed,
    sterilized,
    new Date().toLocaleDateString("en-GB")
  );

  if (validate(newPet)) {
    // display new pet
    displayPetInfo(newPet);

    // clear input fields
    clearInput();
  }
});

// 2. Validate data
function validate(pet) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const numberPattern = /^\d+$/;

  // a. Type-sage
  if (!pet instanceof PetData) return false;

  // b. Unique ID
  if (pet.id == "") {
    showAlert("Vui lòng nhập ID");
    inputId.focus();
    return false;
  } else if (Array.from(petInfoArray.keys()).includes(pet.id)) {
    showAlert("ID đã tồn tại");
    inputId.focus();
    return false;
  }

  // c. Name
  if (!namePattern.test(pet.name)) {
    showAlert("Tên không được tồn tại chữ số");
    inputName.focus();
    return false;
  }

  // d. Age
  if (!numberPattern.test(pet.age) || pet.age <= 0 || pet.age > 50) {
    showAlert("Tuổi không phù hợp");
    inputAge.focus();
    return false;
  }

  // e. Type
  if (pet.type == "Select Type") {
    showAlert("Hãy chọn loại pet");
    return false;
  }

  // f. Weight
  if (!numberPattern.test(pet.weight) || pet.weight <= 5 || pet.weight > 100) {
    showAlert("Hãy điền số cân nặng phù hợp");
    inputWeight.focus();
    return false;
  }

  // g. Length
  if (!numberPattern.test(pet.length) || pet.length <= 10 || pet.length > 200) {
    showAlert("Hãy điền chiều dài phù hợp");
    inputLength.focus();
    return false;
  }

  // h. Breed
  if (pet.breed == "Select Breed") {
    showAlert("Hãy chọn thức ăn cho pet");
    return false;
  }

  return petInfoArray.set(pet.id, pet);
}

// 3. Display info list
function displayPetInfo(pet) {
  const id = pet.id.toUpperCase();
  const name = pet.name[0].toUpperCase() + pet.name.slice(1).toLowerCase() + "";

  containerPetsInfo.innerHTML += `
						<tr>
							<th scope="row">${id}</th>
							<td>${name}</td>
							<td>${pet.age}</td>
							<td>${pet.type}</td>
							<td>${pet.weight} kg</td>
							<td>${pet.lenght} cm</td>
							<td>${pet.breed}</td>
							<td>
								<i class="bi bi-square-fill" style="color: ${pet.color}"></i>
							</td>
							<td><i class="bi bi-${pet.vaccinated ? "check" : "x"}-circle-fill"></i></td>
							<td><i class="bi bi-${pet.dewormed ? "check" : "x"}-circle-fill"></i></td>
							<td><i class="bi bi-${pet.sterilized ? "check" : "x"}-circle-fill"></i></td>
							<td>${pet.dateAdded}</td>
							<td><button type="button" class="btn btn-danger">Delete</button>
							</td>
						</tr>  
  `;
}

// 4. Clear input form
function clearInput() {
  // form.reset();

  inputId.value =
    inputName.value =
    inputAge.value =
    inputWeight.value =
    inputLength.value =
      "";
  inputType.value = "Select Type";
  inputBreed.value = "Select Breed";
  inputVaccinated.checked =
    inputDewormed.checked =
    inputSterilized.checked =
      false;
}

// 5. Alert announcement
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

// 6. Delete row
document.querySelectorAll(".btn-danger").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;
      petInfoArray.delete(id);
      row.remove();
    }
  })
);
