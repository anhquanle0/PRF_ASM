"use strict";

const containerBreedsInfo = document.querySelector("#tbody");
const btnSubmit = document.querySelector("#submit-btn");

// const inputBreed = document.querySelector("#input-breed");
// const inputType = document.querySelector("#input-type");

let breedArr = initialBreeds ?? [];
renderBreedTable(breedArr);

// 1. Event handler for SUBMIT btn
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const newBreed = new BreedData(inputBreed.value, inputType.value);

  if (validate(newBreed)) {
    breedArr = [...breedArr, newBreed];

    renderBreedTable(breedArr);

    saveToStorage("breed", breedArr);
  }
});

// 2. Validate input fields functionality
function validate(breedObj) {
  if (!breedObj.breed) {
    alert("Please enter breed");
    return false;
  }

  if (breedObj.type == "Select Type") {
    alert("Please select type");
    return false;
  }

  return true;
}

// 3. Show breed list functionality
function renderBreedTable(list) {
  containerBreedsInfo.innerHTML = "";

  Array.from(list)?.forEach((v, i) => {
    const html = `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${v.breed}</td>
      <td>${v.type}</td>
      <td>
        <button type="button" class="btn btn-danger">Delete</button>
      </td>
    </tr>  
  `;

    containerBreedsInfo.innerHTML += html;
  });
}

// 4. Event handler for DELETE btn
containerBreedsInfo.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest(".btn-danger")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;

      row.remove();

      breedArr.splice(id - 1, 1);

      saveToStorage("breed", breedArr);

      renderBreedTable(breedArr);
    }
  }
});
