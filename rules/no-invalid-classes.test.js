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
      code: `<div />`,
      name: "no mention of class",
    },
    {
      code: `<div className="bg-[#FFFFFF]" />`,
      name: "class with arbitrary value",
    },
    {
      code: `<div className="grid-cols-[auto_minmax(0,1fr)]" />`,
      name: "class with arbitrary value and _",
    },
    {
      code: `<div className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block" />`,
      name: "class with variant and negative value",
    },
    {
      code: `<figure class="md:flex -my-px bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      name: "class with negative value",
    },
    {
      code: `<figure class="bg-custom/50 text-custom rounded-xl p-8 md:p-0" />`,
      name: "class with modifier",
    },
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
      code: `<li class="group/item hover:bg-slate-100">
      <img src="{person.imageUrl}" alt="" />
      <div>
        <a href="{person.url}">{person.name}</a>
        <p>{person.title}</p>
      </div>
      <a class="group/edit invisible hover:bg-slate-200 group-hover/item:visible" href="tel:{person.phone}">
        <span class="group-hover/edit:text-gray-700">Call</span>
        <svg class="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500" />
      </a>
    </li>`,
      name: "differentiating nested groups",
    },
    {
      code: `<fieldset>
  <legend>Published status</legend>

  <input id="draft" class="peer/draft" type="radio" name="status" checked />
  <label for="draft" class="peer-checked/draft:text-sky-500">Draft</label>

  <input id="published" class="peer/published" type="radio" name="status" />
  <label for="published" class="peer-checked/published:text-sky-500">Published</label>

  <div class="hidden peer-checked/draft:block">Drafts are only visible to administrators.</div>
  <div class="hidden peer-checked/published:block">Your post will be publicly visible on your site.</div>
</fieldset>`,
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
      code: `<figure class="md:flexx [background:#FFFFFF] bg-slate-100/40 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      name: "class with invalid name",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="bg-not-existing-class/50 text-custom rounded-xl p-8 md:p-0" />`,
      name: "class with invalid arbitrary value",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="text-custom/56" />`,
      name: "class with invalid modifier",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="-bg-red-400" />`,
      name: "class that doesn't accept negative modifier",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="mdd:flex bg-slate-50 text-red-500 rounded-xl p-8 md:p-0 dark:bg-slate-800" />`,
      name: "invalid responsive variant",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="laptop:flex" />`,
      name: "inexistent variant",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<figure class="dark:mdd:hover:bg-fuchsia-600" />`,
      name: "invalid stacked variants",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div class="text-slate-900 group-random:text-white text-sm font-semibold" />`,
      name: "arbitrary variant with invalid predefined values eg group-* as in group-random",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div class="group-group-[:nth-of-type(3)_&]:block" />`,
      name: "invalid arbitrary groups with arbitrary values",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div class="!md:bg-red-400" />`,
      name: "misplaced important modifier",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div className="group-hover//edit:text-gray-700" />`,
      name: "invalid syntax: //",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div className="md::flex" />`,
      name: "invalid syntax: ::",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div className="[&:nth-child(3)]::underline" />`,
      name: "invalid syntax: [...]::",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
    {
      code: `<div className="[&:nth-child(3)]: underline flex bg-red-500" />`,
      name: "invalid syntax: [...]: without class name",
      errors: [
        {
          messageId: "no-invalid-classes",
        },
      ],
    },
  ],
});
