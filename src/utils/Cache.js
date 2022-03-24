/**
 * @type Map<string, any>
 */
module.exports.blackListCache = new Map();

/**
 * @type Map<string, any>
 */
module.exports.cBlackListCache = new Map();

/**
 * @type {Map<string, Map<number, Rule>>}
 */
module.exports.rulesCache = new Map();

/**
 * @type {exports.Rule}
 */
module.exports.Rule = class Rule {
    /**
     * @param {number} index
     * @param {string} title
     * @param {string} description
     */
    constructor(index, title, description) {
        this.index = index;
        this.title = title;
        this.description = description;
    }
};