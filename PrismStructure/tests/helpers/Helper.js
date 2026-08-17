const fs = require('fs');

function createFolder(folderPath) {

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

module.exports = {
    createFolder
};