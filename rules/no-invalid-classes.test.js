"use strict";

const { RuleTester } = require("eslint");
const noInvalidClasses = require("./no-invalid-classes.js");

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
ruleTester.run("no-invalid-classes", noInvalidClasses, {
  valid: [
    {
      code: `<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
    },
    {
      code: `<figure class="bg-custom/50 text-custom rounded-xl p-8 md:p-0" />`,
    },
  ],
  invalid: [
    {
      code: `<figure class="md:flexx [background:#FFFFFF] bg-slate-100/40 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="bg-not-existing-class/50 text-custom rounded-xl p-8 md:p-0" />`,
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="text-custom/56" />`,
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
  ],
});
