"use strict";
const inputQuery = document.querySelector("#input-query");

const btnSubmit = document.querySelector("#btn-submit");
const btnPrev = document.querySelector("#btn-prev");
const pageNumber = document.querySelector("#page-num");
const btnNext = document.querySelector("#btn-next");

const newsContainer = document.querySelector("#news-container");

let data = [];

///////////////////////////////////////////
if (!getFromStorage("CUR_USER")) {
  window.location.href = "login.html";
}

btnPrev.setAttribute("style", "display: none;");
///////////////////////////////////////////

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const query = getQuery();

  if (!query) {
    console.log("Invalid search key");
    return;
  }

  User.findNews(1, query).then(([news, maxPage]) => {
    data = [...news];
    if (data.length == 0) {
      newsContainer.innerHTML = `
      <p style="text-align: center; font-size: 24px">No matching results found</p>
      `;
    } else renderNew(data);
  });
});

function getQuery() {
  return (inputQuery.value + "").toLowerCase();
}

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

btnNext.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText + 1;
  const query = getQuery();

  if (!query) {
    console.log("Invalid search key");
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
});

btnPrev.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText - 1;
  const query = getQuery();

  if (!query) {
    console.log("Invalid search key");
    return;
  }

  btnNext.setAttribute("style", "display: block;");

  if (page != 0) {
    pageNumber.innerText = page;

    // Render news
    User.findNews(page, query)?.then(([news, maxPage]) => renderNew([...news]));
  }
  if (page == 1) btnPrev.setAttribute("style", "display: none;");
});

function goToHead() {
  document.querySelector("#nav-page-num").addEventListener("click", (e) => {
    if (e.target && e.target.closest("form")) {
      document.querySelector("h2").scrollIntoView({ behavior: "smooth" });
    }
  });
}
