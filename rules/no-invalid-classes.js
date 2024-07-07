"use strict";

const attributes = ["className", "class"];
const { parseClasses } = require("../utils/parse-classes");
const { withTailwind } = require("../utils/with-tailwind");
// const { generateRules } = require("tailwindcss/lib/lib/generateRules");

const name = "no-invalid-classes";

module.exports = {
  meta: {
    type: "suggestion",
    messages: {
      [name]: "Classes {{ value }} are invalid.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!attributes.includes(node.name.name)) return;

        return withTailwind(
          "./tailwind.config.js",
          ({ classNames, config, twContext }) => {
            const classes = parseClasses(node.value.value, config, {
              withModifiers: true,
            });

            // console.log(generateRules(new Set(classes), twContext));
            // console.log(generateRules(new Set(["bg-rrrr-500"]), twContext));

            const invalidClasses = classes.filter(
              (c) => !classNames.some((validClass) => c === validClass)
            );

            if (!invalidClasses.length) return;

            context.report({
              node,
              messageId: name,
              data: {
                value: invalidClasses.join(", "),
              },
            });
          }
        );
      },
    };
  },
};
