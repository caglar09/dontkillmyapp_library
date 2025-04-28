const fs = require("fs");
const path = require("path");

// Create the lib/data directory if it doesn't exist
const libDataDir = path.join(__dirname, "lib", "data");
if (!fs.existsSync(libDataDir)) {
	fs.mkdirSync(libDataDir, { recursive: true });
	console.log("Created directory:", libDataDir);
}

// Copy the JSON file from data to lib/data
const sourceFile = path.join(__dirname, "data", "dontkillmyapp_data.json");
const targetFile = path.join(libDataDir, "dontkillmyapp_data.json");

try {
	fs.copyFileSync(sourceFile, targetFile);
	console.log("Successfully copied JSON data file to lib/data directory");
} catch (err) {
	console.error("Error copying JSON data file:", err);
	process.exit(1);
}
