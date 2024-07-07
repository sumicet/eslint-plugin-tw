const setupContext = require("tailwindcss/lib/lib/setupContextUtils");
const { getTailwindConfig } = require("./get-tailwind-config");

/**
 * @param {string} tailwindConfigPath The path to the tailwind config.
 * @param {function} callback A function that receives the tailwind payload.
 * @returns A wrapper that provides tailwind config and classNames.
 */
function withTailwind(tailwindConfigPath, callback) {
  const config = getTailwindConfig(tailwindConfigPath);
  let context = setupContext.createContext(config);
  context.tailwindConfig.separator = config.separator;

  const classNames = context
    .getClassList({ includeMetadata: true })
    .filter((className) => className !== "*")
    .map((className) => {
      if (typeof className === "string") return className;

      if (typeof className === "object") {
        const [name, { modifiers }] = className;
        // eg bg-slate-100/80, where 80 is the modifier
        const nameWithModifiers = modifiers.map((m) => `${name}/${m}`);
        return [name, ...nameWithModifiers];
      }
    })
    .flat();

  const variants = [];
  context.variantMap.forEach((_, key) => variants.push(key));

  return callback({ classNames, config, variants });
}

module.exports = {
  withTailwind,
};
