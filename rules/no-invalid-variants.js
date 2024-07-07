"use strict";

const attributes = ["className", "class"];
const { parseVariants } = require("../utils/parse-variants");
const { withTailwind } = require("../utils/with-tailwind");

const name = "no-invalid-variants";

module.exports = {
  meta: {
    type: "suggestion",
    messages: {
      [name]: "Variants {{ value }} are invalid.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (!attributes.includes(node.name.name)) return;

        return withTailwind("./tailwind.config.js", ({ config, variants }) => {
          const inputVariants = parseVariants(node.value.value, config);

          const invalidVariants = inputVariants.filter(
            (v) =>
              !variants.some((variant) => {
                if (variant.isArbitrary) {
                  if (variant.values.length) {
                    return variant.values.some(
                      (value) => `${variant.name}-${value}` === v
                    );
                  }
                  const withoutVariant = v.slice(variant.name.length);
                  return (
                    v.startsWith(variant.name) &&
                    withoutVariant.startsWith("-[") &&
                    !withoutVariant.endsWith("]")
                  );
                }
                return variant.name === v;
              })
          );

          if (!invalidVariants.length) return;

          context.report({
            node,
            messageId: name,
            data: {
              value: invalidVariants.join(", "),
            },
          });
        });
      },
    };
  },
};
