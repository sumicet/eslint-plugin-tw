const classSeparator = /([\t\n\f\r ]+)/;

/**
 * @returns A list of valid tailwind classes according to the tailwind config.
 */
function parseVariants(
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
  options = { withArbitraryValues: false }
) {
  let result = value.split(classSeparator).filter((c) => c.trim() !== "");
  const separatorRegex = new RegExp(
    `(?!\\[.*?\\])${config.separator}(?![^\\[]*?\\])`
  );

  result = result
    .filter((c) => {
      if (!c.includes(config.separator)) return false;
      const words = c.split(separatorRegex);
      if (words.length === 1) return false;

      return true;
    })
    .map((c) => {
      const words = c.split(separatorRegex);
      return words.slice(0, words.length - 1);
    })
    .flat(); // `words.slice` returns an array.

  if (!options.withArbitraryValues) {
    // Remove arbitrary values eg "[background:red]".
    result = result.filter((c) => !c.startsWith("[") && !c.endsWith("]"));
  }

  return result;
}

module.exports = { parseVariants };
