"use strict";

const attributes = ["className", "class"];
const { parseClasses } = require("../utils/parse-classes");
const { withTailwind } = require("../utils/with-tailwind");
const { generateRules } = require("tailwindcss/lib/lib/generateRules");

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

        return withTailwind("./tailwind.config.js", ({ config, twContext }) => {
          const classes = parseClasses(node.value.value, config);

          const invalidClasses = classes.filter((c) => {
            if (generateRules([c], twContext).length) return false;

            let strippedClass = c;
            if (c.startsWith("!")) {
              strippedClass = c.slice(1);
            }

            // Allow group/item, group/edit, peer/example, etc.
            // https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups
            // https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-peers
            // "peer-checked/draft:text-sky-500" works with `generateRules`, but "peer-checked/draft" doesn't.
            if (
              strippedClass.match(new RegExp(/\b(group|peer)\/[a-zA-Z0-9]+\b/))
            )
              return false;

            return true;
          });

          if (!invalidClasses.length) return;

          context.report({
            node,
            messageId: name,
            data: {
              value: invalidClasses.join(", "),
            },
          });
        });
      },
    };
  },
};
