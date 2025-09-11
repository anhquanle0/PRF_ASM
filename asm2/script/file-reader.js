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

let dataFromStorage = [];
Array.from(getFromStorage("pet")).map((pet) => dataFromStorage.push(pet));

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
  } catch (err) {
    console.error(err);
    showToast(`Import thất bại: ${err.message || err}`);
  } finally {
    // nếu muốn cho phép import lại cùng file, có thể reset input
    // inputFile.value = "";
  }
});

function mergeById(oldArr, newArr) {
  const map = new Map(oldArr.map((p) => [p.id, p]));
  for (const p of newArr) map.set(p.id, p);
  return Array.from(map.values());
}

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

    // File mẫu có "date" (ISO). Nếu có -> truyền làm tham số 12 (dateAdded)
    const dateAdded = "date" in o && o.date != null && String(o.date).trim() !== "" ? o.date : null;

    if (dateAdded) {
      return new PetData(o.id, o.name, o.age, o.type, o.weight, o.length, o.breed, o.color, o.vaccinated, o.dewormed, o.sterilized, dateAdded);
    } else {
      // Không có date -> để constructor tự set hôm nay
      return new PetData(o.id, o.name, o.age, o.type, o.weight, o.length, o.breed, o.color, o.vaccinated, o.dewormed, o.sterilized);
    }
  });

  // Merge data
  let merged = new Map();
  dataFromStorage.forEach((el) => merged.set(el.id, el));

  let duplicated = [];
  importedPets.forEach((v) => {
    if (merged.set(v.id, v)) duplicated.push(v);
  });

  saveToStorage("pet", merged);

  return { success: importedPets.length, duplicated: duplicated.length };
}
