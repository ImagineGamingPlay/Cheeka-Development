const { model } = require("../mongoose");

/**
 * @type Map<string, any>
 */
module.exports.blackListCache = new Map();

/**
 * @type Map<string, any>
 */
module.exports.cBlackListCache = new Map();

/**
 * @type {Map<string, RuleType[]>}
 */
module.exports.rulesCache = new Map();

/**
 * @type {Map<string, TagSchema}
 */
module.exports.tagsCache = new Map();

/**
 * @type {Map<string, number>}
 */
module.exports.thankCooldownCache = new Map();

/**
 * @type {Map<string, UserType>}
 */
module.exports.userCache = new Map();

/**
 * @type {Map<string, GuildData>}
 */
module.exports.guildCache = new Map();

/**
 * @type {Map<string, string>}
 */
module.exports.afkUsers = new Map();
