/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      startServerCommand: "npm start",
      startServerReadyPattern: "Ready",
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": [
          "warn",
          { minScore: 0.8, aggregationMethod: "optimistic" },
        ],
        "categories:accessibility": [
          "warn",
          { minScore: 0.9, aggregationMethod: "optimistic" },
        ],
        "categories:best-practices": [
          "warn",
          { minScore: 0.8, aggregationMethod: "optimistic" },
        ],
        "categories:seo": [
          "warn",
          { minScore: 0.9, aggregationMethod: "optimistic" },
        ],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
