"use strict";

function saveToStorage(k, v) {
  if (v instanceof Map) {
    localStorage.setItem(k, JSON.stringify(Array.from(v.values())));
  } else {
    localStorage.setItem(k, JSON.stringify(v));
  }
}

function getFromStorage(k) {
  return JSON.parse(localStorage.getItem(k));
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

const sidebar = document.querySelector("#sidebar");
if (localStorage.getItem("sidebar")) {
  if (getFromStorage("sidebar")) {
    sidebar.classList.add("active");
  } else {
    sidebar.classList.remove("active");
  }
}

// Sidebar active toggle
sidebar.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target && e.target.closest("li")) {
    const href = e.target.closest("a")?.href;
    window.location.href = href;
  } else {
    sidebar.classList.toggle("active");
    const isActived = sidebar.classList.contains("active");
    saveToStorage("sidebar", isActived);
  }
});

const inputBreed = document.querySelector("#input-breed");

// Utils
(function () {
  const STYLE_ID = "toastify-vanilla-style";
  const CONTAINER_ID = "toastify-vanilla-container";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const css = `
      /* Container giống react-toastify: top-right */
      #${CONTAINER_ID}{
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        pointer-events: none; /* cho click xuyên qua vùng trống */
      }

      .tv-toast{
        pointer-events: auto;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: start;
        gap: .75rem;
        min-width: 280px;
        max-width: min(420px, 86vw);
        padding: .75rem .875rem;
        border-radius: 8px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
        font-size: 14px;
        line-height: 1.35;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,.2), 0 4px 6px -2px rgba(0,0,0,.12);
        color: #fff;
        opacity: 0;
        transform: translateX(30px);
        transition: transform .35s ease, opacity .35s ease;
        position: relative;
        overflow: hidden; /* để progress bar ôm sát đáy */
      }
      .tv-toast--show{ opacity:1; transform: translateX(0); }
      .tv-toast--hide{ opacity:0; transform: translateX(50px); }

      .tv-toast__icon{
        width: 20px; height: 20px; margin-top: 2px; flex: 0 0 auto;
      }

      .tv-toast__body{
        white-space: normal; overflow-wrap: anywhere; word-break: break-word;
      }

      .tv-toast__close{
        appearance: none; border: 0; background: transparent; color: inherit;
        opacity: .85; cursor: pointer; font-size: 16px; line-height: 1;
        padding: 2px; margin-left: .25rem; border-radius: 6px;
      }
      .tv-toast__close:hover{ opacity: 1; background: rgba(255,255,255,.12); }

      /* Progress bar (giống react-toastify theme colored) */
      .tv-toast__progress{
        position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
        background: rgba(255,255,255,.5);
        transform-origin: left center;
        transform: scaleX(0);
      }

      /* Chủ đề màu theo status */
      .tv-toast--success{
        background: #2e7d32; /* xanh đậm dễ đọc */
      }
      .tv-toast--error{
        background: #d32f2f; /* đỏ đậm */
      }

      /* Close-on-focus style */
      .tv-toast:focus-visible{ outline: 2px solid rgba(255,255,255,.7); outline-offset: 2px; border-radius: 10px; }
    `;

    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function ensureContainer() {
    let ctn = document.getElementById(CONTAINER_ID);
    if (!ctn) {
      ctn = document.createElement("div");
      ctn.id = CONTAINER_ID;
      document.body.appendChild(ctn);
    }
    return ctn;
  }

  function svgIcon(kind) {
    if (kind === "success") {
      return `
        <div class="tv-toast__icon-wrap">
          <svg class="tv-toast__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="currentColor" opacity=".2"/>
            <path d="M9.2 12.6l1.9 1.9 4.7-4.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>`;
    }
    return `
      <div class="tv-toast__icon-wrap">
        <svg class="tv-toast__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2"/>
          <path d="M12 7v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1.3" fill="currentColor"/>
        </svg>
      </div>`;
  }

  /**
   * showToast(message, status?)
   * status: "success" | "error" (mặc định "error" nếu không truyền)
   */
  window.showToast = function (message, status = "error") {
    ensureStyles();
    const container = ensureContainer();
    const kind = status === "success" ? "success" : "error";

    const toast = document.createElement("div");
    toast.className = `tv-toast tv-toast--${kind}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.tabIndex = 0; // có thể focus bằng bàn phím

    // Nội dung
    const iconWrap = document.createElement("div");
    iconWrap.innerHTML = svgIcon(kind);

    const body = document.createElement("div");
    body.className = "tv-toast__body";
    body.textContent = message ?? ""; // tránh null/undefined

    const btnClose = document.createElement("button");
    btnClose.className = "tv-toast__close";
    btnClose.setAttribute("aria-label", "Close");
    btnClose.innerHTML = "&times;";

    const progress = document.createElement("div");
    progress.className = "tv-toast__progress";

    toast.appendChild(iconWrap.firstElementChild);
    toast.appendChild(body);
    toast.appendChild(btnClose);
    toast.appendChild(progress);

    container.appendChild(toast);

    // Animation in
    requestAnimationFrame(() => toast.classList.add("tv-toast--show"));

    // Auto close + progress bar (pause on hover)
    const AUTO_CLOSE_MS = 3500;
    let remaining = AUTO_CLOSE_MS;
    let startTs = performance.now();
    let rafId = null;
    let closed = false;

    function setProgress(p) {
      // p: 0..1
      progress.style.transform = `scaleX(${p})`;
    }

    function tick(now) {
      const elapsed = now - startTs;
      const p = Math.min(elapsed / AUTO_CLOSE_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        hideAndRemove();
      }
    }
    rafId = requestAnimationFrame(tick);

    function pause() {
      if (closed) return;
      cancelAnimationFrame(rafId);
      const now = performance.now();
      remaining -= now - startTs;
    }
    function resume() {
      if (closed) return;
      startTs = performance.now();
      // tiếp tục từ phần còn lại
      const ratioDone = 1 - remaining / AUTO_CLOSE_MS;
      setProgress(ratioDone);
      // chạy tiếp bằng setTimeout + progress mượt bằng rAF
      const endAt = performance.now() + remaining;
      function tickResume(now) {
        const left = Math.max(0, endAt - now);
        const p = 1 - left / AUTO_CLOSE_MS;
        setProgress(Math.min(1, p));
        if (left > 0) {
          rafId = requestAnimationFrame(tickResume);
        } else {
          hideAndRemove();
        }
      }
      rafId = requestAnimationFrame(tickResume);
    }

    toast.addEventListener("mouseenter", pause);
    toast.addEventListener("mouseleave", resume);
    btnClose.addEventListener("click", () => hideAndRemove());
    // Đóng bằng phím Esc khi đang focus
    toast.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideAndRemove();
    });

    function hideAndRemove() {
      if (closed) return;
      closed = true;
      cancelAnimationFrame(rafId);
      toast.classList.add("tv-toast--hide");
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }

    return toast; // trả về node để tuỳ biến nếu cần
  };
})();

// Alert pop-up
// function showAlert(message) {
//   if (!document.getElementById("toast-style")) {
//     const css = `
//         .toast {
//           position: fixed;
//           top: 0;
//           right: 20px;
//           margin-top: 20px;
//           z-index: 9999;
//           background:#fff;
//           color:#ff1a1a;
//           font-size: 16px;
//           padding:10px 16px;
//           border-radius:6px;
//           font-family:sans-serif;
//           box-shadow:0 2px 8px rgba(0,0,0,.2);
//           display:inline-block;
//           width:fit-content;
//           width:-moz-fit-content;
//           width:max-content;
//           max-width:80vw;
//           white-space:normal;
//           overflow-wrap:anywhere;
//           word-break:break-word;
//           opacity:0;
//           transform:translateY(-100%);
//           transition:transform .35s ease, opacity .35s ease;
//         }

//         .toast.show { opacity:1; transform:translateX(0); }
//         .toast.hide { opacity:0; transform:translateX(60%); }
//       `;
//     const s = document.createElement("style");
//     s.id = "toast-style";
//     s.textContent = css;
//     document.head.appendChild(s);
//   }

//   const el = document.createElement("div");
//   el.className = "toast";
//   el.textContent = message;
//   document.body.appendChild(el);
//   requestAnimationFrame(() => el.classList.add("show"));
//   setTimeout(() => {
//     el.classList.add("hide");
//     el.addEventListener("transitionend", () => el.remove(), { once: true });
//   }, 3000);
// }

// Sidebar active toggle

if (localStorage.getItem("sidebar")) {
  if (getFromStorage("sidebar")) {
    sidebar.classList.add("active");
  } else {
    sidebar.classList.remove("active");
  }
}

// Show breeds based on selected type
function renderBreed(type) {
  inputBreed.innerHTML = `<option disabled selected hidden>Select Breed</option>`;

  const breeds = Array.from(getFromStorage("breed")).filter((el) => el.type == type);

  breeds?.forEach((el) => {
    inputBreed.innerHTML += `<option>${el.breed}</option>`;
  });
}

function sortBreed(arr) {
  if (!Array.isArray(arr)) return;

  const valid = arr.every((el) => el instanceof BreedData);
  if (!valid) return;

  arr.sort((a, b) => {
    const typeCompare = a.type.localeCompare(b.type);
    if (typeCompare !== 0) return typeCompare;
    return a.breed.localeCompare(b.breed);
  });
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
// Retrieve data
class PetData {
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
  }

  static from({ id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded }) {
    return new PetData(id, name, age, type, weight, length, breed, color, vaccinated, dewormed, sterilized, dateAdded);
  }
}

let initialPets = new Map();
if (!getFromStorage("pet")) {
  addPet(new PetData("P001", "Dober Mix", 3, "Dog", 12, 87, "Doberman Pinscher", "#e08f8f", true, true, true, "2022-03-03T17:00:00.000Z"));
  addPet(new PetData("P002", "Charlie Tux", 4, "Cat", 4, 65, "Tabby", "#8cee9c", true, false, false, "2022-03-03T17:00:00.000Z"));
  addPet(new PetData("P003", "Sweetie Pie", 3, "Dog", 6, 45, "Husky", "#ff1414", false, false, true, "2022-03-03T17:00:00.000Z"));
  addPet(new PetData("P004", "Chocolate And Kitten", 4, "Cat", 6, 87, "Mixed Breed", "#e9e22b", false, false, false, "2022-03-03T17:00:00.000Z"));
  addPet(new PetData("P005", "Symph", 6, "Dog", 8, 77, "Doberman Pinscher", "#46b4a7", true, true, true, "2022-03-03T17:00:00.000Z"));

  saveToStorage("pet", initialPets);
} else {
  getFromStorage("pet").forEach((el) => addPet(PetData.from(el)));
}

function addPet(pet) {
  initialPets.set(pet.id, pet);
}

class BreedData {
  constructor(breed, type) {
    this.breed = breed;
    this.type = type;
  }

  static from(o) {
    return new BreedData(o.breed, o.type);
  }
}

let initialBreeds;
if (!getFromStorage("breed")) {
  initialBreeds = [
    new BreedData("Tabby", "Cat"),
    new BreedData("Mixed Breed", "Cat"),
    new BreedData("Mixed Breed", "Dog"),
    new BreedData("Husky", "Dog"),
    new BreedData("Domestic Short Hair", "Cat"),
    new BreedData("Doberman Pinscher", "Dog"),
  ];

  saveToStorage("breed", initialBreeds);
} else {
  initialBreeds = getFromStorage("breed").map((e) => BreedData.from(e));
}
sortBreed(initialBreeds);
console.log(initialBreeds);
