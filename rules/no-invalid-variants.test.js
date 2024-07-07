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
  // Examples from https://tailwindcss.com/docs/hover-focus-and-other-states
  valid: [
    {
      code: `<figure class="bg-sky-500 hover:bg-sky-700" />`,
      name: "simple variant",
    },
    {
      code: `<figure class="dark:md:hover:bg-fuchsia-600" />`,
      name: "stacked variants",
    },
    {
      code: `<div class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300" />`,
      name: "multiple simple variants",
    },
    {
      code: `<div class="[&:nth-child(3)]:underline" />`,
      name: "arbitrary variant",
    },
    {
      code: `<div class="text-slate-900 group-hover:text-white text-sm font-semibold" />`,
      name: "arbitrary variant with predefined values eg group-* as in group-hover",
    },
    {
      code: `<div class="has-[:checked]:bg-indigo-50" />`,
      name: "arbitrary variant with arbitrary values eg has-[...]",
    },
    {
      code: `<div class="lg:[&:nth-child(3)]:hover:underline" />`,
      name: "stacked: variant + arbitrary variant + variant",
    },
    {
      code: `<div class="group/item hover:bg-slate-100" />`,
      name: "nested groups",
    },
    {
      code: `<div class="group-hover/edit:text-gray-700" />`,
      name: "nested groups with arbitrary variant",
    },
    {
      code: `<div class="peer-checked/draft:text-sky-500" />`,
      name: "differentiating peers",
    },
    {
      code: `<div class="group-[:nth-of-type(3)_&]:block" />`,
      name: "arbitrary groups",
    },
    {
      code: `<div class="peer-[.is-dirty]:peer-required:block hidden" />`,
      name: "stacked: arbitrary variant with arbitrary values + arbitrary variant with default value",
    },
    {
      code: `<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />`,
      name: "responsive variants",
    },
    {
      code: `<div className="flex supports-[display:grid]:grid" />`,
      name: "supports",
    },
    {
      code: `<div className="flex [@supports(display:grid)]:grid" />`,
      name: "at-rules",
    },
    {
      code: `<div className="[@media(any-hover:hover){&:hover}]:opacity-100" />`,
      name: "complex at-rules",
    },
  ],
  invalid: [
    {
      code: `<figure class="mdd:flex bg-slate-50 text-red-500 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      name: "invalid responsive variant",
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
    {
      code: `<figure class="laptop:flex" />`,
      name: "inexistent variant",
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
    {
      code: `<figure class="dark:mdd:hover:bg-fuchsia-600" />`,
      name: "invalid stacked variants",
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
    {
      code: `<div class="text-slate-900 group-random:text-white text-sm font-semibold" />`,
      name: "arbitrary variant with invalid predefined values eg group-* as in group-random",
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
    {
      code: `<div class="group-group-[:nth-of-type(3)_&]:block" />`,
      name: "invalid arbitrary groups with arbitrary values",
      errors: [
        {
          messageId: "no-invalid-variants",
        },
      ],
    },
  ],
});
