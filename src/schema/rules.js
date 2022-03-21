const {Schema, model} = require('mongoose');

const RuleType = new Schema({
    title: String,
    description: String,
    embedIndex: Number,
});

const RulesChannel = new Schema({
    channelId: String,
    guildId: String,
    messageId: String,
    rules: [RuleType],
});
/**
 * @type {Model<BlacklistChannel>}
 */
module.exports.cRules = model('Rules_Channel', RulesChannel);
module.exports.ruleType = RuleType