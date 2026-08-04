const OPTION_LIMIT = 25

const historyTypeChoices = [
  "roll",
  "ally",
  "betray",
  "nap",
  "break",
  "cede",
  "vote",
  "say",
  "join",
  "leave",
  "die",
  "revive",
]

const historyCategoryChoices = ["roll", "diplomacy", "info"]

const topSortChoices = ["xp", "luck", "wins", "rolls", "host"]

function stringOption(name, description, required = false, choices = null) {
  return { type: "string", name, description, required, choices }
}

function integerOption(name, description, required = false) {
  return { type: "integer", name, description, required }
}

function userOption(name, description, required = false) {
  return { type: "user", name, description, required }
}

function attachmentOption(name, description, required = false) {
  return { type: "attachment", name, description, required }
}

function channelOption(name, description, required = false) {
  return { type: "channel", name, description, required }
}

function turnOption() {
  return integerOption("turn", "Turn number to show.", false)
}

function targets(count = 10) {
  const options = [userOption("target", "Target player.", true)]
  for (let i = 2; i <= count; i++) {
    options.push(userOption(`target_${i}`, `Additional target player ${i}.`, false))
  }
  return options
}

function repeatedUserText(userName, textName, textDescription, count = 5, textRequired = false) {
  const options = [
    userOption(userName, "User.", true),
    stringOption(textName, textDescription, textRequired),
  ]
  for (let i = 2; i <= count; i++) {
    options.push(userOption(`${userName}_${i}`, `Additional user ${i}.`, false))
    options.push(stringOption(`${textName}_${i}`, `${textDescription} for user ${i}.`, false))
  }
  return options
}

function repeatedStrings(name, description, count = 10) {
  const options = [stringOption(name, description, true)]
  for (let i = 2; i <= count; i++) {
    options.push(stringOption(`${name}_${i}`, `${description} ${i}.`, false))
  }
  return options
}

function rollOptions(hasLimit = false, hasMultiple = false, limitFirst = false) {
  const options = []
  if (hasLimit && limitFirst) options.push(integerOption("limit", "Maximum roll value.", true))
  if (hasMultiple) options.push(integerOption("multiple", "Number of rolls.", true))
  if (hasLimit && !limitFirst) options.push(integerOption("limit", "Maximum roll value.", true))
  options.push(stringOption("intention", "Roll intention.", false))
  options.push(attachmentOption("attachment", "Image/file to attach to the intention.", false))
  return options
}

