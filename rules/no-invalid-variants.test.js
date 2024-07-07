"use strict";

const { RuleTester } = require("eslint");
const noInvalidVariants = require("./no-invalid-variants.js");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run("no-invalid-variants", noInvalidVariants, {
  valid: [
    {
      code: `<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
    },
    {
      code: `<figure class="sm:bg-custom/50 first-letter:text-custom rounded-xl after:p-8 md:p-0" />`,
    },
    {
      code: `<div class="lg:[&:nth-child(3)]:hover:underline bg-red-500" />`,
    },
  ],
  invalid: [
    {
      code: `<figure class="mdd:flex bg-slate-50 text-red-500 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
  ],
});
