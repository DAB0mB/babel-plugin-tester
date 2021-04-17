import axios from "axios";

const handlers = {
  get: function (target, prop, receiver) {
    if (prop === "message2") {
      return "world";
    }
    return Reflect.get(...arguments);
  },
};

const p = new Proxy(axios, handlers);

export async function getUsers(n) {
  const users = await p.get("https://jsonplaceholder.typicode.com/users");
  const { data } = users;
  return data.slice(0, n);
}
