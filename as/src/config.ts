export default {

  port: parseInt(process.env.AS_PORT || "4444"),

  cache_host: process.env.CACHE_HOST,
  cache_port: parseInt(process.env.CACHE_PORT),

  sender_name: "SEWB",
  sender_email: "no_reply@sewb.dev"

}