const BaseCommand = require("../base_command")
const discordUtils = require("../../utils/discord")

module.exports = class LurkerRemoveCommand extends BaseCommand {
    static aliases = ["Unlurk", "RemoveLurker"]
    static description = "Removes a lurker from the game. Can be used by the master or self."
    static argsDescription = "<@User> | (no args = remove self)"
    static category = "Master"

    masterOnly = false
    needsGame = true
    canMention = true

    async execute() {
        if (this.mentionedUser) {
            // Master removing someone else
            if (!this.isMaster()) {
                return this.sendReply("Only the master can remove other lurkers.")
            }
            const removed = this.turn.removeLurker(this.mentionedUser)
            if (removed) {
                if (this.saveOrReturnWarning()) return
                return this.sendReply(`${this.mentionedUser} is no longer lurking.`)
            }
            return this.sendReply(`${this.mentionedUser} is not lurking.`)
        } else {
            // Player self-unlurk
            const removed = this.turn.removeLurker(this.user)
            if (removed) {
                if (this.saveOrReturnWarning()) return
                return this.sendReply("You are no longer lurking.")
            }
            return this.sendReply("You are not lurking.")
        }
    }
}
