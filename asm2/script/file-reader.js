"use strict";

// const file = document.querySelector("#input-file").files[0];
// if (file) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     document.getElementById("fileContents").innerHTML = evt.target.result;
//   };
//   reader.onerror = function (evt) {
//     document.getElementById("fileContents").innerHTML = "error reading file";
//   };
// }

////////////////////////
////////////////////////
////////////////////////
const inputFile = document.querySelector("#input-file");
const btnImport = document.querySelector("#import-btn");

const dataFromStorage = [...initialPets];

btnImport.addEventListener("click", (e) => {
  try {
    const file = inputFile.files?.[0];
    if (!file) {
      showToast("Vui lòng chọn file JSON trước khi import.");
      return;
    }
    // check loại file cơ bản
    if (!file.name.toLowerCase().endsWith(".json")) {
      const ok = confirm("File không có đuôi .json. Vẫn tiếp tục import?");
      if (!ok) return;
    }

    importFromFile(file).then(({ success, duplicated }) => {
      showToast(`Import thành công ${success} bản ghi (trùng ${duplicated})`, "success");
    });

    setTimeout(() => (window.location.href = "../index.html"), 3500);
  } catch (err) {
    console.error(err);
    showToast(`Import thất bại: ${err.message || err}`);
  } finally {
    // nếu muốn cho phép import lại cùng file, có thể reset input
    // inputFile.value = "";
  }
});

// Form submit event handler
document.querySelector("form").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnImport.click();
  }
});

async function importFromFile(file) {
  const text = await file.text();
  let data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("File JSON phải là một mảng các object.");
  }

  // Chuyển từng object JSON -> instance PetData
  const importedPets = data.map((o, idx) => {
    const required = ["id", "name", "age", "type", "weight", "length", "breed", "color", "vaccinated", "dewormed", "sterilized"];
    for (const k of required) {
      if (!(k in o)) {
        throw new Error(`Bản ghi #${idx + 1} thiếu trường bắt buộc: ${k}`);
      }
    }

    const dateAdded = "dateAdded" in o && o.dateAdded && String(o.dateAdded).trim() !== "" ? o.dateAdded : Date.now();

    return new PetData(o.id, o.name, o.age, o.type, o.weight, o.length, o.breed, o.color, o.vaccinated, o.dewormed, o.sterilized, dateAdded);
  });

  // Merge data
  let merged = new Map(dataFromStorage.map((p) => [p.id, p]));

  let duplicated = [];
  importedPets.map((p) => {
    if (merged.get(p.id)) duplicated.push(p);
    merged.set(p.id, p);
  });

  saveToStorage(PET_KEY, merged);

  return { success: importedPets.length, duplicated: duplicated.length };
}
