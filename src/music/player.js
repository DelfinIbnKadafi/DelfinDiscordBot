const {
    createAudioPlayer,
    AudioPlayerStatus
} = require("@discordjs/voice");

// Create an audio player
const player = createAudioPlayer();

// Listen for audio playback events
player.on(AudioPlayerStatus.Playing, () => {
    console.log("Audio is now playing.");
});

player.on(AudioPlayerStatus.Idle, () => {
    console.log("Audio playback finished.");
});

player.on("error", (error) => {
    console.error("Audio player error:", error);
});

module.exports = player;