require('dotenv').config();
const crypto = require('crypto');
const dataSchema = require('./dataSchema');
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'utf-8');
const IV = Buffer.from(process.env.IV, 'utf-8');

//Utility Functions

//Authorization
function verifyAuthorization(req) {

    const encryptedTimestamp = req.header("X-Encrypted-Timestamp");
    if (!encryptedTimestamp) return { success: false, message: "Missing timestamp header" };
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, IV);
        let decrypted = decipher.update(encryptedTimestamp, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        let receivedChecksum=decrypted.substring(0,decrypted.indexOf(' '));
        decrypted=decrypted.substring(decrypted.indexOf(' ')+1);

        const receivedTimestamp = parseInt(decrypted, 10);
        const currentTimestamp = Date.now();
        if (Math.abs(currentTimestamp - receivedTimestamp) <= 600000) {
        console.log("✅ Authentication granted: Source is valid");
        const rawBody = req.body.toString('utf8');
        const computedChecksum = sha256(rawBody);
        if (computedChecksum !== receivedChecksum) {
            console.error(`❌ Checksum mismatch`);
            return { success: false, message: "Checksum mismatch" };
        }
        console.log("✅ Data integrity verified");
        return { success: true };
        } else {
        return { success: false, message: "Timestamp outside allowed window" };
        }
    } catch (e) {
        console.error("Decryption failed:", e.message);
        return {success: false, message:"Decryption Failed"};
    }
}

//Calculate Hash
function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

//Validation
function validateData(data) {
    const { error } = dataSchema.validate(data, { abortEarly: false });
    return error ? { valid: false, errors: error.details.map(e => e.message) } : { valid: true };
}

//Flattening the data
function extractRequiredData({ build_data, node_stage_data, stage_data }) {
    const causeAction = build_data.actions.find(a => a._class === 'hudson.model.CauseAction');
    const queueAction = build_data.actions.find(a => a._class === 'jenkins.metrics.impl.TimeInQueueAction');

    const baseBuildMetadata = {
        causes: causeAction?.causes || [],
        timeInQueueMetrics: {
        blockedDurationMillis: queueAction?.blockedDurationMillis || 0,
        blockedTimeMillis: queueAction?.blockedTimeMillis || 0,
        buildableDurationMillis: queueAction?.buildableDurationMillis || 0,
        buildableTimeMillis: queueAction?.buildableTimeMillis || 0,
        buildingDurationMillis: queueAction?.buildingDurationMillis || 0,
        executingTimeMillis: queueAction?.executingTimeMillis || 0,
        executorUtilization: queueAction?.executorUtilization || 0,
        subTaskCount: queueAction?.subTaskCount || 0,
        waitingDurationMillis: queueAction?.waitingDurationMillis || 0,
        waitingTimeMillis: queueAction?.waitingTimeMillis || 0,
        },
        artifacts: build_data.artifacts || [],
        building: build_data.building,
        description: build_data.description,
        displayName: build_data.displayName,
        duration: stage_data[0].durationMillis,
        estimatedDuration: build_data.estimatedDuration,
        executor: build_data.executor || {},
        fullDisplayName: build_data.fullDisplayName,
        id: build_data.id,
        keepLog: build_data.keepLog,
        number: build_data.number,
        queueId: build_data.queueId,
        result: build_data.result,
        timestamp: build_data.timestamp,
        url: build_data.url,
        changeSets: build_data.changeSets || [],
        culprits: build_data.culprits || [],
        inProgress: build_data.inProgress,
        nextBuild: build_data.nextBuild,
        previousBuild: build_data.previousBuild,
    };

    // Flatten step-level documents
    const stepLevelDocs = [];

    node_stage_data.forEach(({ nodeId, data }) => {
        const stageInfo = {
        stageId: data.id,
        stageName: data.name,
        execNode: data.execNode,
        status: data.status,
        ...(data.error && { error: data.error }),
        startTimeMillis: data.startTimeMillis,
        durationMillis: data.durationMillis,
        pauseDurationMillis: data.pauseDurationMillis,
        };

        (data.stageFlowNodes || []).forEach((stepNode) => {
        const stepDoc = {
            ...baseBuildMetadata,
            stage: stageInfo,
            step: {
            id: stepNode.id,
            name: stepNode.name,
            execNode: stepNode.execNode,
            status: stepNode.status,
            ...(stepNode.error && { error: stepNode.error }),
            parameterDescription: stepNode.parameterDescription,
            startTimeMillis: stepNode.startTimeMillis,
            durationMillis: stepNode.durationMillis,
            pauseDurationMillis: stepNode.pauseDurationMillis,
            parentNodes: stepNode.parentNodes
            }
        };
        stepLevelDocs.push(stepDoc);
        });
    });

    return stepLevelDocs;
}

//Extract useful Test Data
function extractTestReportFields({test_data, build_data}) {
    // Basic counts
    const failCount = test_data.failCount || 0;
    const passCount = test_data.passCount || 0;
    const skipCount = test_data.skipCount || 0;
    const fullDisplayName= build_data.fullDisplayName;

    // All suites (defensive: empty array if missing)
    const suites = Array.isArray(test_data.suites) ? test_data.suites : [];

    // Calculate total test cases
    let totalTestCases = 0;
    const failedTestCases = [];

    for (const suite of suites) {
        const cases = Array.isArray(suite.cases) ? suite.cases : [];
        totalTestCases += cases.length;

        for (const testCase of cases) {
            if (
                typeof testCase.status === "string" &&
                testCase.status.toUpperCase() === "FAILED" ||
                testCase.status?.toUpperCase() === "REGRESSION"
            ) {
                failedTestCases.push({
                    suiteName: suite.name || null,
                    testName: testCase.name || null,
                    errorDetails: testCase.errorDetails || null,
                    errorStackTrace: testCase.errorStackTrace || null,
                    status: testCase.status
                });
            }
        }
    }

    return {
        fullDisplayName,
        failCount,
        passCount,
        skipCount,
        totalTestCases,
        failedTestCases
    };
}


module.exports = {
  verifyAuthorization,
  extractRequiredData,
  validateData,
  sha256,
  extractTestReportFields
};