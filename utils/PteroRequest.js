const axios = require('axios');

class PterodactylClient {
    constructor(serverUrl, serverId, apiKey) {
        this.serverUrl = serverUrl;
        this.serverId = serverId;
        this.apiKey = apiKey;
        this.apiVersion = 'v1';
    }

    /**
     * Effectue une requête GET vers l'API Pterodactyl.
     * @param {string} endpoint - L'endpoint API à interroger.
     * @returns {Promise<any>} - Les données de la réponse API.
     */
    async _getRequest(endpoint) {
        try {
            const response = await axios.get(`${this.serverUrl}/api/client/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Accept': `Application/vnd.pterodactyl.${this.apiVersion}+json`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la requête API Pterodactyl :', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Effectue une requête POST vers l'API Pterodactyl.
     * @param {string} endpoint - L'endpoint API à interroger.
     * @param {object} payload - Les données à envoyer dans la requête.
     * @returns {Promise<any>} - Les données de la réponse API.
     */
    async _postRequest(endpoint, payload) {
        try {
            const response = await axios.post(`${this.serverUrl}/api/client/${endpoint}`, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Accept': `Application/vnd.pterodactyl.${this.apiVersion}+json`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la requête POST API Pterodactyl :', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Récupère les informations du serveur.
     * @returns {Promise<object|null>} - Les données du serveur ou null en cas d'erreur.
     */
    async getServer() {
        try {
            const data = await this._getRequest(`servers/${this.serverId}/resources`);
            return data.attributes;
        } catch (error) {
            console.error('Erreur lors de la récupération du statut du serveur :', error.message);
            return null;
        }
    }

    /**
     * Vérifie si le serveur est en ligne.
     * @param {object} server - Les données du serveur.
     * @returns {boolean} - True si le serveur est en ligne, sinon false.
     */
    serverIsOnline(server) {
        return server?.current_state === 'running';
    }

    /**
     * Récupère le nombre de joueurs connectés au serveur.
     * @returns {Promise<number|null>} - Le nombre de joueurs connectés ou null en cas d'erreur.
     */
    async getConnectedPlayers() {
        const server = await this.getServer();

        if (server && this.serverIsOnline(server)) {
            return server.resources?.players || 0;
        } else {
            return 0; // Serveur hors ligne ou erreur.
        }
    }

    /**
     * Démarre le serveur.
     * @returns {Promise<boolean>} - True si l'action a réussi, sinon false.
     */
    async startServer() {
        try {
            await this._postRequest(`servers/${this.serverId}/power`, { signal: 'start' });
            console.log('Serveur démarré avec succès.');
            return true;
        } catch (error) {
            console.error('Erreur lors du démarrage du serveur :', error.message);
            return false;
        }
    }

    /**
     * Arrête le serveur.
     * @returns {Promise<boolean>} - True si l'action a réussi, sinon false.
     */
    async stopServer() {
        try {
            await this._postRequest(`servers/${this.serverId}/power`, { signal: 'stop' });
            console.log('Serveur arrêté avec succès.');
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'arrêt du serveur :', error.message);
            return false;
        }
    }

    /**
     * Redémarre le serveur.
     * @returns {Promise<boolean>} - True si l'action a réussi, sinon false.
     */
    async restartServer() {
        try {
            await this.stopServer();
            await this.startServer();
            console.log('Serveur redémarré avec succès.');
            return true;
        } catch (error) {
            console.error('Erreur lors du redémarrage du serveur :', error.message);
            return false;
        }
    }
}

const pterodactylClient = new PterodactylClient(
    process.env.PTERO_SERVER_URL,
    process.env.PTERO_SERVER_ID, 
    process.env.PTERO_API_KEY
)

module.exports = pterodactylClient;
