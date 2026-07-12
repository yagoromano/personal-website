import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SOURCE = "C:\\Users\\Owner\\Yago\\Personal\\Jobs\\Yago_Romano_Resume.pdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, "..", "public", "resume", "Yago_Romano_Resume.pdf");

copyFileSync(SOURCE, dest);

console.log(`Resume synced from ${SOURCE} to ${dest}`);
