const handlers = {};

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
function getHandlers(t) {
  const handlersIdentifier = t.identifier("handlers");
  const variableDeclarator = t.variableDeclarator(
    t.objectPattern([t.objectProperty(handlersIdentifier, handlersIdentifier)]),
    t.identifier("fireMock")
  );
  return t.variableDeclaration("const", [variableDeclarator]);
}

module.exports = (babel) => {
  const { types: t } = babel;
  return {
    visitor: {
      ImportDeclaration(path = { insertAfter: {} }) {
        const { node } = path;
        if (node.source.value === "axios") {
          const module = node.source.value;
          path.insertAfter(insertFireMockImport(t));
          path.insertAfter(getHandlers(t));
          //path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
          path.insertAfter(createProxy(module, t));
        }
        console.log(path);
      },
    },
  };
};
