import {
	SlashCommandBuilder,
	MessageFlags,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { convertColors, convertText, convertTypes } from "../../querybuilder/querybuilder.js";

export default {
	data: new SlashCommandBuilder()
		.setName("search")
		.setDescription(
			"Search to receive link to scryfall of list of cards based on parameters provided"
		)
		.addStringOption((option) =>
			option.setName("text").setDescription("Oracle text in the card to search for")
		)
		.addBooleanOption((option) =>
			option
				.setName("color-id")
				.setDescription(
					"True to search by commander color identity instead of strict color. Default is False"
				)
		),
	async execute(interaction) {
		const selectedTypes = new Set();
		const selectedButtons = new Set();
		const createSelectMenu = () => {
			return new StringSelectMenuBuilder()
				.setCustomId("Card Type")
				.setPlaceholder("Select the Card Types you wish to search")
				.setMinValues(0)
				.setMaxValues(10)
				.addOptions(
					[
						"Creature",
						"Artifact",
						"Land",
						"Legendary",
						"Enchantment",
						"Sorcery",
						"Instant",
						"Planeswalker",
						"Equipment",
						"Aura",
					].map((type) =>
						new StringSelectMenuOptionBuilder()
							.setLabel(type)
							.setValue(type)
							.setDefault(selectedTypes.has(type))
					)
				);
		};
		const buttons = {
			red: new ButtonBuilder()
				.setCustomId("red")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("🔥"),
			green: new ButtonBuilder()
				.setCustomId("green")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("🌳"),
			white: new ButtonBuilder()
				.setCustomId("white")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("☀️"),
			black: new ButtonBuilder()
				.setCustomId("black")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("💀"),
			blue: new ButtonBuilder()
				.setCustomId("blue")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("💧"),
		};
		const submit = new ButtonBuilder()
			.setCustomId("Submit")
			.setLabel("Submit")
			.setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder().addComponents(createSelectMenu());
		const row2 = new ActionRowBuilder().addComponents(Object.values(buttons));
		const row3 = new ActionRowBuilder().addComponents(submit);
		const response = await interaction.reply({
			content: `Your Oracle text search: ${
				interaction.options.getString("text") ? interaction.options.getString("text") : ""
			}\nFilter your search further?`,
			components: [row, row2, row3],
			flags: MessageFlags.Ephemeral,
			withResponse: true,
		});

		const collector = response.resource.message.createMessageComponentCollector({
			filter: (i) => i.isButton() || i.isStringSelectMenu(),
			time: 3_600_000,
		});

		collector.on("collect", async (i) => {
			const colorID = interaction.options.getBoolean("color-id");
			if (i.isButton()) {
				const button = i.customId;
				if (button === "Submit") {
					const card = await fetch(
						`https://api.scryfall.com/cards/search?q=${convertText(
							interaction.options.getString("text")
						)}${convertTypes(selectedTypes)}${convertColors(selectedButtons, colorID)}`
					);
					if (card.status === 404) {
						await i.reply({
							content: "No cards were found",
							flags: MessageFlags.Ephemeral,
						});
					} else {
						await interaction.deleteReply();
						await i.reply({
							content: `https://scryfall.com/search?q=${convertText(
								interaction.options.getString("text")
							)}${convertTypes(selectedTypes)}${convertColors(
								selectedButtons,
								colorID
							)}`,
							flags: MessageFlags.Ephemeral,
						});
					}
					return;
				}
				if (selectedButtons.has(button)) {
					selectedButtons.delete(button);
					buttons[button].setStyle(ButtonStyle.Primary);
				} else {
					selectedButtons.add(button);
					buttons[button].setStyle(ButtonStyle.Secondary);
				}
			} else if (i.isStringSelectMenu()) {
				selectedTypes.clear();
				i.values.forEach((value) => selectedTypes.add(value));
			}
			const updatedRow1 = new ActionRowBuilder().addComponents(createSelectMenu());
			const updatedRow2 = new ActionRowBuilder().addComponents(Object.values(buttons));
			const updatedRow3 = new ActionRowBuilder().addComponents(submit);
			await i.update({ components: [updatedRow1, updatedRow2, updatedRow3] });
		});
	},
};