const SCHEMAS = {
  alliances: { options: [turnOption()] },
  allmuplinks: { options: [] },
  muplinkexport: { options: [channelOption("channel", "Channel containing the game.", false), stringOption("game_id", "Previous game id.", false)] },
  allmups: { options: [] },
  bonuses: { options: [] },
  cedes: { options: [turnOption()] },
  exportgame: { options: [channelOption("channel", "Channel containing the game.", false), stringOption("game_id", "Previous game id.", false)] },
  help: { options: [stringOption("topic", "Command or help category.", false)] },
  helplevel: { options: [] },
  helpmaster: { options: [] },
  helpplayer: { options: [] },
  helputil: { options: [] },
  history: { options: [turnOption(), stringOption("type", "History event type.", false, historyTypeChoices), stringOption("category", "History category.", false, historyCategoryChoices)] },
  historybonus: { options: [turnOption(), stringOption("type", "History event type.", false, historyTypeChoices), stringOption("category", "History category.", false, historyCategoryChoices)] },
  links: { options: [turnOption()] },
  notes: { options: [turnOption()] },
  gameid: { options: [channelOption("channel", "Channel containing the game.", true), stringOption("game_id", "Previous game id.", false)] },
  pacts: { options: [turnOption()] },
  profile: { options: [userOption("user", "User whose profile to show.", false)] },
  rolls: { options: [turnOption()] },
  status: { options: [turnOption()] },
  s: { options: [turnOption()] },
  who: { options: [] },

  announce: { options: [stringOption("message", "Message to add to history.", true)] },
  betrayallalliances: { options: [] },
  breakallpacts: { options: [] },
  close: { options: [] },
  endgame: { options: [stringOption("description", "Final turn description.", false), attachmentOption("image", "Final MUP image.", false)] },
  renamegame: { options: [stringOption("title", "New game title.", true)] },
  reopengame: { options: [] },
  startgame: { options: [stringOption("title", "Game title.", true), attachmentOption("first_mup", "First MUP image.", false)] },
  transfergame: { options: [userOption("new_master", "New game master.", true)] },
  lurkeradd: { options: repeatedUserText("user", "faction", "Faction name", 5, false), buildArgs: interaction => buildRepeatedUserTextArgs(interaction, "user", "faction", 5) },
  add: { options: repeatedUserText("user", "faction", "Faction name", 5, false), buildArgs: interaction => buildRepeatedUserTextArgs(interaction, "user", "faction", 5) },
  forceally: { options: [userOption("player_a", "First player.", true), userOption("player_b", "Second player.", true)] },
  ban: { options: [userOption("player", "Player to ban.", false), stringOption("user_id", "Raw user id for a player no longer in server.", false)] },
  baninactive: { options: [] },
  forcebetray: { options: [userOption("player_a", "First player.", true), userOption("player_b", "Second player.", true)] },
  setbonus: { options: repeatedUserText("player", "bonus", "Bonus value/text", 5, true), buildArgs: interaction => buildRepeatedUserTextArgs(interaction, "player", "bonus", 5) },
  forcebreak: { options: [userOption("player_a", "First player.", true), userOption("player_b", "Second player.", true)] },
  cleardiplomacy: { options: [userOption("player", "Player to clear.", false), stringOption("user_id", "Raw user id for a player no longer in server.", false)] },
  kick: { options: [userOption("player", "Player to kick.", false), stringOption("user_id", "Raw user id for a player no longer in server.", false)] },
  kill: { options: [userOption("player", "Player to kill.", false), stringOption("user_id", "Raw user id for a player no longer in server.", false)] },
  forcenap: { options: [userOption("player_a", "First player.", true), userOption("player_b", "Second player.", true)] },
  ping: { options: [] },
  pingalive: { options: [] },
  pingeveryone: { options: [] },
  revive: { options: [userOption("player", "Player to revive.", true)] },
  setnote: { options: repeatedUserText("player", "note", "Player note", 5, false), buildArgs: interaction => buildRepeatedUserTextArgs(interaction, "player", "note", 5) },
  poll: { options: [stringOption("question", "Poll question.", false)] },
  forceroll: { options: [userOption("player", "Player to roll for.", true), stringOption("intention", "Roll intention.", false)] },
  setmaxallies: { options: [integerOption("limit", "Ally cap. Blank is unlimited; 0 disables alliances.", false)] },
  setmaxnaps: { options: [integerOption("limit", "NAP cap. Blank is unlimited; 0 disables NAPs.", false)] },
  slot: { options: repeatedStrings("faction", "Faction slot", 10), buildArgs: interaction => buildRepeatedStringArgs(interaction, "faction", 10) },
  slotclear: { options: [] },
  slotkeep: { options: [] },
  slotremove: { options: repeatedStrings("faction", "Faction slot to remove", 10), buildArgs: interaction => buildRepeatedStringArgs(interaction, "faction", 10) },
  turn: { options: [stringOption("description", "Turn description.", false), attachmentOption("mup", "Turn MUP image.", false)] },
  turnedit: { options: [stringOption("description", "Turn description.", false), attachmentOption("mup", "Turn MUP image.", false)] },
  editold: { options: [integerOption("turn", "Turn number to edit.", true), stringOption("description", "Turn description.", false), attachmentOption("mup", "Turn MUP image.", false)] },

  ally: { options: targets(10) },
  betray: { options: targets(10) },
  cede: { options: [userOption("target", "Player receiving the cede.", true), stringOption("message", "Cede message.", false), attachmentOption("attachment", "Cede attachment.", false)] },
  checkneedroll: { options: [] },
  claim: { options: [stringOption("faction", "Faction name.", false)] },
  hardquit: { options: [] },
  nap: { options: targets(10) },
  break: { options: targets(10) },
  ragequit: { options: [] },
  say: { options: [stringOption("message", "Message to add to history.", true)] },
  skip: { options: [] },
  vote: { options: [stringOption("vote", "Your vote.", true)] },

  roll: { options: rollOptions(false, false) },
  rolld: { options: rollOptions(true, false, true) },
  rolldx: { options: rollOptions(true, true, true) },
  rolldnd: { options: [stringOption("expression", "DnD roll expression, like 2d20+5.", true), stringOption("intention", "Roll intention.", false), attachmentOption("attachment", "Image/file to attach to the intention.", false)] },
  rollid: { options: rollOptions(false, false) },
  rollx: { options: rollOptions(false, true) },
  rollxd: { options: rollOptions(true, true, false) },
  testroll: { options: rollOptions(false, false) },
  testrolldice: { options: rollOptions(true, false, true) },
  testrolldx: { options: rollOptions(true, true, true) },
  testrolldnd: { options: [stringOption("expression", "DnD roll expression, like 2d20+5.", true), stringOption("intention", "Roll intention.", false), attachmentOption("attachment", "Image/file to attach to the intention.", false)] },
  testrollid: { options: rollOptions(false, false) },
  testrollx: { options: rollOptions(false, true) },
  testrollxd: { options: rollOptions(true, true, false) },
  reference: { options: [integerOption("value", "Roll value to format.", true)] },

  duel: {
    options: [
      userOption("fighter_a", "First fighter.", true),
      userOption("fighter_b", "Second fighter.", true),
      integerOption("a_bonus", "First fighter bonus.", false),
      integerOption("a_hp", "First fighter HP.", false),
      integerOption("a_atk", "First fighter attack.", false),
      integerOption("a_def", "First fighter defense.", false),
      integerOption("b_bonus", "Second fighter bonus.", false),
      integerOption("b_hp", "Second fighter HP.", false),
      integerOption("b_atk", "Second fighter attack.", false),
      integerOption("b_def", "Second fighter defense.", false),
    ],
    buildArgs: buildDuelArgs,
  },
  games: {
    options: [channelOption("channel", "Channel to filter by.", false), stringOption("channel_name", "Channel name to filter by.", false)],
    buildArgs: interaction => joinArgs([getChannelId(interaction, "channel"), getString(interaction, "channel_name")]),
  },
  past: { options: [userOption("master", "Master to filter by.", false), stringOption("title", "Title search.", false)] },
  pasthere: { options: [userOption("master", "Master to filter by.", false), stringOption("title", "Title search.", false)] },
  pastplayer: { options: [userOption("player", "Player to search for.", true)] },
  rollinitiative: { options: [] },
  top: { options: [stringOption("sort", "Leaderboard sort.", false, topSortChoices)] },
  hall: { options: [userOption("user", "User to filter by.", false)] },
  luck: { options: [turnOption()] },
  lurk: { options: [stringOption("faction", "Faction name.", false)] },
  unlurk: { options: [userOption("user", "Lurker to remove. Blank removes yourself.", false)] },
}

