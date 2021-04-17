import { sum } from "./sum";
import { getUsers } from "./users";

const p = new Proxy(sum, {});

console.log(`Sum(25,40) is : ${sum(25, 40)}`);
(async () => {
  const users = await getUsers(2);
  console.log(users);
})();
