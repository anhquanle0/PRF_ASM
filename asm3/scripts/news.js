"use strict";

const newsContainer = document.querySelector("#news-container");

const btnPrev = document.querySelector("#btn-prev");
const pageNumber = document.querySelector("#page-num");
const btnNext = document.querySelector("#btn-next");

if (!getFromStorage("CUR_USER")) {
  window.location.href = "login.html";
}

// fetch("https://newsapi.org/v2/everything?q=*&sortBy=publishedAt&pageSize=100&language=en&apiKey=4374df249925490cb3ad9a565d7fac29")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   })
//   .then(({ articles }) => {
//     articles.forEach((el) => console.log(el.title));
//   })
//   .catch((error) => {
//     console.error("Fetch error:", error);
//   });

btnPrev.setAttribute("style", "display: none;");

let data = [];

const [page, category] = [10, "general"];
if (!getFromStorage("settings")) {
  User.PAGE_SIZE = page;
  User.CATEGORY = category;
} else {
  User.PAGE_SIZE = +getFromStorage("settings")[0];
  User.CATEGORY = (getFromStorage("settings")[1] + "").toLowerCase();
}

User.getData(1).then(([news, maxPage]) => {
  data = [...news];

  renderNew(data);
});

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

  btnPrev.setAttribute("style", "display: block;");

  // Render news
  User.getData(page)?.then(([news, maxPage]) => {
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

  btnNext.setAttribute("style", "display: block;");

  if (!page == 0) {
    pageNumber.innerText = page;

    // Render news
    User.getData(page)?.then(([news, maxPage]) => renderNew([...news]));
  }
  if (page == 1) btnPrev.setAttribute("style", "display: none;");
});
