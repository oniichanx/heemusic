import { Command, type Context, type heemusic } from "../../structures/index.js";
import { Language, LocaleFlags } from "../../types.js";

export default class LanguageCommand extends Command {
    constructor(client: heemusic) {
        super(client, {
            name: "language",
            description: {
                content: "cmd.language.description",
                examples: ["language set `EnglishUS`", "language reset"],
                usage: "language",
            },
            category: "config",
            aliases: ["lang"],
            cooldown: 3,
            args: true,
            vote: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "cmd.language.options.set",
                    type: 1,
                    options: [
                        {
                            name: "language",
                            description: "cmd.language.options.language",
                            type: 3,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "reset",
                    description: "cmd.language.options.reset",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: heemusic, ctx: Context, args: string[]): Promise<any> {
        let subCommand: string;

        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
        } else {
            subCommand = args.shift();
        }
        if (subCommand === "set") {
            const embed = client.embed().setColor(this.client.color.main);

            const locale = await client.db.getLanguage(ctx.guild!.id);

            let lang: string;

            if (ctx.isInteraction) {
                lang = ctx.interaction.options.data[0].options[0].value as string;
            } else {
                lang = args[0];
            }

            if (!Object.values(Language).includes(lang as Language)) {
                const availableLanguages = Object.entries(LocaleFlags)
                    .map(([key, value]) => `${value}:\`${key}\``)
                    .reduce((acc, curr, index) => {
                        if (index % 2 === 0) {
                            return acc + curr + (index === Object.entries(LocaleFlags).length - 1 ? "" : " ");
                        }
                        return `${acc + curr}\n`;
                    }, "");
                return ctx.sendMessage({
                    embeds: [embed.setDescription(ctx.locale("cmd.language.invalid_language", { languages: availableLanguages }))],
                });
            }

            if (locale && locale === lang) {
                return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.already_set", { language: lang }))] });
            }

            await client.db.updateLanguage(ctx.guild!.id, lang);
            ctx.guildLocale = lang;

            return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.set", { language: lang }))] });
        }
        if (subCommand === "reset") {
            const embed = client.embed().setColor(this.client.color.main);

            const locale = await client.db.getLanguage(ctx.guild!.id);

            if (!locale) {
                return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.not_set"))] });
            }

            await client.db.updateLanguage(ctx.guild!.id, Language.EnglishUS);
            ctx.guildLocale = Language.EnglishUS;

            return ctx.sendMessage({ embeds: [embed.setDescription(ctx.locale("cmd.language.reset"))] });
        }
    }

    public async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();

        // Fetch all available languages
        const languages = Object.values(Language).map(language => ({
            name: language,
            value: language,
        }));

        // Filter languages based on the focused value
        const filtered = languages.filter(language =>
            language.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        // Respond with the filtered language options
        await interaction.respond(filtered.slice(0, 25)).catch(console.error);
    }


}