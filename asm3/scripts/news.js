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

let data = [];

User.getData(1).then((res) => {
  data = [...res];

  renderNew(data);
});

function renderNew(news) {
  newsContainer.innerHTML = "";

  news.forEach(({ author, content, description, publishedAt, source, title, url, urlToImage }) => {
    if (!urlToImage) return;

    const html = `
            <div class="card flex-row flex-wrap">
            <div class="card mb-3" style="">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img
                    src="${urlToImage}"
                    class="card-img"
                    alt="${title}" />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <a href="${url}" class="btn btn-primary">View</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;

    newsContainer.insertAdjacentHTML("beforeend", html);
  });
}
