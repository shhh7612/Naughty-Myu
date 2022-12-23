import type { Message } from 'discord.js';
import Counter from '../structures/database//counter.js';

export type Channels = Array<{ channel: string; emojis: Array<string>; msgs: Array<string>; t: number; d: boolean }>;

const channels: Channels = [
	{ channel: '995368611822706708', emojis: ['💖'], msgs: ['>:('], t: 0, d: true }, //SB_msgblocktest
	{
		channel: '1054430036146528290',
		emojis: ['<a:akafeheart:1009602965616726026>', '<:cocsmile:960630832219971624>', '<:chopain:960614470940504075>', '<:cindizzy:960630695464669214>', '<:mapmad:960614761349935134>'],
		msgs: ['Nyuuu~ no tyext in the meme channel~! >w<', 'Bakaa customer~, read the channel descwiption~! >w>', 'Nyaaa~! Memes only means memes onlyy~ >w>'],
		t: 0,
		d: true,
	}, //NN_memes-only
	{ channel: '1054504499043123240', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_meow-chat
	{ channel: '1054540453061611532', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_vanilla
	{ channel: '1054540472611246131', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_chocola
	{ channel: '1054533703004594257', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_azuki
	{ channel: '1054533717013577769', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_coconut
	{ channel: '1054533728598245426', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_maple
	{ channel: '1054533742070333501', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ['>'], t: 999999999, d: false }, //NN_cinnamon
	{ channel: '1054430038721839220', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_ecchi
	{ channel: '1054430039233536071', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_love-hotel
	{ channel: '1054430039233536072', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_love-hotel-3d
	{ channel: '1054585186332975114', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_femdom
	{ channel: '1054430039233536074', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_giantess
	{ channel: '1054430039233536073', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_futa
	{ channel: '1054585693906677840', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_trap
	{ channel: '1054586516053168159', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_furry
	{ channel: '1054430039233536077', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!"], t: 10, d: false }, //NN_greyment
];

export default async (message: Message<boolean>) => {
	const channel = channels.find(({ channel }) => channel === message.channelId);
	if (!channel || message.channel.type !== 0 || !message?.id) return;
	const counter = (await Counter.findOrCreate({ where: { id: message.channelId } }))[0];
	if (message.attachments.size > 0) {
		const checks: Array<number> = [];
		for (const [s, attachment] of message.attachments) {
			if (attachment.contentType?.match(/video\/|image\//g)) checks.push(1);
			else checks.push(0);
		}
		if (!checks.includes(0)) return finish(message, counter, channel);
	}
	if (message.content) {
		const contents = message.content.split(' ');
		const checks: Array<number> = [];
		for (const content of contents) {
			if (
				content.startsWith('https://tenor.com/view/') ||
				content.startsWith('https://www.reddit.com/') ||
				content.startsWith('https://twitter.com/') ||
				content.startsWith('https://vxtwitter.com/') ||
				content.match(/^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g)
			) {
				checks.push(1);
			} else if (content.startsWith('http')) {
				const data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
				if (data) {
					const type = data.headers.get('content-type');
					if (type?.match(/video\/|image\//g)) checks.push(1);
					else checks.push(0);
				}
			}
		}
		if (!checks.includes(0) && checks.length > 0) return finish(message, counter, channel);
		else {
			counter.count++;
			counter.save();
			if (counter.count >= channel.t) {
				message.channel.send(channel.msgs[Math.floor(Math.random() * channel.msgs.length)]).then((msg) => {
					setTimeout(() => {
						msg.delete().catch(() =>
							setTimeout(() => {
								msg.delete().catch(() =>
									setTimeout(() => {
										msg.delete().catch((e) => console.log(e));
									}, 60000 * 2)
								);
							}, 60000)
						);
					}, 30000);
				});
				if (channel.d && message.deletable) {
					message.delete().catch((e) => {
						setTimeout(() => {
							message.delete().catch((e) => {
								console.log('error deleting message:', e);
							});
						}, 10000);
					});
				}
			}
		}
	}
};

function finish(message: Message<boolean>, counter: Counter, channel: Channels[0]) {
	if (message.channel.type !== 0) return;
	if (!message?.id) return;
	counter.count = 0;
	counter.save();
	for (const emoji of channel.emojis) {
		message.react(emoji).catch((e: Error) => console.log('error reacting to a message'));
	}
}
