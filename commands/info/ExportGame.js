const Discord = require("discord.js");
const BaseCommand = require("../base_command");
const Database = require("../../database");
const ChannelStatusCommand = require("./ChannelStatus");
const OldStatusCommand = require("./OldStatus");
const GamePresenter = require("../../presenters/game_presenter");

module.exports = class ExportGameCommand extends BaseCommand {
  static aliases = ["ExportGame", "GameExport", "Export"];
  static description = "Export a game to a text file.";
  static argsDescription = "[ChannelId] [GameId]";
  static category = "Game";

  getsGame = false;
  canDelete = true;

  async execute() {
    const loaded = await this.loadRequestedGame();
    if (loaded.error) {
      return this.replyDeletable(loaded.error);
    }

    const exportText = this.makeExportText(loaded.game);
    const filename = this.makeFilename(loaded.game, loaded.isPrevious);
    return await this.sendFileMessage(filename, exportText, "");
  }

  async sendFileMessage(filename, content, message = "") {
    const attachment = new Discord.MessageAttachment(
      Buffer.from(content, "utf8"),
      filename
    );
    const options = {
      files: [attachment],
    };
    if (!this.canMention) options.allowedMentions = { parse: [] };
    this.reply = await this.doSendReply(message, options);
    await this.afterReply();
    return this.reply;
  }

  async loadRequestedGame() {
    if (!this.args.length) {
      const database = new Database(this.message.channel);
      const game = database.getGame();
      if (!game) {
        return { error: "There is no game being hosted in this channel." };
      }
      return { game, isPrevious: false };
    }

    const channelId = this.args[0];
    const gameId = this.args[1];

    if (!this.isSnowflake(channelId)) {
      return { error: `Try again with ${this.constructor.argsDescription}` };
    }

    if (gameId && !this.isNumericId(gameId)) {
      return { error: `Try again with ${this.constructor.argsDescription}` };
    }

    if (gameId) {
      const oldStatus = new OldStatusCommand(
        this.message,
        channelId,
        this.serverId,
        gameId
      );
      await oldStatus.prepare();
      if (!oldStatus.game) {
        return { error: "No previous game was found with those ids." };
      }
      return { game: oldStatus.game, isPrevious: true };
    }

    const status = new ChannelStatusCommand(
      this.message,
      channelId,
      this.serverId
    );
    await status.prepare();
    if (!status.game) {
      return { error: "There is no game being hosted in that channel." };
    }
    return { game: status.game, isPrevious: false };
  }

  makeExportText(game) {
    const presenter = new GamePresenter(game);
    const lines = [];

    lines.push(`Game: ${game.name}`);
    lines.push(`Channel ID: ${game.channel}`);
    lines.push(`Master: ${game.masterUsername} (${game.masterId})`);
    lines.push(`Started At: ${this.formatDate(game.startedAt)}`);
    if (game.endedAt) {
      lines.push(`Ended At: ${this.formatDate(game.endedAt)}`);
    }
    lines.push(`Turns: ${game.turnNumber}`);

    for (let turnIndex = 0; turnIndex <= game.turnNumber; turnIndex++) {
      lines.push("");
      lines.push("=".repeat(80));
      lines.push(`TURN ${turnIndex}`);
      lines.push("=".repeat(80));

      const turn = game.getTurn(turnIndex);
      const statusEmbed = presenter.makeStatusEmbed(turnIndex, false);
      lines.push(...this.renderStatusEmbed(statusEmbed, turn));
      lines.push("");
      lines.push("History:");
      lines.push(...this.renderTurnHistory(turn));
    }

    return lines.join("\n").trim() + "\n";
  }

  renderStatusEmbed(embed, turn) {
    const lines = [];

    if (embed.title) lines.push(`Title: ${this.replaceMentions(embed.title, turn)}`);
    if (embed.description) {
      lines.push("Summary:");
      lines.push(this.replaceMentions(embed.description, turn));
    }

    if (embed.fields && embed.fields.length) {
      for (const field of embed.fields) {
        lines.push("");
        lines.push(`${this.replaceMentions(field.name, turn)}:`);
        lines.push(this.replaceMentions(field.value, turn));
      }
    }

    const mup = embed.image?.url || embed.thumbnail?.url;
    if (mup) {
      lines.push("");
      lines.push(`MUP: ${mup}`);
    }

    if (embed.footer?.text) {
      lines.push("");
      lines.push(`Footer: ${this.replaceMentions(embed.footer.text, turn)}`);
    }

    return lines;
  }

  renderTurnHistory(turn) {
    if (!turn || !turn.history || !turn.history.length) {
      return ["(No events)"];
    }

    const lines = [];
    for (let i = 0; i < turn.history.length; i++) {
      const entry = turn.history[i];
      lines.push(`[${i + 1}] ${this.formatHistoryHeader(entry)}`);
      lines.push(this.replaceMentions(entry.history || entry.summary || "", turn));
      lines.push("");
    }
    lines.pop();
    return lines;
  }

  formatHistoryHeader(entry) {
    const parts = [];
    if (entry.time) parts.push(entry.time);
    if (entry.category) parts.push(`category=${entry.category}`);
    if (entry.type) parts.push(`type=${entry.type}`);
    return parts.join(" | ");
  }

  formatDate(timestamp) {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString();
  }

  makeFilename(game, isPrevious) {
    const safeName = this.cleanFilename(game.name || "game");
    const kind = isPrevious ? "previous" : "current";
    return `${safeName}-${game.channel}-${game.startedAt}-${kind}.txt`;
  }

  cleanFilename(text) {
    return (
      String(text)
        .replace(/[^a-z0-9-_]+/gi, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 80) || "game"
    );
  }

  replaceMentions(text, turn) {
    if (!text) return text;

    return String(text).replace(/<@!?(\d+)>/g, (_match, userId) => {
      const player = turn?.getPlayerFromId?.(userId);
      if (player) return this.getReadablePlayerName(player);
      return `@${userId}`;
    });
  }

  getReadablePlayerName(player) {
    const faction = player.name ? ` (${player.name})` : "";
    return `${player.username}${faction}`;
  }

  isSnowflake(value) {
    return /^\d{17,20}$/.test(value);
  }

  isNumericId(value) {
    return /^\d+$/.test(value);
  }
};
