const BaseCommand = require("../base_command")
const Roll = require("../../models/roll")

const wait = ms => new Promise(r => setTimeout(r, ms))

const parseStats = tokens => {
    const nums = tokens.filter(t => /^-?\d+$/.test(t)).map(Number)
    let bonus = 0, hp = 20, atk = 0, def = 0
    if (nums.length === 1) {
        if (Math.abs(nums[0]) <= 5) bonus = nums[0]
        else hp = nums[0]
    } else if (nums.length > 1) {
        if (nums[0] !== undefined) bonus = nums[0]
        if (nums[1] !== undefined) hp = nums[1]
        if (nums[2] !== undefined) atk = nums[2]
        if (nums[3] !== undefined) def = nums[3]
    }
    bonus = Math.max(-9, Math.min(9, bonus))
    hp = Math.max(1, Math.min(1000, hp))
    atk = Math.max(-10, Math.min(100, atk))
    def = Math.max(-100, Math.min(100, def))
    return { bonus, hp, atk, def }
}

const rollDigit = () => {
    const r = new Roll(null, "Duel")
    r.limit = 1_000_000
    r.doRollWithLimit()
    const str = r.value.toString()
    const last = parseInt(str[str.length - 1], 10) || 10
    return {
        formatted: str.slice(0, -1) + "**" + (last === 0 ? 0 : last) + "**",
        digit: last === 0 ? 10 : last,
        full: str
    }
}

module.exports = class DuelCommand extends BaseCommand {
    static aliases = ["Duel"]
    static description = "Duel two mentioned users."
    static argsDescription = "<@User1> [bonus] [hp] [atk] [def] <@User2> [bonus] [hp] [atk] [def]"
    static category = "Master"

    needsMention = true
    canMention = false
    canDelete = false
    getsGame = false

    async execute() {
        const EMOTE = ["🔷", "🔶"];
        const m = this.getMentionedUsers()
        if (m.length !== 2) return this.sendReply("You need to mention two users.")

        const segs = [[], []]
        let idx = -1
        for (const t of this.args) {
            if (/^<@!?/.test(t)) idx++
            else if (idx >= 0 && idx < 2) segs[idx].push(t)
        }
        const s1 = parseStats(segs[0])
        const s2 = parseStats(segs[1])

        let hp1 = s1.hp, hp2 = s2.hp

        await this.message.channel.send(`## Starting a duel between ${EMOTE[0]} ${m[0]} and ${EMOTE[1]} ${m[1]}`, { allowedMentions: { parse: [] } })
        await wait(2000)

        const show = (val) => (val ? ` ${val > 0 ? "+" : ""}${val}` : "")
        const s = (digit, bonus) => `${digit}${show(bonus)}`

        while (hp1 > 0 && hp2 > 0) {
            const r1 = rollDigit()
            const r2 = rollDigit()
            const check1 = r1.digit + s1.bonus
            const check2 = r2.digit + s2.bonus

            let line = `${m[0]} (${hp1} HP) rolls ${r1.formatted} vs ${m[1]} (${hp2} HP) rolls ${r2.formatted}\n`

            if (check1 === check2) {
                line += "⚔️ It's a tie. No damage dealt."
            } else if (check1 > check2) {
                const dmg = Math.max(0, (check1 + s1.atk) - (check2 + s2.def))
                hp2 -= dmg
                line += `${EMOTE[0]} ${m[0]} deals ${dmg} damage to ${EMOTE[1]} ${m[1]} → ${Math.max(hp2, 0)} HP left`
                let msg = `-# (${s(r1.digit, s1.bonus)}) = ${check1} vs (${s(r2.digit, s2.bonus)}) = ${check2} → `
                msg += `(${check1}${show(s1.atk)}) - (${check2}${show(s2.def)}) = ${dmg}`
                line += `\n${msg}`
            } else {
                const dmg = Math.max(0, (check2 + s2.atk) - (check1 + s1.def))
                hp1 -= dmg
                line += `${EMOTE[1]} ${m[1]} deals ${dmg} damage to ${EMOTE[0]} ${m[0]} → ${Math.max(hp1, 0)} HP left`
                let msg = `-# (${s(r2.digit, s2.bonus)}) = ${check2} vs (${s(r1.digit, s1.bonus)}) = ${check1} → `
                msg += `(${check2}${show(s2.atk)}) - (${check1}${show(s1.def)}) = ${dmg}`
                line += `\n${msg}`
            }
            line += "\n** **"
            await this.message.channel.send(line, { allowedMentions: { parse: [] } })
            await wait(2000 - (Math.max(hp1 + hp2)))
        }

        await this.message.channel.send(`## The WINNER is ${hp1 > 0 ? `${EMOTE[0]} ${m[0]}` : `${EMOTE[1]} ${m[1]}`}!`)
    }
}
