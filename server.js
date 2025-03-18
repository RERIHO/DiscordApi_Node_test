require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
const cron = require("cron");

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_API_URL;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const CITY = "Tokyo"; // 任意の都市に変更可能

// Discord Botの設定
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // 毎日6時に天気情報を送信するCronジョブを設定
  const job = new cron.CronJob("0 6 * * *", async () => {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel) {
      const weatherReport = await getWeather();
      channel.send(weatherReport);
    }
  }, null, true, "Asia/Tokyo");

  job.start();
});

// 天気情報を取得する関数
async function getWeather() {
  const url = `https://weather.tsukumijima.net/api/forecast/city/130010`;
  const response = await fetch(url);
  if (!response.ok) {
    return "天気情報の取得に失敗しました。";
  }
  const data = await response.json();
  return `${CITY}の天気: ${data.weather[0].description}, 気温: ${data.main.temp}℃`;
}

// Botの起動
client.login(TOKEN);
