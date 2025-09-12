"use strict";

const KEY = "USER_ARRAY";

const API_KEY = "4374df249925490cb3ad9a565d7fac29";

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

  static async getData(page) {
    const url = `https://newsapi.org/v2/everything?q=*&sortBy=publishedAt&pageSize=10&page=${page}&language=en&apiKey=${API_KEY}`;
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const { articles } = await response.json();
      return articles;
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
}
