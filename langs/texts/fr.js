const texts = {
    global: { // liste de textes aléatoires
        tooManyArgs: "Trop d'arguments ! Besoin de %REQUIRED_AMOUNT%, reçu %RECEIVED_AMOUNT%.",
        notEnoughArgs: "Pas assez d'arguments ! Besoin de %REQUIRED_AMOUNT%, reçu %RECEIVED_AMOUNT%.",
        error: "Une erreur s'est produite.",
        notEnoughPermAdmin: "Vous n'êtes pas administrateur du serveur.",
    },
    categories: { // Liste des dossiers de commandes et une description de leur contenu. Utilisé dans /help généré automatiquement
        lang: "Commandes utilitaires pour la langue du bot.",
        utils: "Commandes utilitaires aléatoires.",
        minecraft: "Commandes liés a minecraft.",
    },
    // Liste des commandes et des textes qui leur sont associés
    ping: { 
        description: "Une commande qui vous donne le ping du bot.", // max 100 caractères, limite des commandes slash 
        advancedDesc: "Une commande qui vous donne le ping du bot. (aucun argument)",
        reply: "Pong ! Ce message a une latence de %MESSAGE_PING%ms. L'API a une latence de %API_PING%ms."
    },
    changelang: {
        description: "Changer la langue des messages du bot.",
        advancedDesc: "Changer la langue des messages du bot. (/changelang lang, obtenez les langues disponibles avec /listlangs)",
        langOption: "La langue que le bot utilisera pour communiquer avec vous.",
        badLanguageProvided: "La langue que vous avez demandée n'est pas valide. Les langues possibles sont : %LANG_LIST%.",
        reply: "Votre langue a été changée avec succès en %LANG%."
    },
    listlangs: {
        description: "Obtenez toutes les langues du bot.",
        advancedDesc: "Obtenez toutes les langues du bot. (aucun argument)",
        reply: "Les langues possibles sont : %LANG_LIST%."
    },
    changeprefix: {
        description: "Changer le préfixe du bot.",
        advancedDesc: "Changer le préfixe du bot. (/setprefix newprefix, longueur max 25 caractères)",
        arg1: "Le nouveau préfixe du serveur.",
        reply: "Préfixe changé avec succès en : %PREFIX%.",
        tooLong: "Votre nouveau préfixe dépasse les 25 caractères.",
    },
    help: {
        description: "Liste toutes les commandes possibles.",
        advancedDesc: "Liste toutes les commandes possibles et vous aide sur une commande spécifique que vous passez en argument. (/help commandname)",
        title: "Voici toutes les commandes possibles. Amusez-vous bien !",
        categoryformat: "__%CATEGORY_NAME%__ : %CATEGORY_DESCRIPTION%",
        commandformat: "- **%COMMAND_NAME%** : %COMMAND_DESCRIPTION%",
        aliases: "Les alias que vous pouvez utiliser pour cette commande sont : ***%ALIASES_LIST%***.",
        invalidCommand: "Cette commande n'existe pas.",
    },
    sendwebhook: {
        description: "Envoyer un webhook (exemple uniquement ici).",
        advancedDesc: "Envoyer un webhook (exemple uniquement ici).",
        noPermission: "Pas assez de permissions.",
        success: "Webhook créé avec succès.",
        error: "Une erreur s'est produite.",
    },
    link: {
        description: "Lier son compte Minecraft au Serveur Discord",
        advancedDesc: "Set votre pseudo minecraft pour relier a votre discord.",
        arg1: "Pseudo Minecraft",
        reply: "Pseudo changé avec succès",
        tooLong: "Votre pseudo dépasse les 25 caractères.",
        tooShort: "Votre pseudo est trop court.",
        alreadyLinked: "Votre compte est déjà lié.",
        linkedWhiteList: "Votre compte %PSEUDO% a été lié avec succès, vous pouvez dès maintenant vous connecter au serveur.",
        linkedNoWhiteList: "Votre compte %PSEUDO% a été lié avec succès, vous pourrez vous connecter a l'ouverture.",
    },
    openserver: {
        description: "Ouvre le serveur",
        advancedDesc: "Plus précisément, ajoute tous les joueurs enregistrés a la whitelist.",
        serverOpened: "Le server a bien été ouvert (+%PLAYERCOUNT% Joueur ajouté a la Whitelist)"
    },
    closeserver: {
        description: "Ferme le serveur",
        advancedDesc: "Plus précisément, retire tous les joueurs enregistrés a la whitelist.",
        serverClosed: "Le server a bien été fermé (%PLAYERCOUNT% Joueur retiré a la Whitelist)"
    },
    cmd: {
        description: "Execute une commande",
        advancedDesc: "Execute une commande.",
        success: "La commande a bien été envoyée",
        error: "Une erreur s'est produite",
    }
};

module.exports = { texts };
