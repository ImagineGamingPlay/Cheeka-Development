const {Schema, model} = require('mongoose');

const RuleType = new Schema({
    title: String,
    description: String,
});

const RulesChannel = new Schema({
    channelId: String | null,
    guildId: String,
    messageId: String | null,
    rules: [RuleType],
});
/**
 * @type {Model<BlacklistChannel>}
 */
module.exports.RulesChannel = model('Rules_Channel', RulesChannel);
module.exports.ruleType = RuleType