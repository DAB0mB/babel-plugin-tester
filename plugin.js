const { createHandler } = require("./index");

function createProxy(
  module,
  t = { variableDeclaration: {}, variableDeclarator: {}, newExpression: {} }
) {
  const proxyIdentifier = t.identifier("Proxy");
  const arg1 = t.identifier(module);
  const arg2 = t.identifier("handlers");
  const declarator = t.variableDeclarator(
    t.identifier(`${module}Proxy`),
    t.newExpression(proxyIdentifier, [arg1, arg2])
  );
  return t.variableDeclaration("const", [declarator]);
}

function insertFireMockImport(t) {
  const localParamForSpecifier = t.identifier("fireMock");
  const specifier = t.importDefaultSpecifier(localParamForSpecifier);
  const source = t.StringLiteral("@hawaijar/fireMock");
  return t.importDeclaration([specifier], source);
}
function getHandlerFactory(t) {
  const handlersIdentifier = t.identifier("createHandler");
  const variableDeclarator = t.variableDeclarator(
    t.objectPattern([t.objectProperty(handlersIdentifier, handlersIdentifier)]),
    t.identifier("fireMock")
  );
  return t.variableDeclaration("const", [variableDeclarator]);
}
function addConsoleLog(t, param) {
  const memberExpression = t.memberExpression(
    t.identifier("console"),
    t.identifier("log")
  );
  const arguments = [t.identifier(param)];
  return t.callExpression(memberExpression, arguments);
}

function fireMocks(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      ImportDeclaration: function (path) {
        const { node, container } = path;
        if (node.source.value === "axios") {
          const module = node.source.value;
          path.insertAfter(insertFireMockImport(t));
          path.insertAfter(getHandlerFactory(t));
          //path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
          path.insertAfter(createProxy(module, t));
          path.insertAfter(addConsoleLog(t, "handlers"));
        }
        console.log(path);
      },
    },
  };
}
module.exports = fireMocks;
