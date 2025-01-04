/**
 * Validates the number of arguments against an expected amount.
 *
 * This function checks if the provided `args` array matches the exact number of arguments specified by `argAmount`.
 * If the number of arguments is correct, it returns `1`. If there are too many or too few arguments, it returns an
 * error message with the expected and received argument counts.
 *
 * @param {string[]} args - The array of arguments to validate.
 * @param {number} argAmount - The exact number of arguments required.
 * @param {import("../langs/langs").Txt} text - An instance of the `Txt` class used for fetching and formatting error messages.
 * @returns {string|number} - Returns `1` if the argument count is valid, otherwise returns an error message.
 */
function validArgAmount(args, argAmount, text) {
    if (!args) return text.get("global", "error");
    if (args.length === argAmount) return 1;
    else if (args.length > argAmount) {
        return text.get("global", "tooManyArgs")
            .replace("%REQUIRED_AMOUNT%", argAmount)
            .replace("%RECEIVED_AMOUNT%", args.length);
    } else if (args.length < argAmount) {
        return text.get("global", "notEnoughArgs")
            .replace("%REQUIRED_AMOUNT%", argAmount)
            .replace("%RECEIVED_AMOUNT%", args.length);
    }
}

/**
 * Validates the number of arguments against a specified interval.
 *
 * This function checks if the provided `args` array has a number of elements within the specified range of `minArgAmount`
 * and `maxArgAmount`. If the argument count falls within this range, it returns `1`. If there are too many or too few arguments,
 * it returns an error message with the expected range and received argument count.
 *
 * @param {string[]} args - The array of arguments to validate.
 * @param {number} minArgAmount - The minimum number of arguments required.
 * @param {number} maxArgAmount - The maximum number of arguments allowed.
 * @param {import("../langs/langs").Txt} text - An instance of the `Txt` class used for fetching and formatting error messages.
 * @returns {string|number} - Returns `1` if the argument count is within the valid range, otherwise returns an error message.
 */
function validArgAmountInterval(args, minArgAmount, maxArgAmount, text) {
    if (!args) return text.get("global", "error");
    if (args.length >= minArgAmount && args.length <= maxArgAmount) return 1;
    else if (args.length > maxArgAmount) {
        return text.get("global", "tooManyArgs")
            .replace("%REQUIRED_AMOUNT%", maxArgAmount)
            .replace("%RECEIVED_AMOUNT%", args.length);
    } else if (args.length < minArgAmount) {
        return text.get("global", "notEnoughArgs")
            .replace("%REQUIRED_AMOUNT%", minArgAmount)
            .replace("%RECEIVED_AMOUNT%", args.length);
    }
}

module.exports = { validArgAmount, validArgAmountInterval };
