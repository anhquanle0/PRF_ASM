"use strict";

const KEY = "USER_ARRAY";

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

  static from({ firstName, lastName, username, password }) {
    return new User(firstName, lastName, username, password);
  }

  static async getData(page, pageSize = User.PAGE_SIZE, category = User.CATEGORY, country = "us") {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${pageSize}&category=${category}&${
      page ? `page=${page}&` : ""
    }language=en&apiKey=${API_KEY}`;

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
}

// initial data
let userArr = [
  new User("John", "Doe", "johndoe", "password123"),
  new User("Jane", "Smith", "janesmith", "mypassword"),
  new User("Minh", "Nguyen", "minhnguyen", "123456"),
  new User("Linh", "Tran", "linhtran", "linh@2024"),
  new User("Bao", "Pham", "baopham", "bao!secure"),
];
