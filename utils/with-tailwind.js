const setupContext = require("tailwindcss/lib/lib/setupContextUtils");
const { getTailwindConfig } = require("./get-tailwind-config");

/**
 * @typedef {Object} Variant
 * @property {string} name - The name of the variant.
 * @property {boolean} isArbitrary - If the variant must take a value eg has-[...] or group where group can be paired with hover in group-hover.
 * @property {string[]} values
 * @property {boolean} hasDash
 * @property {Function} selectors
 */

/**
 * @typedef {Object} CallbackPayload
 * @property {Variant[]} variants - The list of variants.
 * @property {string[]} classNames - The list of class names.
 * @property {object} config - The tailwind config.
 * @property {object} twContext - The tailwind context.
 */

/**
 * @callback Callback
 * @param {CallbackPayload} payload
 *
 * @returns {void}
 */

/**
 * @param {string} tailwindConfigPath The path to the tailwind config.
 * @param {Callback} callback A function that receives the tailwind payload.
 *
 * @returns A wrapper that provides tailwind config and classNames.
 */
function withTailwind(tailwindConfigPath, callback) {
  const config = getTailwindConfig(tailwindConfigPath);
  let context = setupContext.createContext(config);
  context.tailwindConfig.separator = config.separator;

  const classNames = context
    .getClassList({
      // Generate utilities with modifiers.
      includeMetadata: true,
    })
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

  /**
   * @type {Variant[]}
   */
  const variants = context.getVariants();

  return callback({ classNames, config, variants, twContext: context });
}

module.exports = {
  withTailwind,
};
