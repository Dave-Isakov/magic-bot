import { config } from "dotenv";
import { Client, IntentsBitField } from "discord.js";

config();
const wait = async (time) => {
    await new Promise(resolve => setTimeout(resolve, time));
};

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

client.on("messageCreate", async (message) => {
	if (message.author !== message.author.bot && message.mentions.has(client.user)) {
        console.log(client.user.id)
		const cardName = message.content.replace(/<@!?&?(\d+)>/g, "").trim().replaceAll(" ", "-");
        await wait(400);
        console.log(cardName);
		const card = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
        if (card.status === 404) {
            message.channel.send('Search too vague or that card isn\'t real, man!')
        } else {
            message.channel.send(`${card.headers.get("x-scryfall-card-image")} \n${card.headers.get("x-scryfall-card")}`);
        }
	}
});

client.on("messageUpdate", async (_, new_message) => {
	if (new_message.author !== new_message.author.bot && new_message.mentions.has(client.user)) {
        console.log(client.user.id)
        const cardName = new_message.content.replace(/<@!?&?(\d+)>/g, "").trim().replaceAll(" ", "-");
        await wait(400);
        console.log(cardName);
        const card = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
        if (card.status === 404) {
            new_message.channel.send('Seriously, are you sure you know what card you want?');
        } else {
            new_message.channel.send(`${card.headers.get("x-scryfall-card-image")} \n${card.headers.get("x-scryfall-card")}`);
        }
	}
});

client.login(process.env.BOT_TOKEN);
