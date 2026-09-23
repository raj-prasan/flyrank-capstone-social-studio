import {InlineKeyboardBuilder, Bot } from "node-telegram-bot-api";
import { config } from "dotenv";
import { addTelegramUser, telegramUsers } from "../db/db.handler.js";
config();
console.log(process.env.BOT_TOKEN!)
export const bot = new Bot(process.env.BOT_TOKEN!);


bot.command("start", async(msg)=>{
  console.log('User registered: ', msg.chat?.id) 
  if(msg.chat){
    await addTelegramUser(msg.chat.id)
  }
  msg.reply("Hi! Send me anything.")
})

bot.hears(/echo (.+)/, (ctx) => ctx.reply(ctx.match![1]!));

bot.on("message", (ctx) =>
  ctx.reply("Pick one:", {
    reply_markup: new InlineKeyboardBuilder()
      .text("👍", "up")
      .text("👎", "down")
      .build(),
  }),
);

// 🔘 a tapped inline button comes back as a callback_query
bot.on("callback_query", async (ctx) => {
  await ctx.answerCallbackQuery({ text: `You tapped ${ctx.callbackQuery!.data}` });
});

export const broadcastToAllUsers = async(messageText:string)=>{
  const users  = await telegramUsers();
  console.log(users)
  for(const user of users){
    await bot.api.sendMessage({ chat_id: user.user_id, text: messageText });
    console.log(`Sent to ${user.user_id}`)
  }
}





