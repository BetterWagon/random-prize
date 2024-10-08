import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "./.env" });

const authRoom = process.env.RANDOM_PRIZE_AUTH.split(",");

let lastWinTime;

function readTime() {
	fs.readFile("./data/prizeLastWin", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		lastWinTime = parseInt(data);
	});
}

function saveTime() {
	const currentUnixTime = Date.now();
	fs.writeFile("./data/prizeLastWin", currentUnixTime.toString(), (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}

readTime();

let blacklist = [];

function loadBlacklist() {
	fs.readFile("./data/blacklist.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		blacklist = JSON.parse(data);
	});
}

loadBlacklist();

export function randomPrize(msg) {
	if (!authRoom.includes(msg.room) || 
        blacklist.some(prefix => msg.sender.name.toLowerCase().startsWith(prefix)) || 
        (Date.now() - lastWinTime < 604800000)) {
		return;
	}

	if (Math.random() <= 0.001) {
		msg.reply(msg.sender.name + process.env.RANDOM_PRIZE);
		saveTime();
		readTime();
	}
}
