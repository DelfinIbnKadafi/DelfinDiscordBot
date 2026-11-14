const {
    createAudioResource,
    StreamType
} = require("@discordjs/voice");

const player = require("./player");

function playAudio(filePath) {
    // Create an audio resource from the file
    const resource = createAudioResource(filePath, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
    });

    // Set audio volume to 50%
    resource.volume.setVolume(0.5);

    // Play the audio resource
    player.play(resource);
}

module.exports = {
    playAudio
};