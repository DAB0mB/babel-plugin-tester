const babel = require("@babel/core");
const fs = require("fs");
const plugin = require("./plugin");
const importPlugin = require("babel-plugin-import");

const code = fs.readFileSync(`${__dirname}/in.js`).toString();

const transformedCode = babel.transform(code, {
  plugins: [
    [
      importPlugin,
		{
			"libraryName": "lodash",
			"libraryDirectory": "",
			"camel2DashComponentName": false,  // default: true
		},
    ],
    [
      plugin,
      {
        axios: ["get", "post", "put", "delete"],
        "kafka-node": [
          "listGroups",
          "describeGroups",
          "listTopics",
          "fetchCommits",
          "fetchLatestOffsets",
          "fetchEarliestOffsets",
          "fetch",
        ],
      },
    ],
  ],
  code: true,
  ast: false,
}).code;

fs.writeFileSync(`${__dirname}/out.js`, transformedCode);
