"use strict";

const btnSubmit = document.querySelector("#btn-submit");
const btnPrev = document.querySelector("#btn-prev");
const pageNumber = document.querySelector("#page-num");
const btnNext = document.querySelector("#btn-next");

const inputQuery = document.querySelector("#input-query");

const newsContainer = document.querySelector("#news-container");

const form = document.querySelector("form");

let data = [];
let query;

// If is logged in yet, navigate to Login page
if (!getFromStorage("CUR_USER")) window.location.href = "login.html";

// Hide btnPrev
btnPrev.setAttribute("style", "display: none;");

// Search btn event handler
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  query = (inputQuery.value + "").toLowerCase();

  if (!query) {
    console.log("Search key cannot be empty");
    return;
  }

  inputQuery.blur();
  inputQuery.value = "";

  User.findNews(1, query).then(([news, maxPage]) => {
    data = [...news];
    if (data.length == 0) {
      newsContainer.innerHTML = `
      <p style="text-align: center; font-size: 24px">No matching results found</p>
      `;
    } else renderNew(data);
  });
});

// Event handler from 'ENTER' keydown
form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

// Render news function
function renderNew(news) {
  newsContainer.innerHTML = "";

  Array.from(news).forEach(({ author, content, description, publishedAt, source, title, url, urlToImage }) => {
    const html = `
            <div class="card flex-row flex-wrap">
            <div class="card mb-3" style="">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img
                    src="${urlToImage || "../fallback.jpg"}"
                    class="card-img"
                    alt="${title || "Untitled"}"
                    onerror="this.onerror=null; this.src='../fallback.jpg';"
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${title || "Untitled"}</h5>
                    <p class="card-text">${description || ""}</p>
                    <a href="${url}" target="_blank" class="btn btn-primary">View</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;

    newsContainer.insertAdjacentHTML("beforeend", html);
  });
}

// btnNext event handler
btnNext.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText + 1;

  if (!query) {
    console.log("Search key cannot be empty");
    return;
  }

  btnPrev.setAttribute("style", "display: block;");

  // Render news
  User.findNews(page, query)?.then(([news, maxPage]) => {
    if (page == maxPage) {
      btnNext.setAttribute("style", "display: none;");
    }

    renderNew([...news]);
    pageNumber.innerText = page;
  });

  goToHead();
});

// btnPrev event handler
btnPrev.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText - 1;

  if (!query) {
    console.log("Search key cannot be empty");
    return;
  }

  btnNext.setAttribute("style", "display: block;");

  if (page != 0) {
    pageNumber.innerText = page;

    // Render news
    User.findNews(page, query)?.then(([news, maxPage]) => renderNew([...news]));
  }
  if (page == 1) btnPrev.setAttribute("style", "display: none;");

  goToHead();
});

// 'Go to head page' function
function goToHead() {
  document.querySelector("#nav-page-num").addEventListener("click", (e) => {
    if (e.target && e.target.closest("button")) {
      document.querySelector("#content").scrollIntoView({ behavior: "smooth" });
    }
  });
}
