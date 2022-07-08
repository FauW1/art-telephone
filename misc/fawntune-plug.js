// NOTE: AN EMBED OBJECT!! EDITED DIFFERENTLY
// https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object

const fawntuneEmbed = {
	color: 0x0824deb,
	title: 'Hope you enjoy my bot!',
	description: 'Check out more of my work and consider supporting me! :)',
  thumbnail: {
    url: "https://i.imgur.com/J0w3MWF.png",
  },
	fields: [
		{ name: 'Support me on Ko-Fi', value: 'https://ko-fi.com/fawntune' },
		{ name: 'Instagram', value: 'https://www.instagram.com/faustine.art/', inline: true },
		{ name: 'Itch.io', value: 'https://fawntune.itch.io/', inline: true },
    { name: 'Linktree', value: 'https://linktr.ee/faustinew', inline: true },
	],
};

module.exports = fawntuneEmbed;
