import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder().setName("magic-help").setDescription("Explains the app!"),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setAuthor({ name: "Dave Isakov" })
			.setTitle("Magic-Bot")
			.setDescription(
				"The magic bot helps you link directly to scryfall from discord! The below commands are available."
			)
			.addFields(
				{
					name: "Search",
					value: `
                    **/search**  
                    One text field option to search for cards by what Oracle text they have and a color ID option that, if true, 
                    will determine whether the colors picked in the follow up message are by commander identity or strict color.  
                    This will also bring up a small filter message that allows you to filter by card type and color before submitting the search.                      
                    Returns a link to the Scryfall website with the search performed.
                    `,
				},
				{
					name: "Card",
					value: `
                    **/card**  
                    This will perform a fuzzy search of Scryfall by card name.  
                    It will return an image of the card and a link to Scryfall of the card.
                    `,
				}
			);
		await interaction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
	},
};
