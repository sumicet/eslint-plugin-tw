"use strict";

const { parseClasses } = require("../utils/parse-classes");
const { withTailwind } = require("../utils/with-tailwind");
const attributes = ["className", "class"];

// Regular utilities
// {{modifier}:}*{namespace}{-{suffix}}*{/{opacityModifier}}?

// Arbitrary values
// {{modifier}:}*{namespace}-[{arbitraryValue}]{/{opacityModifier}}?
// arbitraryValue: no whitespace, balanced quotes unless within quotes, balanced brackets unless within quotes

// Arbitrary properties
// {{modifier}:}*[{validCssPropertyName}:{arbitraryValue}]

const name = "no-important";

module.exports = {
  meta: {
    type: "suggestion",
    messages: {
      [name]: "Classes {{ value }} should not be marked as important.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!attributes.includes(node.name.name)) return;

        withTailwind("./tailwind.config.js", ({ config }) => {
          const inputClasses = parseClasses(node.value.value, config, {
            skipModifiers: true,
            skipVariants: true,
          });

          const hasImportant = inputClasses.filter((c) => c.startsWith("!"));
          if (!hasImportant.length) return;

          context.report({
            node,
            messageId: name,
            data: {
              value: hasImportant.join(", "),
            },
          });
        });
      },
    };
  },
};
