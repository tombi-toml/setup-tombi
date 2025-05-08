"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("node:path"));
const os = __importStar(require("node:os"));
const fs = __importStar(require("node:fs"));
const node_crypto_1 = require("node:crypto");
const node_child_process_1 = require("node:child_process");
async function run() {
    try {
        const version = core.getInput("version");
        const checksum = core.getInput("checksum") || undefined;
        // Determine the download URL based on version and platform
        const baseUrl = "https://tombi-toml.github.io/tombi/install.sh";
        // Download the install script
        core.info("Downloading Tombi install script...");
        const scriptPath = await tc.downloadTool(baseUrl);
        // Make the script executable
        await fs.promises.chmod(scriptPath, "755");
        // Execute the install script with appropriate version if specified
        const versionArgs = [];
        if (version) {
            versionArgs.push(` --version ${version}`);
        }
        core.info(`Installing Tombi${versionArgs.join("")}...`);
        core.info(`Execute: ${scriptPath}${versionArgs.join("")}`);
        (0, node_child_process_1.execSync)(`${scriptPath}${versionArgs.join("")}`, { stdio: "inherit" });
        // Add Tombi to PATH
        const binPath = path.join(os.homedir(), ".local", "bin", "tombi");
        core.addPath(binPath);
        // Verify checksum if provided
        if (checksum) {
            const fileBuffer = await fs.promises.readFile(binPath);
            const hashSum = (0, node_crypto_1.createHash)("sha256");
            hashSum.update(fileBuffer);
            const hex = hashSum.digest("hex");
            if (hex !== checksum) {
                throw new Error(`Checksum verification failed. Expected: ${checksum}, Got: ${hex}`);
            }
            core.info("Checksum verification passed");
        }
        core.info("Tombi installed successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed("An unexpected error occurred");
        }
    }
}
run();
