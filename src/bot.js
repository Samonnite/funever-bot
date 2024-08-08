/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const {
  Bot,
  Keyboard,
  InlineKeyboard,
  GrammyError,
  HttpError,
} = require("grammy");

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "7288434975:AAH1Cb2i1bkjNoKmkqv9ulZs4Q9hD43U7yQ";
const MINI_APP_HOST =
  process.env.MINI_APP_HOST || "https://dapp-test.funever.io";

const { SocksProxyAgent } = require("socks-proxy-agent");

const socksAgent = new SocksProxyAgent("socks://127.0.0.1:7890");
const bot = new Bot(TELEGRAM_BOT_TOKEN, {
  client: {
    // baseFetchConfig: {
    //   agent: socksAgent,
    //   compress: true,
    // },
    timeoutSeconds: 60,
  },
});
const inlineKeyboard = new InlineKeyboard().add(
  InlineKeyboard.webApp("参与竞猜", `${MINI_APP_HOST}/dapp/home`)
);
// 监听信息
bot.on("message:text", async (ctx) => {
  // ctx.reply("已收到: " + ctx.message.text);
  if (ctx.message.text === "竞猜") {
    await ctx.api.sendPhoto(
      ctx.chatId,
      "https://funever.io/assets/img/man-2.png",
      {
        caption: "The Ultimate Web3 Gaming And E-sports Aggregator",
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
        protect: true,
      }
    );
  } else {
    await ctx.reply("Welcome to Funever", {
      reply_markup: keyboard,
    });
  }
});

const keyboard = new Keyboard().text("竞猜").persistent().resized();
bot.start();

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
