"use strict";

const newsContainer = document.querySelector("#news-container");

const btnPrev = document.querySelector("#btn-prev");
const pageNumber = document.querySelector("#page-num");
const btnNext = document.querySelector("#btn-next");

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

// If isn't logged in yet, navigate to LOGIN page
if (!curUser) window.location.href = "login.html";

// Hide btnPrev
btnPrev.setAttribute("style", "display: none;");

// Render initial news
let data = [];
User.getNews(1).then(([news, maxPage]) => {
  data = [...news];

  renderNew(data);
});

// Render news function
function renderNew(news) {
  // Clear container
  newsContainer.innerHTML = "";

  [...news].map(({ author, content, description, publishedAt, source, title, url, urlToImage }) => {
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

// Btn NEXT event handler
btnNext.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText + 1;

  // Show PREV button
  btnPrev.setAttribute("style", "display: block;");

  User.getNews(page).then(([news, maxPage]) => {
    // Hide NEXT button if reach max page
    if (page == maxPage) {
      btnNext.setAttribute("style", "display: none;");
    }

    // Render news
    renderNew([...news]);
  });

  // Render page number
  pageNumber.innerText = page;
});

// Btn PREV event handler
btnPrev.addEventListener("click", (e) => {
  e.preventDefault();

  const page = +pageNumber.innerText - 1;

  // Show NEXT button
  btnNext.setAttribute("style", "display: block;");

  // Hide PREV button if page is 1
  if (page == 1) btnPrev.setAttribute("style", "display: none;");

  // Render news
  User.getNews(page).then(([news, maxPage]) => renderNew([...news]));

  // Render page number
  pageNumber.innerText = page;
});
