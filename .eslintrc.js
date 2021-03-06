module.exports = {
  "extends": ["taro"],
  "globals": {"my": "readonly","Component":"readonly","Page": "readonly","requirePlugin":"readonly"},
  "plugins": [
      "require-jsdoc-except"
  ],
  "rules": {
      "arrow-spacing":["error", { "before": true, "after": true }],
      "indent": ["error",4,{"SwitchCase": 1}],
      "react/jsx-indent-props":"off",
      "react/jsx-indent":"off",
      "no-unused-vars": ["error", { "varsIgnorePattern": "Taro" }],
      "no-shadow": ["off"],
      "no-undef": ["error"],
      "no-debugger": ["error"],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
      "import/first": "off",
      "import/prefer-default-export": ["off"],
    //   "no-console": ["error", { "allow": ["warn", "error"] }],
      "max-statements": ["error", 100],
      "require-jsdoc-except/require-jsdoc": ["error", {
          "require": {
              "FunctionDeclaration": true,
              "MethodDefinition": true
              //"ClassDeclaration": true,
              //"ArrowFunctionExpression": true,
              //"FunctionExpression": true
          },
          "ignore": [
              "constructor",
              "componentWillMount",
              "componentDidMount",
              "componentDidUpdate",
              "componentWillReceiveProps",
              "shouldComponentUpdate",
              "componentWillUpdate",
              "componentWillUnmount",
              "componentWillPreload",
              "componentDidShow",
              "componentDidHide",
              "componentDidCatchError",
              "componentDidNotFound",
              "onPullDownRefresh",
              "onReachBottom",
              "onPageScroll",
              "onShareAppMessage",
              "onTabItemTap",
              "onResize",
              "/.+Reducer/",
              "/render.*/"
          ]
      }],
      // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
      "semi": [2, "always"],
      // 强制分号之前和之后使用一致的空格
      "semi-spacing": 0,
      // 要求同一个声明块中的变量按顺序排列
      "sort-vars": 0,
      // 强制在块之前使用一致的空格
      "space-before-blocks": [2, "always"],
      // 强制在 function的左括号之前使用一致的空格
      "space-before-function-paren": [2, "always"],
      // 强制在圆括号内使用一致的空格
      "space-in-parens": [2, "never"],
      // 要求操作符周围有空格
      "space-infix-ops": 2,
      // 强制在一元操作符前后使用一致的空格
      "space-unary-ops": [2, { "words": true, "nonwords": false }],
      // 强制在注释中 // 或 /* 使用一致的空格
      "spaced-comment": ["error", "always", {
          "line": {
              "markers": ["/","eslint-disable"],
              "exceptions": ["-", "+"]
          },
          "block": {
              "markers": ["!"],
              "exceptions": ["*"],
              "balanced": true
          }
      }],
      // 要求或禁止 Unicode BOM
      "unicode-bom": 1,
      //  要求正则表达式被括号括起来
      "wrap-regex": 0,
      // 要求逗号后面必须加上空格
      "comma-spacing": [2, { "before": false, "after": true }],
      // 要求使用3个等于号
      "eqeqeq": 1,
      //禁止object对象出现换行，或者换行后仅允许一行存在
      "object-curly-newline": ["error", {
          "ObjectExpression": { "multiline": true },
          "ObjectPattern": { "multiline": true },
          "ImportDeclaration": "never",
          "ExportDeclaration": { "multiline": true, "minProperties": 3 }
      }],
      "object-curly-spacing": ["error", "always"],
      // 要求多行数组/对象最后一个元素后面需要加上逗号 防止在下次修改添加元素时污染上一行的git log
      "comma-dangle": ["error", {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "ignore",
          "exports": "ignore",
          "functions": "ignore"
      }],
      "linebreak-style": ["error", "unix"]
  },
  "parser": "babel-eslint"
}