function addOptions(builder, commandName) {
  const schema = SCHEMAS[commandName]
  if (!schema) return builder
  if (schema.options.length > OPTION_LIMIT) {
    throw new Error(`${commandName} has ${schema.options.length} options; Discord allows ${OPTION_LIMIT}.`)
  }
  for (const option of schema.options) addOption(builder, option)
  return builder
}

function addOption(builder, option) {
  const configure = o => {
    o.setName(option.name)
      .setDescription(option.description.slice(0, 100))
      .setRequired(Boolean(option.required))
    if (option.choices) {
      for (const choice of option.choices) {
        o.addChoices({ name: choice, value: choice })
      }
    }
    return o
  }

  switch (option.type) {
    case "string":
      return builder.addStringOption(configure)
    case "integer":
      return builder.addIntegerOption(configure)
    case "user":
      return builder.addUserOption(configure)
    case "attachment":
      return builder.addAttachmentOption(configure)
    case "channel":
      return builder.addChannelOption(configure)
    default:
      throw new Error(`Unknown option type ${option.type}`)
  }
}

function buildLegacyArgs(commandName, interaction) {
  const schema = SCHEMAS[commandName]
  if (!schema) return ""
  if (schema.buildArgs) return schema.buildArgs(interaction)
  return joinArgs(schema.options.map(option => legacyValue(interaction, option)))
}

function getAttachment(interaction, commandName) {
  const schema = SCHEMAS[commandName]
  if (!schema) return null
  for (const option of schema.options) {
    if (option.type !== "attachment") continue
    const attachment = interaction.options.getAttachment(option.name)
    if (attachment) return attachment
  }
  return null
}

function legacyValue(interaction, option) {
  switch (option.type) {
    case "string":
      return getString(interaction, option.name)
    case "integer":
      return getInteger(interaction, option.name)
    case "user":
      return mentionUser(interaction, option.name)
    case "channel":
      return getChannelId(interaction, option.name)
    default:
      return null
  }
}

function buildDuelArgs(interaction) {
  return joinArgs([
    mentionUser(interaction, "fighter_a"),
    getInteger(interaction, "a_bonus"),
    getInteger(interaction, "a_hp"),
    getInteger(interaction, "a_atk"),
    getInteger(interaction, "a_def"),
    mentionUser(interaction, "fighter_b"),
    getInteger(interaction, "b_bonus"),
    getInteger(interaction, "b_hp"),
    getInteger(interaction, "b_atk"),
    getInteger(interaction, "b_def"),
  ])
}

function buildRepeatedUserTextArgs(interaction, userName, textName, count) {
  const segments = []
  for (let i = 1; i <= count; i++) {
    const suffix = i === 1 ? "" : `_${i}`
    const user = mentionUser(interaction, `${userName}${suffix}`)
    if (!user) continue
    segments.push(joinArgs([user, getString(interaction, `${textName}${suffix}`)]))
  }
  return segments.join(" | ")
}

function buildRepeatedStringArgs(interaction, name, count) {
  const values = []
  for (let i = 1; i <= count; i++) {
    const suffix = i === 1 ? "" : `_${i}`
    const value = getString(interaction, `${name}${suffix}`)
    if (value) values.push(value)
  }
  return values.join(" | ")
}

function joinArgs(parts) {
  return parts.filter(part => part !== null && part !== undefined && part !== "").join(" ")
}

function getString(interaction, name) {
  return interaction.options.getString(name)
}

function getInteger(interaction, name) {
  const value = interaction.options.getInteger(name)
  return value === null || value === undefined ? null : String(value)
}

function getChannelId(interaction, name) {
  const channel = interaction.options.getChannel(name)
  return channel ? channel.id : null
}

function mentionUser(interaction, name) {
  const user = interaction.options.getUser(name)
  return user ? `<@${user.id}>` : null
}

module.exports = {
  SCHEMAS,
  addOptions,
  buildLegacyArgs,
  getAttachment,
}
