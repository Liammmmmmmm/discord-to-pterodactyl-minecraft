const fs = require("fs");
const { settings } = require("../settings")
const DatabaseConnection = require("../utils/SQLRequest")
const { warn, error, info, success, debug } = require("../utils/Console");

const languages = fs.readdirSync('./langs/texts').filter(file => file.endsWith('.js')).map(file => file.replace(".js", ""));

if(!languages.includes(settings.messages.defaultLang)) {
    error("Default language isn't an actual language");
}

/**
 * A class to manage user language settings and retrieve language-specific texts from a language file.
 * 
 * @example
 * let text = new Txt();
 * await text.init('putuseridhere'); // init is required
 * 
 * text.changeLanguage(lang); // change the lang of the user
 * text.getLanguage(); // get the lang of the user
 * 
 * message = text.get("commandName", "textIndex");  
 */
class Txt {
    /**
     * Constructs a new txt instance and sets the default language.
     */
    constructor() {
        this.lang = settings.messages.defaultLang;
    }

    /**
     * Initializes the language setting for a user by fetching the language from the database.
     * If the user is not registered or an error occurs, the default language is set.
     * 
     * @param {string} userid - The Discord ID of the user.
     * @returns {Promise<number>} - Returns 1 if the initialization is successful, 0 otherwise.
     */
    async init(userid) {
        let resp = 0;
        if (userid) {
            this.userid = userid;
            let db = new DatabaseConnection();
            await db.request("SELECT lang FROM users WHERE discord_id = ?", [userid])
            .then(res => {
                if(res.length == 1) {
                    if(languages.includes(res[0].lang)) {
                        this.lang = res[0].lang;
                        resp = 1;
                    } else {
                        debug.warn(`Selected language ${res[0].lang} isn't a configured language. Selecting defaukt language.`);
                        this.lang = settings.messages.defaultLang;
                    }
                } else {
                    debug.info(`User ${userid} isn't registered yet. Selecting default lang ${settings.messages.defaultLang}`);
                    addUserDefaultLang(userid);
                    this.lang = settings.messages.defaultLang;
                    resp = 1;
                }
            })
            .catch(err => {
                debug.warn(`An error occured while fetching user ${userid} in database. Selecting default lang ${settings.messages.defaultLang}`);
                this.lang = settings.messages.defaultLang;
            })
        } else {
            debug.error("Error creating txt object, no user provided");
            this.lang = settings.messages.defaultLang;
        }
        return resp;
    }

    /**
     * Retrieves the text for a specific command and text index in the user's language.
     * If the text is not found in the user's language, it falls back to the default language.
     * 
     * @param {string} command - The command name.
     * @param {string} text - The text index.
     * @param {object} objects - The text index.
     * @returns {string} - The localized text.
     */
    get(command, text, objects) {
        let texts = require("./texts/" + this.lang).texts[command][text];
        if(!texts) texts = require("./texts/" + settings.messages.defaultLang   + ".js").texts[command][text];
        if(!texts) texts = "Text error";
        if(objects) texts = replaceVariables(texts, objects);
        return texts;
    }

    /**
     * Changes the language of the user in the database.
     * 
     * @param {string} lang - The new language to set.
     * @returns {Promise<number>} - Returns 1 if the language change is successful, 0 otherwise.
     */
    async changeLanguage(lang) {
        let db = new DatabaseConnection();
        return new Promise(async (resolve, reject) => {
            if (!languages.includes(lang)) return 0;
            await db.request("UPDATE users SET lang = ? WHERE discord_id = ?", [lang, this.userid])
            .then(res => {
                resolve(lang)
                this.lang = lang;
                debug.success(`User ${this.userid} succefully change it's lang by : ${lang}`);
            })
            .catch(err => {
                reject(err)
                debug.warn(`An error occured while changing ${this.userid}'s language in database.`);
            })
        })
    }

    /**
     * Retrieves the current language of the user from the database.
     * 
     * @returns {Promise<string>} - The current language of the user.
     */
    async getLanguage() {
        let db = new DatabaseConnection();
        let lang = "error";
        await db.request("SELECT lang FROM users WHERE discord_id = ?", [userid])
        .then(res => {
            lang = res[0].lang;
        })
        .catch(err => {
            debug.warn(`An error occured while changing ${userid}'s language in database.`);
        })
        return lang;
    }
}

/**
 * Registers a user with the default language in the database.
 * 
 * @param {string} userid - The Discord ID of the user.
 */
function addUserDefaultLang(userid) {
    let db = new DatabaseConnection();
    db.request("INSERT INTO users(discord_id, lang) VALUES (?, ?)", [userid, settings.messages.defaultLang])
    .then(res => {
        debug.success(`User ${userid} succefully registered in database with lang : ${settings.messages.defaultLang}`);
    })
    .catch(err => {
        debug.warn(`An error occured while registering user ${userid} in database. Selecting default lang ${settings.messages.defaultLang}`);
    })
}

function replaceVariables(text, objects) {
    Object.entries(objects).forEach(([key, content]) => {
        text = text.replaceAll(`%${key}%`, content);
    })

    return text;
}

module.exports = { Txt, languages, replaceVariables };