
const { checkVideo, download } = require("./download");

async function request(discordid, link) {

    const result = await checkVideo(link);

    if(!result.found) {
        return 0; // 0 as can find video
    }

    // download vidio
    const fname = discordid.toString();
    download(link, fname);

}

module.exports = {
    request
}