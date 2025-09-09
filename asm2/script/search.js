"use strict";

const containerPetsInfo = document.querySelector("#tbody");

const inputId = document.querySelector("#input-id");
const inputName = document.querySelector("#input-name");
const inputType = document.querySelector("#input-type");
const inputBreed = document.querySelector("#input-breed");
const inputVaccinated = document.querySelector("#input-vaccinated");
const inputDewormed = document.querySelector("#input-dewormed");
const inputSterilized = document.querySelector("#input-sterilized");
0;

// // Lưu trữ sự thay đổi của các input
// let changedFields = {};

// // Lắng nghe sự kiện change trên tất cả các input
// document.querySelectorAll("input, select").forEach((input) => {
//   input.addEventListener("change", function () {
//     if (input.type === "checkbox") {
//       changedFields[input.id] = input.checked ? "true" : "false";
//     } else {
//       changedFields[input.id] = input.value;
//     }
//   });
// });

// // Lắng nghe sự kiện click trên nút "Find"
// document.querySelector("#find-btn").addEventListener("click", () => {
//   // Duyệt qua các input đã thay đổi
//   for (const [id, value] of Object.entries(changedFields)) {
//     console.log(`Field ID: ${id}, Value: ${value}`);
//   }
// });

inputType.addEventListener("change", (e) => {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == inputType.value);

  breeds.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
});

document.querySelector("#find-btn").addEventListener("click", (e) => {
  const id = inputId.value;
  const name = inputName.value;
  const type = inputType.value;
  const breed = inputBreed.value;
  const vaccinated = inputVaccinated.checked;
  const dewormed = inputDewormed.checked;
  const sterilized = inputSterilized.checked;

  console.log(id, name, type, breed, vaccinated, dewormed, sterilized);

  const filteredPets = Array.from(PetData.petInfoArray.values()).filter((pet) => {
    return (
      (id ? pet.id?.toString().includes(id) : true) &&
      (name ? pet.name?.toLowerCase().includes(name.toLowerCase()) : true) &&
      (type !== "Select Type" ? pet.type == type : true) &&
      (breed !== "Select Breed" ? pet.breed == breed : true) &&
      (vaccinated ? pet.vaccinated == vaccinated : true) &&
      (dewormed ? pet.dewormed == dewormed : true) &&
      (sterilized ? pet.sterilized == sterilized : true)
    );
  });

  displayPetInfo(filteredPets);
});

function displayPetInfo(list) {
  containerPetsInfo.innerHTML = "";

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

    containerPetsInfo.innerHTML += html;
  });
}
