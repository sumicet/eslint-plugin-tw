"use strict";

const { RuleTester } = require("eslint");
const noImportant = require("./no-important.js");

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
ruleTester.run("no-important", noImportant, {
  valid: [
    {
      code: `<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
    },
    {
      code: `<div />`,
      name: "no mention of class",
    },
  ],
  invalid: [
    {
      code: `<figure class="![background:#FFFFFF] bg-slate-100/50 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      errors: [
        {
          messageId: "no-important",
        },
      ],
    },
    {
      code: `<div className="!-my-px" />`,
      errors: [
        {
          messageId: "no-important",
        },
      ],
    },
    {
      code: `<div class="!group/item" />`,
      errors: [
        {
          messageId: "no-important",
        },
      ],
    },
  ],
});
