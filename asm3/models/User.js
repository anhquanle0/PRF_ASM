"use strict";

const KEY = "USER_ARRAY";

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
}
