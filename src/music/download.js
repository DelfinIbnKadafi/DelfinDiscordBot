const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpeg = require('fluent-ffmpeg');

function download(link, name) {
    const outputDir = path.resolve('src/music/audio');
    const outputFile = path.join(outputDir, `${name}.mp3`);

    // Create the output directory if it does not exist
    fs.mkdirSync(outputDir, { recursive: true });

    // Spawn yt-dlp and pipe its audio output
    const stream = spawn('yt-dlp', [
        '-f', 'bestaudio',
        '-o', '-',
        link
    ], {
        stdio: ['ignore', 'pipe', 'pipe']
    });

    // Convert the audio stream to MP3
    ffmpeg(stream.stdout)
        .toFormat('mp3')
        .on('error', (error) => {
            console.error('FFmpeg error:', error.message);
        })
        .save(outputFile);

    stream.stderr.on('data', (data) => {
        console.error(`yt-dlp: ${data}`);
    });

    stream.on('error', (error) => {
        console.error('yt-dlp spawn error:', error.message);
    });

    stream.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp exited with code ${code}`);
        }
    });
}

const { spawn: spawnProcess } = require('child_process');

function checkVideo(link) {
    return new Promise((resolve, reject) => {
        const process = spawnProcess('yt-dlp', [
            '--dump-single-json',
            '--no-warnings',
            '--skip-download',
            link
        ]);

        let output = '';
        let error = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            error += data.toString();
        });

        process.on('error', reject);

        process.on('close', (code) => {
            if (code !== 0) {
                return resolve({
                    found: false,
                    error: error.trim()
                });
            }

            try {
                const video = JSON.parse(output);

                resolve({
                    found: true,
                    title: video.title,
                    duration: video.duration,
                    url: video.webpage_url
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

module.exports = {
    download,
    checkVideo
};