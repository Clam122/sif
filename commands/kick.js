exports.run = async (client, message, args) => {
  let member = message.mentions.members.first();
  if(!member) return message.reply("Error: Please specify a member.");
  if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Error: You may not do that, check the role hierarchy.");
  if(!member.kickable) return message.channel.send("Error: This member isn't kickable, please check my perms.");

  let reason = args.slice(1).join(" ");
  if(!reason) reason = "Unspecified, autogenerated.";

  let modLogChannel = message.guild.channels.find(c => c.name === message.settings.modLogChannel);
  if(!modLogChannel) return message.channel.send(`Error: Please set up a moderation log by using \`${message.settings.prefix}set edit modLogChannel #channel-name\``);

  let embed = await client.generateModEmbed(member, "Kick", message.member, reason);
  if(!embed) return message.channel.send("Error: An unexpected error has occured... exiting.");

  modLogChannel.send(embed);
  await member.kick(reason);
  message.channel.send(embed);
};

exports.help = {
  name: "kick",
  description: "kick a user from your server.",
  usage: "kick <member> <reason>",
  category: "Moderation Actions"
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};