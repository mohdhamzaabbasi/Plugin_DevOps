require('dotenv').config();
const express = require('express');
const esClient = require('./elasticClient'); //Importing the extracted ElasticSearch client
const app = express();
const PORT = process.env.PORT;
const{verifyAuthorization, verifyChecksum, extractRequiredData, validateData, extractTestReportFields}=require('./utils');

app.post('/', express.raw({ type: 'application/json', limit: '10mb' }), async (req, res) => {
    try {
        //Authorization
        const authResult = verifyAuthorization(req);
        if (!authResult.success) return res.status(401).send(authResult.message);

        //Formatting the data in desired form
        const parsedBody = JSON.parse(req.body.toString('utf8'));
        coverageReport=parsedBody.sonar_data.component.measures[0];
        coverageReport.fullDisplayName=parsedBody.build_data.fullDisplayName;
        
        // Flattening Data
        const stepDocuments = extractRequiredData(parsedBody);
        const requiredTestData = extractTestReportFields(parsedBody);
        
        //Data sent to Elastic Search
        for (const doc of stepDocuments) {

            if(doc.stage.stageName==="Declarative: Post Actions" || doc.stage.stageName==="Declarative: Tool Install")
            {
                continue;
            }

            //Data Validation
            const validationResult = validateData(doc);
            if (!validationResult.valid) {
                console.error('Validation failed:', validationResult.errors);
                return res.status(400).json({ error: validationResult.errors });
            }

            //Meta-data sent to elasticsearch
            try {
                await esClient.index({
                index: 'jenkins-data',
                document: doc,
                });
            } catch (error) {
                console.error(`❌ Elasticsearch Error (step: ${doc.step.name}):`, error);
            }
        }

        //SonarQube coverage sent to elasticsearch
        try {
            await esClient.index({
            index: 'jenkins-data',
            document: parsedBody.sonar_data.component.measures[0],
            });
        } catch (error) {
            console.error(`❌ Elasticsearch Error (step: ${doc.step.name}):`, error);
        }

        //Test Report sent to elasticsearch
        try {
            await esClient.index({
            index: 'jenkins-data',
            document: requiredTestData,
            });
        } catch (error) {
            console.error(`❌ Elasticsearch Error (step: ${doc.step.name}):`, error);
        }


        console.log(`✅ Data sent to Elasticsearch for build ${parsedBody.build_data.fullDisplayName}`);
        res.status(200).send('Webhook Received!');
    } 
    catch (err) {
        console.error("❌ Webhook Processing Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
console.log(`🚀 Webhook server running on http://localhost:${PORT}/web`);
});
module.exports = app;



app.post('/plugin', express.raw({ type: 'application/json', limit: '10mb' }), async (req, res) => {

    //Authorization & Integrity Check!!
    const authResult = verifyAuthorization(req);
    if (!authResult.success) return res.status(401).send(authResult.message);

    const parsedBody = JSON.parse(req.body.toString('utf8'));
    res.status(200).send('Webhook Received!');
});
