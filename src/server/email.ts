import emailjs from "@emailjs/nodejs";
import { env } from "~/env";

emailjs.init({
  publicKey: env.EMAILER_PUBLIC_KEY,
  privateKey: env.EMAILER_PRIVATE_KEY,
});

export default emailjs;
