const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const ES_NODE = process.env.ES_NODE; 
const esClient = new Client({
    node: ES_NODE,
    auth: {
      username: process.env.ES_USERNAME,
      password: process.env.ES_PASSWORD
    }
});

// Ping Elasticsearch to check connectivity
const checkElasticSearchConnection = async () => {
    try {
        await esClient.ping(); // This will resolve on success, throw on failure
        console.log('✅ Connected to Elasticsearch');
    } catch (error) {
        console.error('❌ Elasticsearch connection failed:', error.message);
        process.exit(1); 
    }
};

// Run the connection check when the module is loaded
checkElasticSearchConnection();

module.exports = esClient;
