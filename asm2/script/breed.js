"use strict";

const containerBreedsInfo = document.querySelector("#tbody");
const btnSubmit = document.querySelector("#submit-btn");

const inputBreed = document.querySelector("#input-breed");
const inputType = document.querySelector("#input-type");

let breedArr = initialBreed ?? [];
renderBreedTable(breedArr);

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const breedObj = new BreedData(inputBreed.value, inputType.value);

  if (validate(breedObj)) {
    breedArr = [...breedArr, breedObj];

    renderBreedTable(breedArr);

    console.log(breedObj);

    saveToStorage("breed", [...getFromStorage("breed"), breedObj]);
  }
});

function validate(breedObj) {
  // Breed
  if (breedObj.breed == "Select Breed") {
    console.error("Hãy chọn thức ăn cho pet");
    return false;
  }

  // Type
  if (breedObj.type == "Select Type") {
    showAlert("Hãy chọn loại pet");
    return false;
  }

  return true;
}

function renderBreedTable(breedArr) {
  Array.from(breedArr)?.forEach((v, i) => {
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

containerBreedsInfo.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest(".btn-danger")) {
    if (confirm("Are you sure?")) {
      const row = e.target.closest("tr");
      const id = row.querySelector("th").textContent;

      // remove record
      row.remove();

      // update data
      breedArr.splice(id - 1, 1);

      // update localStorage
      saveToStorage("breed", breedArr);
    }
  }
});
