require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${dayName}, ${monthName} ${day}${ordinalSuffix(day)}, ${year}`;
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
  }, { timezone: process.env.TIMEZONE });
});

client.login(process.env.DISCORD_TOKEN);
