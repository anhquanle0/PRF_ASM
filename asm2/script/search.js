"use strict";

const containerPetsInfo = document.querySelector("#tbody");
const btnFind = document.querySelector("#find-btn");

const inputId = document.querySelector("#input-id");
const inputName = document.querySelector("#input-name");
const inputType = document.querySelector("#input-type");
const inputBreed = document.querySelector("#input-breed");
const inputVaccinated = document.querySelector("#input-vaccinated");
const inputDewormed = document.querySelector("#input-dewormed");
const inputSterilized = document.querySelector("#input-sterilized");

// Show breeds based on selected type
function renderBreed(type) {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = [...getFromStorage(BREED_KEY)].filter((el) => el.type == type);

  breeds?.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
}

// Event handler for FIND btn
btnFind.addEventListener("click", (e) => {
  const id = inputId.value;
  const name = inputName.value;
  const type = inputType.value;
  const breed = inputBreed.value;
  const vaccinated = inputVaccinated.checked;
  const dewormed = inputDewormed.checked;
  const sterilized = inputSterilized.checked;

  /*  "Lưu ý: Bạn sẽ cần tìm thú cưng đáp ứng đầy đủ các tiêu chí trên chứ không phải một trong các tiêu chí đó." from "https://courses.funix.edu.vn/courses/course-v1:FUNiX+PRF192x.2.2.VN+0923.CCDN/courseware/57b96b8a9fd8427ba8a6822620aa18a9/289b9cd944ba420bbf0e3b2b0b2e4269/"
      - Tiêu chí gì??? nếu yêu cầu là `đáp ứng đầy đủ các fields/trường trên` thì dòng liền kề bên dưới sẽ được un-comment
      - Theo như element này: 
      <p><span style="font-family: arial, helvetica, sans-serif;"><img src="https://firebasestorage.googleapis.com/v0/b/funix-way.appspot.com/o/xSeries%2FPRF192x%2FASM_Image%2FPRF192x_ASM2_H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20d%E1%BB%B1%20%C3%A1n_H%C3%ACnh%2010.png?alt=media&amp;token=5c361f32-dbd7-420f-87a7-807823cc4449" type="saveimage" target="[object Object]" width="1265" height="300"></span></p>
      thì không cần phải un-comment dòng liền kề
  */
  // if (!id || !name || type == "Select Type" || breed == "Select Breed") return;

  const filteredPets = [...initialPets.values()].filter(
    (pet) =>
      (id ? pet.id?.toLowerCase().includes(id.toLowerCase()) : true) &&
      (name ? pet.name?.toLowerCase().includes(name.toLowerCase()) : true) &&
      (type !== "Select Type" ? pet.type == type : true) &&
      (breed !== "Select Breed" ? pet.breed == breed : true) &&
      (vaccinated ? pet.vaccinated == vaccinated : true) &&
      (dewormed ? pet.dewormed == dewormed : true) &&
      (sterilized ? pet.sterilized == sterilized : true)
  );

  displayPetInfo(filteredPets);
});

// Form submit event handler
document.querySelector("form").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnFind.click();
  }
});

// display pet's info list
function displayPetInfo(pets) {
  // Clear container
  containerPetsInfo.innerHTML = "";

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
		</tr>  
  `;

    containerPetsInfo.insertAdjacentHTML("beforeend", html);
  });
}
