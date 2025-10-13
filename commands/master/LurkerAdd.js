const { discordPingToUserID } = require("../../utils/discord")
const BaseCommand = require("../base_command")

module.exports = class LurkerAddCommand extends BaseCommand {
    static aliases = ["LurkerAdd", "Lurker", "AddLurker"]
    static description = "Add one or more lurkers to the game. Accepts multiple with |."
    static argsDescription = "<@User> [Faction] | <@User> [Faction]"
    static category = "Master"

    masterOnly = true
    needsGame = true
    needsMention = true

    async execute() {
        let msg = ""
        for (const command of this.getMultipleMentionsAndArgs()) {
            const { id, mention, arg } = command
            if (this.turn.getPlayer({ id })) {
                msg += `${mention} is already a player. Skipped.\n`
                continue
            }
            if (this.turn.isLurker(id)) {
                this.turn.addLurker({ id: discordPingToUserID(mention) }, arg)
                let factionName = arg ? ` as ${arg}` : ""
                msg += `${mention} is now lurking${factionName}.\n`
            } else {
                this.turn.addLurker({ id: discordPingToUserID(mention) }, arg)
                let factionName = arg ? ` (${arg})` : ""
                msg += `${mention} added as lurker${factionName}.\n`
            }
        }
        if (this.saveOrReturnWarning()) return
        return this.sendReply(msg || "No valid lurkers found.")
    }
}
