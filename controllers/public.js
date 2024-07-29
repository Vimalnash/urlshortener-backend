import { SHORTURL } from "../models/shorturl.js"

// Find based on Shortname
function getLongUrl(shortname) {
    return SHORTURL.findOne({shortname: shortname})
}

export {
    getLongUrl,
}