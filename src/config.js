import {config} from "dotenv"

config()

export const PORT = process.env.PORT || 4000
export const DB_USER = process.env.DB_USER ||"id21170889_zeldiuss"
export const DB_PASSWORD = process.env.DB_PASSWORD || "Anime123#"
export const DB_HOST = process.env.DB_HOST || "localhost"
export const DB_DATABASE = process.env.DB_DATABASE || "id21170889_faunotattoowebdb"
export const DB_PORT = process.env.DB_PORT || 3300
export const JWT_KEY = process.env.JWT_KEY || "anime"

console.log(process.env.PORT)