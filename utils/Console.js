require('colors');
const { settings }  = require('../settings');
const fs = require('fs');

/**
 * Logs an informational message to the console and writes it to a log file if enabled.
 * 
 * @param {string[]} message - One or more messages to display and log to the file.
 */
const info = (...message) => {
	const time = new Date().toLocaleTimeString();

	console.info(`[${time}]`.gray, '[Info]'.blue, message.join(' '));

	if (settings.development.logFile) {
		let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
		fileContent += [`[${time}]`.gray, '[Info]'.blue, message.join(' ')].join(' ') + '\n';
		fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
	}
}

/**
 * Logs a success message to the console and writes it to a log file if enabled.
 * 
 * @param {string[]} message - One or more messages to display and log to the file.
 */
const success = (...message) => {
	const time = new Date().toLocaleTimeString();

	console.info(`[${time}]`.gray, '[OK]'.green, message.join(' '));

	if (settings.development.logFile) {
		let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
		fileContent += [`[${time}]`.gray, '[OK]'.green, message.join(' ')].join(' ') + '\n';
		fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
	}
}

/**
 * Logs an error message to the console and writes it to a log file if enabled.
 * 
 * @param {string[]} message - One or more messages to display and log to the file.
 */
const error = (...message) => {
	const time = new Date().toLocaleTimeString();

	console.error(`[${time}]`.gray, '[Error]'.red, message.join(' '));

	if (settings.development.logFile) {
		let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
		fileContent += [`[${time}]`.gray, '[Error]'.red, message.join(' ')].join(' ') + '\n';
		fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
	}
}

/**
 * Logs a warning message to the console and writes it to a log file if enabled.
 * 
 * @param {string[]} message - One or more messages to display and log to the file.
 */
const warn = (...message) => {
    const time = new Date().toLocaleTimeString();

	console.warn(`[${time}]`.gray, '[Warning]'.yellow, message.join(' '));

	if (settings.development.logFile) {
		let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
		fileContent += [`[${time}]`.gray, '[Warning]'.yellow, message.join(' ')].join(' ') + '\n';
		fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
	}
}

const debug = {
    /**
     * Logs an informational message to the console and writes it to a log file if enabled.
     * Displays the message in the console only if debug mode is enabled.
     * 
     * @param {string[]} message - One or more messages to display and log to the file.
     */
    info: (...message) => {
        const time = new Date().toLocaleTimeString();
        const formattedMessage = [`[${time}]`.gray, '[Debug - Info]'.blue, message.join(' ')].join(' ');

        if (settings.development.debug) {
            console.info(formattedMessage);

			if (settings.development.logFile) {
				let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
				fileContent += formattedMessage + '\n';
				fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
			}
        }
    },

    /**
     * Logs a success message to the console and writes it to a log file if enabled.
     * Displays the message in the console only if debug mode is enabled.
     * 
     * @param {string[]} message - One or more messages to display and log to the file.
     */
    success: (...message) => {
        const time = new Date().toLocaleTimeString();
        const formattedMessage = [`[${time}]`.gray, '[Debug - OK]'.green, message.join(' ')].join(' ');

        if (settings.development.debug) {
            console.info(formattedMessage);

			if (settings.development.logFile) {
				let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
				fileContent += formattedMessage + '\n';
				fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
			}
        }
    },

    /**
     * Logs an error message to the console and writes it to a log file if enabled.
     * Displays the message in the console only if debug mode is enabled.
     * 
     * @param {string[]} message - One or more messages to display and log to the file.
     */
    error: (...message) => {
        const time = new Date().toLocaleTimeString();
        const formattedMessage = [`[${time}]`.gray, '[Debug - Error]'.red, message.join(' ')].join(' ');

        if (settings.development.debug) {
            console.error(formattedMessage);

			if (settings.development.logFile) {
				let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
				fileContent += formattedMessage + '\n';
				fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
			}
        }
    },

    /**
     * Logs a warning message to the console and writes it to a log file if enabled.
     * Displays the message in the console only if debug mode is enabled.
     * 
     * @param {string[]} message - One or more messages to display and log to the file.
     */
    warn: (...message) => {
        const time = new Date().toLocaleTimeString();
        const formattedMessage = [`[${time}]`.gray, '[Debug - Warning]'.yellow, message.join(' ')].join(' ');

        if (settings.development.debug) {
            console.warn(formattedMessage);

			if (settings.development.logFile) {
				let fileContent = fs.readFileSync('./terminal.log', 'utf-8');
				fileContent += formattedMessage + '\n';
				fs.writeFileSync('./terminal.log', fileContent, 'utf-8');
			}
        }
    }
}


module.exports = { info, success, error, warn, debug }