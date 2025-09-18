"use strict";

const containerBreedsInfo = document.querySelector("#tbody");
const btnSubmit = document.querySelector("#submit-btn");

const inputBreed = document.querySelector("#input-breed");
const inputType = document.querySelector("#input-type");

// Render data from localStorage
let breedArr = [...initialBreeds];
renderBreedTable(breedArr);

// Event handler for SUBMIT btn
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const breed = inputBreed.value;
  const type = inputType.value;

  const newBreed = new BreedData(breed, type);

  if (!validate(newBreed)) return;

  const existedBreed = breedArr.find((el) => el.breed == breed);
  if (existedBreed?.type == type) {
    showToast("This breed is existed");
    return;
  }

  // update data
  breedArr.push(newBreed);

  // render modified list
  renderBreedTable(breedArr);

  // update storage
  saveToStorage(BREED_KEY, breedArr);

  // hide form
  document.querySelector("form").reset();

  // annoucement
  showToast("New breed added!", "success");
});

// Form submit event handler
document.querySelector("form").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

// Validate input fields function
function validate({ breed, type }) {
  if (breed) {
    showToast("Please enter breed");
    return false;
  }

  if (type == "Select Type") {
    showToast("Please select type");
    return false;
  }

  return true;
}

// Show breed list function
function renderBreedTable(pets) {
  // Clear container
  containerBreedsInfo.innerHTML = "";

  [...pets].forEach(({ breed, type }, i) => {
    const html = `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${breed}</td>
      <td>${type}</td>
      <td>
        <button type="button" class="btn btn-danger">Delete</button>
      </td>
    </tr>  
  `;

    containerBreedsInfo.insertAdjacentHTML("beforeend", html);
  });
}

// Event handler for DELETE btn
containerBreedsInfo.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.matches("button")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;

      // remove row
      row.remove();

      // update data
      breedArr.splice(id - 1, 1);

      // update storage
      saveToStorage(BREED_KEY, breedArr);

      // render modified list
      renderBreedTable(breedArr);

      // annoucement
      showToast("Breed removed!", "success");
    }
  }
});
