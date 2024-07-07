const classSeparator = /([\t\n\f\r ]+)/;

/**
 * @returns A list of valid tailwind classes according to the tailwind config.
 */
function parseClasses(
  /**
   * The list of classes to parse.
   * @type {string}
   */
  value,
  /**
   * The tailwind config.
   * @type {object}
   */
  config,
  options = {
    withImportant: false,
    withVariants: false,
    withArbitraryValues: false,
    withModifiers: false,
  }
) {
  let result = value.split(classSeparator).filter((c) => c.trim() !== "");
  const separatorRegex = new RegExp(
    `(?!\\[.*?\\])${config.separator}(?![^\\[]*?\\])`
  );

  if (!options.withImportant) {
    // Remove the important modifier eg "!flex" => "flex".
    result = result.map((c) => {
      if (!c.includes(config.separator))
        return c.startsWith("!") ? c.slice(1) : c;
      const words = c.split(separatorRegex);
      // `length - 1` to allow multiple modifiers eg "dark:md:flex".
      return words[words.length - 1].startsWith("!")
        ? c.replace(words[words.length - 1], words[words.length - 1].slice(1))
        : words[words.length - 1];
    });
  }

  if (!options.withArbitraryValues) {
    // Remove arbitrary values eg "[background:red]".
    result = result.filter((c) => !c.startsWith("[") && !c.endsWith("]"));
  }

  if (!options.withModifiers) {
    // Remove all modifiers eg "bg-white/80" where "80" is the modifier.
    result = result.map((c) => (c.includes("/") ? c.split("/")[0] : c));
  }

  if (!options.withVariants) {
    // Remove all variants eg "dark:md:flex".
    result = result.map((c) => {
      if (!c.includes(config.separator)) return c;
      const words = c.split(separatorRegex);
      // `length - 1` to allow multiple modifiers eg "dark:md:flex".
      return words[words.length - 1];
    });
  }

  return result;
}

module.exports = { parseClasses };
