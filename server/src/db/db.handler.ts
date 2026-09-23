import { db } from "./db.init.js";

export const telegramUsers = async()=>{
  const result = await db.query(`SELECT user_id FROM telegram_users`);
  return result.rows;
}

export const addTelegramUser = async(id: number)=>{
  await db.query(`INSERT INTO telegram_users (user_id) VALUES ($1)`,[id])
}