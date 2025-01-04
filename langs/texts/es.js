const texts = {
    global: { // lista de textos aleatorios
        tooManyArgs: "¡Demasiados argumentos! Se necesitan %REQUIRED_AMOUNT%, se recibieron %RECEIVED_AMOUNT%.",
        notEnoughArgs: "¡No hay suficientes argumentos! Se necesitan %REQUIRED_AMOUNT%, se recibieron %RECEIVED_AMOUNT%.",
        error: "Ocurrió un error.",
        notEnoughPermAdmin: "No eres administrador del servidor.",
    },
    categories: { // Lista de las carpetas de comandos y una descripción de su contenido. Se utiliza en /help generado automáticamente
        lang: "Comandos de utilidad para el idioma del bot.",
        utils: "Comandos de utilidad aleatorios.",
    },
    // Lista de los comandos y los textos asociados a ellos
    ping: { 
        description: "Un comando que te da el ping del bot.", // max 100 caracteres, límite de comandos slash 
        advancedDesc: "Un comando que te da el ping del bot. (sin argumentos)",
        reply: "¡Pong! Este mensaje tiene una latencia de %MESSAGE_PING%ms. La API tiene una latencia de %API_PING%ms."
    },
    changelang: {
        description: "Cambia el idioma de los mensajes del bot.",
        advancedDesc: "Cambia el idioma de los mensajes del bot. (/changelang lang, obtén los idiomas disponibles con /listlangs)",
        langOption: "El idioma que el bot utilizará para comunicarse contigo.",
        badLanguageProvided: "El idioma que solicitaste no es válido. Los idiomas posibles son: %LANG_LIST%.",
        reply: "Tu idioma se ha cambiado exitosamente a %LANG%."
    },
    listlangs: {
        description: "Obtén todos los idiomas del bot.",
        advancedDesc: "Obtén todos los idiomas del bot. (sin argumentos)",
        reply: "Los idiomas posibles son: %LANG_LIST%."
    },
    changeprefix: {
        description: "Cambia el prefijo del bot.",
        advancedDesc: "Cambia el prefijo del bot. (/setprefix newprefix, longitud máxima de 25 caracteres)",
        arg1: "El nuevo prefijo del servidor.",
        reply: "Prefijo cambiado exitosamente a: %PREFIX%.",
        tooLong: "Tu nuevo prefijo tiene más de 25 caracteres.",
    },
    help: {
        description: "Lista todos los comandos posibles.",
        advancedDesc: "Lista todos los comandos posibles y te ayuda con un comando específico que pases como argumento. (/help commandname)",
        title: "Aquí están todos los comandos posibles. ¡Diviértete!",
        categoryformat: "__%CATEGORY_NAME%__: %CATEGORY_DESCRIPTION%",
        commandformat: "- **%COMMAND_NAME%**: %COMMAND_DESCRIPTION%",
        aliases: "Los alias que puedes usar para este comando son: ***%ALIASES_LIST%***.",
        invalidCommand: "Este comando no existe.",
    },
    sendwebhook: {
        description: "Envía un webhook (solo un ejemplo aquí).",
        advancedDesc: "Envía un webhook (solo un ejemplo aquí).",
        noPermission: "No tienes suficientes permisos.",
        success: "Webhook creado exitosamente.",
        error: "Ocurrió un error.",
    },
};

module.exports = { texts };
