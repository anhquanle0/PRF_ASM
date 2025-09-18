"use strict";

const API_KEY = "2dc4e55d48ed4f8ea8f9f92662633f0f";

class User {
  static PAGE_SIZE;
  static CATEGORY;

  constructor(firstName, lastName, username, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
  }

  static from(o) {
    if (!o) return null;
    return new User(o.firstName, o.lastName, o.username, o.password);
  }

  static async getNews(page, query, category = User.CATEGORY, pageSize = User.PAGE_SIZE, country = "us") {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${pageSize}&category=${category}&${
      page ? `page=${page}&` : ""
    }language=en&${query ? `q=${query}&` : ""}apiKey=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const { status, totalResults, articles } = await response.json();

      return [articles, Math.floor(totalResults / pageSize) + 1];
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }

  static findNews(page, query, category) {
    return User.getNews(page, query, category ?? User.CATEGORY);
  }
}
