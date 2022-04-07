const { model } = require("../handlers/mongoose");

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

/**
 * @type {Map<string, string>}
 */

//I made it so that it checks for a new video every 3 minutes, and if .video is null or .video is similar to the newest checked video's Id, it returns and won't execute the rest of the code
module.exports.video = null
