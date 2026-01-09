require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${dayName}, ${month}/${day}/${year}`;
}

async function sendMorningMessage() {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (!channel) {
    console.error('Channel not found');
    return;
  }

  const dateString = formatDate(new Date());
  const message = await channel.send(dateString);
  const thread = await message.startThread({ name: dateString });
  await thread.send('Good morning!');
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Schedule daily message at 7:00 AM
  cron.schedule('0 7 * * *', () => {
    sendMorningMessage();
  });
});

client.login(process.env.DISCORD_TOKEN);
