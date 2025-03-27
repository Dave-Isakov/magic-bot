import { SlashCommandBuilder, MessageFlags } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Searches Scryfall for a magic card, returns card image and link')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The card to search for (fuzzy search)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const searchQuery = interaction.options.getString('name');
        const cardName = searchQuery.replaceAll(" ", "-");
        console.log(cardName);
        await new Promise(resolve => setTimeout(resolve, 400));
		const card = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
        if (card.status === 404) {
            await interaction.reply({ content: 'Either no card was found or your search is too vague.', flags: MessageFlags.Ephemeral })
        } else {
            await interaction.reply(`${card.headers.get("x-scryfall-card-image")}\n${card.headers.get("x-scryfall-card")}`);
        }
    }
}