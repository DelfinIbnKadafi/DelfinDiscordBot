const {
    createAudioResource,
    StreamType
} = require("@discordjs/voice");

const fs = require("fs");
const path = require("path");
const player = require("./player");

function playAudio(filePath) {
    const file = path.resolve(__dirname, filePath);
    if (!fs.existsSync(file)) {
        console.log(`Cannot open audio file: ${file}`);
        return;
    }

    // Create an audio resource from the file
    const resource = createAudioResource(file, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
    });

    // Set audio volume
    resource.volume.setVolume(1.0);

    // Play the audio resource
    player.play(resource);
}

module.exports = {
    playAudio
};