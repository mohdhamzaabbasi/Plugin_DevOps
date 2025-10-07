const realPayload = {
  build_data: {
    _class: 'org.jenkinsci.plugins.workflow.job.WorkflowRun',
    actions: [
      {
        _class: 'hudson.model.CauseAction',
        causes: [
          {
            _class: 'hudson.model.Cause$UserIdCause',
            shortDescription: 'Started by user Mohd Hamza Abbasi',
            userId: 'mohdhamzaabbasi',
            userName: 'Mohd Hamza Abbasi'
          }
        ]
      },
      {
        _class: 'jenkins.metrics.impl.TimeInQueueAction',
        blockedDurationMillis: 0,
        blockedTimeMillis: 0,
        buildableDurationMillis: 0,
        buildableTimeMillis: 0,
        buildingDurationMillis: 0,
        executingTimeMillis: 0,
        executorUtilization: 1,
        subTaskCount: 0,
        waitingDurationMillis: 82,
        waitingTimeMillis: 82
      },
      { _class: 'org.jenkinsci.plugins.workflow.libs.LibrariesAction' },
      {},
      {
        _class: 'hudson.plugins.git.util.BuildData',
        buildsByBranchName: {
          'refs/remotes/origin/main': {
            _class: 'hudson.plugins.git.util.Build',
            buildNumber: 93,
            buildResult: null,
            marked: {
              SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
              branch: [
                {
                  SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
                  name: 'refs/remotes/origin/main'
                }
              ]
            },
            revision: {
              SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
              branch: [
                {
                  SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
                  name: 'refs/remotes/origin/main'
                }
              ]
            }
          }
        },
        lastBuiltRevision: {
          SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
          branch: [
            {
              SHA1: 'bc1411968a75462fb037bd716c429769e48b710d',
              name: 'refs/remotes/origin/main'
            }
          ]
        },
        remoteUrls: ['https://github.com/sanvi-verma/rich-ci-cd-node-api.git'],
        scmName: ''
      },
      {},
      {},
      { _class: 'org.jenkinsci.plugins.workflow.cps.EnvActionImpl' },
      {
        _class: 'org.jenkinsci.plugins.workflow.cps.view.InterpolatedSecretsAction'
      },
      {},
      {},
      {},
      {
        _class: 'org.jenkinsci.plugins.displayurlapi.actions.RunDisplayAction'
      },
      {
        _class: 'org.jenkinsci.plugins.pipeline.modeldefinition.actions.RestartDeclarativePipelineAction'
      },
      {},
      {},
      {},
      {
        _class: 'org.jenkinsci.plugins.workflow.job.views.FlowGraphAction'
      },
      {},
      {}
    ],
    artifacts: [],
    building: true,
    description: "desc",
    displayName: '#93',
    duration: 0,
    estimatedDuration: 48239,
    executor: { _class: 'hudson.model.OneOffExecutor' },
    fullDisplayName: 'Dummy #93',
    id: '93',
    keepLog: false,
    number: 93,
    queueId: 186,
    result: 'SUCCESS',
    timestamp: 1747820600186,
    url: 'http://localhost:8080/job/Dummy/93/',
    changeSets: [],
    culprits: [],
    inProgress: true,
    nextBuild: null,
    previousBuild: { number: 92, url: 'http://localhost:8080/job/Dummy/92/' }
  },
  node_stage_data: [
    {
      nodeId: '6',
      data: {
        _links: { self: { href: '/job/Dummy/93/execution/node/6/wfapi/describe' } },
        id: '6',
        name: 'Checkout',
        execNode: '',
        status: 'SUCCESS',
        startTimeMillis: 1747820607525,
        durationMillis: 4529,
        pauseDurationMillis: 0,
        stageFlowNodes: [
          {
            _links: {
              self: { href: '/job/Dummy/93/execution/node/7/wfapi/describe' },
              log: { href: '/job/Dummy/93/execution/node/7/wfapi/log' },
              console: { href: '/job/Dummy/93/execution/node/7/log' }
            },
            id: '7',
            name: 'Git',
            execNode: '',
            status: 'SUCCESS',
            startTimeMillis: 1747820607654,
            durationMillis: 4267,
            pauseDurationMillis: 0,
            parentNodes: ['6']
          }
        ]
      }
    }
  ],
  stage_data: [
    { durationMillis: 4529 }
  ],
  sonar_data: {
    component: {
      measures: [
        { metric: 'coverage', value: '85.0' }
      ]
    }
  },
  test_data: {
    failCount: 0,
    passCount: 10,
    skipCount: 0,
    suites: []
  }
};

const validData = {
  causes: [{ type: "Manual" }],
  timeInQueueMetrics: {
    blockedDurationMillis: 0,
    blockedTimeMillis: 0,
    buildableDurationMillis: 0,
    buildableTimeMillis: 0,
    buildingDurationMillis: 0,
    executingTimeMillis: 0,
    executorUtilization: 1.0,
    subTaskCount: 1,
    waitingDurationMillis: 0,
    waitingTimeMillis: 0
  },
  artifacts: [],
  building: false,
  description: "This is a test build",
  displayName: "Build #1",
  duration: 12345,
  estimatedDuration: 20000,
  executor: {},
  fullDisplayName: "Job #1",
  id: "1",
  keepLog: false,
  number: 1,
  queueId: 101,
  result: "SUCCESS",
  timestamp: Date.now(),
  url: "http://localhost/job/test/1/",
  changeSets: [],
  culprits: [],
  inProgress: false,
  nextBuild: null,
  previousBuild: null,
  stage: {
    stageId: "stage-1",
    stageName: "Build Stage",
    execNode: "node1",
    status: "SUCCESS",
    startTimeMillis: 100,
    durationMillis: 1000,
    pauseDurationMillis: 0
  },
  step: {
    id: "step-1",
    name: "Clone Repo",
    execNode: "node1",
    status: "SUCCESS",
    startTimeMillis: 110,
    durationMillis: 500,
    pauseDurationMillis: 0,
    parentNodes: []
  }
};

const extractedData = {
  build_data: {
    actions: [],
    artifacts: [],
    building: true,
    description: "desc",
    displayName: "Build #1",
    duration: 123,
    estimatedDuration: 456,
    executor: {},
    fullDisplayName: "Proj #1",
    id: "1",
    keepLog: false,
    number: 1,
    queueId: 1,
    result: "SUCCESS",
    timestamp: Date.now(),
    url: "http://localhost/",
    changeSets: [],
    culprits: [],
    inProgress: false,
    nextBuild: null,
    previousBuild: null
  },
  node_stage_data: [
    {
      nodeId: "1",
      data: {
        id: "stage-1",
        name: "Stage 1",
        execNode: "node1",
        status: "SUCCESS",
        startTimeMillis: 1,
        durationMillis: 2,
        pauseDurationMillis: 0,
        stageFlowNodes: [
          {
            id: "step-1",
            name: "Step 1",
            execNode: "node1",
            status: "SUCCESS",
            startTimeMillis: 2,
            durationMillis: 1,
            pauseDurationMillis: 0,
            parentNodes: []
          }
        ]
      }
    }
  ],
  stage_data: [
    { durationMillis: 2 }
  ]
};
const test_data = {
        failCount: 1,
        passCount: 2,
        skipCount: 0,
        suites: [
          {
            name: 'Suite A',
            cases: [
              { name: 'Test 1', status: 'PASSED' },
              { name: 'Test 2', status: 'FAILED', errorDetails: 'Error A', errorStackTrace: 'Stack A' }
            ]
          }
        ]
      };

module.exports = {
  validData,
  realPayload,
  extractedData,
  test_data
};
