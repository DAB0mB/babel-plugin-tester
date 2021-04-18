const t = require("babel-types");
const { createHandler } = require("./index");

function createProxy(module) {
  const proxyIdentifier = t.identifier("Proxy");
  const arg1 = t.identifier(module);
  const arg2 = t.identifier("handlers");
  const declarator = t.variableDeclarator(
    t.identifier(`${module}Proxy`),
    t.newExpression(proxyIdentifier, [arg1, arg2])
  );
  return t.variableDeclaration("const", [declarator]);
}
function insertFireMockImport() {
  const localParamForSpecifier = t.identifier("fireMock");
  const specifier = t.importDefaultSpecifier(localParamForSpecifier);
  const source = t.StringLiteral("@hawaijar/fireMock");
  return t.importDeclaration([specifier], source);
}
function getHandlerFactory() {
  const handlersIdentifier = t.identifier("createHandler");
  const variableDeclarator = t.variableDeclarator(
    t.objectPattern([t.objectProperty(handlersIdentifier, handlersIdentifier)]),
    t.identifier("fireMock")
  );
  return t.variableDeclaration("const", [variableDeclarator]);
}
function addConsoleLog(param) {
  const memberExpression = t.memberExpression(
    t.identifier("console"),
    t.identifier("log")
  );
  const arguments = [t.identifier(param)];
  return t.callExpression(memberExpression, arguments);
}

const parseImportDeclarations = {
  ImportDeclaration: function (path, state) {
    const { opts, localState } = state;
    localState.countImportStatement += 1;
    const listedModules = Object.keys(opts);
    const module = path.node.source.value;
    if (module in listedModules) {
      localState.gotImport = true;
      if (!localState["modules"].includes(module)) {
        localState["modules"].push(module);
      }
    }
    // if it's the last import, add ImportDeclaration for '@hawaijar/ngari/fireMock'
    if (localState.countImportStatement === localState.indexOfNonImportNode) {
      console.log("last module:", module);
      path.insertAfter(insertFireMockImport());
    } else {
      console.log("module:", module);
    }
    path.skip();

    // const { node } = path;
    // console.log(path.getAllNextSiblings());
    // if (node.source.value === "axios") {
    //   const module = node.source.value;
    //   path.insertAfter(insertFireMockImport());
    //   path.insertAfter(getHandlerFactory());
    //   //path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
    //   path.insertAfter(createProxy(module));
    //   path.insertAfter(addConsoleLog("handlers"));
    // }
    // console.log(path);
  },
};

const firstNonImportStatement = {};

function fireMocks(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      Program: function (path, state) {
        let localState = {
          gotImport: false,
          modules: [],
          countImportStatement: 0,
        };
        path.node.body.find((node, i) => {
          if (node.type !== "ImportDeclaration") {
            localState.indexOfNonImportNode = i;
            return node;
          }
        });
        path.traverse(parseImportDeclarations, { ...state, localState });
      },
    },
  };
}
module.exports = fireMocks;
