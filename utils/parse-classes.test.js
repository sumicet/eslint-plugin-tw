const { parseClasses } = require("./parse-classes");
const { describe, it } = require("mocha");
const assert = require("assert");

const config = { separator: ":" };

describe("parseClasses", async () => {
  it("simple class", () => {
    const result = parseClasses("bg-slate-100", config);
    assert.deepStrictEqual(result, ["bg-slate-100"]);
  });

  it("class with a variant", () => {
    const result = parseClasses("md:flex", config);
    assert.deepStrictEqual(result, ["md:flex"]);
  });

  it("class with stacked variants", () => {
    const result = parseClasses("dark:md:hover:bg-red-600", config);
    assert.deepStrictEqual(result, ["dark:md:hover:bg-red-600"]);
  });

  it("class with an arbitrary value", () => {
    const result = parseClasses("[background:#FFFFFF]", config);
    assert.deepStrictEqual(result, ["[background:#FFFFFF]"]);
  });

  it("class with multiple arbitrary values", () => {
    const result = parseClasses(
      "[background:#FFFFFF] ![color:#000000]",
      config
    );
    assert.deepStrictEqual(result, [
      "[background:#FFFFFF]",
      "![color:#000000]",
    ]);
  });

  it("group/item", () => {
    const result = parseClasses("group/item bg-red-400", config);
    assert.deepStrictEqual(result, ["group/item", "bg-red-400"]);
  });

  it("skipImportant", () => {
    const result = parseClasses(
      "!bg-red-400 ![color:pink] md:![border-radius:0px] md:bg-red-500",
      config,
      {
        skipImportant: true,
      }
    );
    assert.deepStrictEqual(result, [
      "bg-red-400",
      "[color:pink]",
      "md:[border-radius:0px]",
      "md:bg-red-500",
    ]);
  });

  it("skipImportant with no important to skip", () => {
    const result = parseClasses("bg-red-400", config, {
      skipImportant: true,
    });
    assert.deepStrictEqual(result, ["bg-red-400"]);
  });

  it("skipArbitraryValues", () => {
    const result = parseClasses("[background:#FFFFFF] text-red-400", config, {
      skipArbitraryValues: true,
    });
    assert.deepStrictEqual(result, ["text-red-400"]);
  });

  it("skipArbitraryValues with no arbitrary values to skip", () => {
    const result = parseClasses("text-red-400", config, {
      skipArbitraryValues: true,
    });
    assert.deepStrictEqual(result, ["text-red-400"]);
  });

  it("skipVariants", () => {
    const result = parseClasses("dark:md:hover:bg-red-600", config, {
      skipVariants: true,
    });
    assert.deepStrictEqual(result, ["bg-red-600"]);
  });

  it("skipVariants with no variants to skip", () => {
    const result = parseClasses("bg-red-400", config, {
      skipVariants: true,
    });
    assert.deepStrictEqual(result, ["bg-red-400"]);
  });

  it("skipModifiers", () => {
    const result = parseClasses("bg-red-400/50", config, {
      skipModifiers: true,
    });
    assert.deepStrictEqual(result, ["bg-red-400"]);
  });

  it("skipModifiers with no modifiers to skip", () => {
    const result = parseClasses("bg-red-400", config, {
      skipModifiers: true,
    });
    assert.deepStrictEqual(result, ["bg-red-400"]);
  });
});
