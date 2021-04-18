const plugin = require("./plugin");
function createHandler(module, methods = []) {
  console.log("Yay working!!!");
  console.log("From createHandler():");
  console.log("module:", module);
  console.log("methods:", JSON.stringify(methods));
  const obj = Object.create({});
  for (let method of methods) {
    obj[method] = function () {};
  }
  return obj;
}

module.exports = {
  createHandler,
  default: plugin,
};
