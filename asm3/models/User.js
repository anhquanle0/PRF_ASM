"use strict";

const KEY = "USER_ARRAY";

const API_KEY = "2dc4e55d48ed4f8ea8f9f92662633f0f";

class User {
  constructor(firstName, lastName, username, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
  }

  static from({ firstName, lastName, username, password }) {
    return new User(firstName, lastName, username, password);
  }

  static async getData(pageSize = "10", page, category, country = "us") {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&${category ? `category=${category}&` : ""}pageSize=${pageSize}&${
      page ? `page=${page}&` : ""
    }language=en&apiKey=${API_KEY}`;
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const { status, totalResults, articles } = await response.json();

      console.log(totalResults, Array.from(articles).length);
      return [articles, Math.floor(totalResults / pageSize) + 1];
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }
}
