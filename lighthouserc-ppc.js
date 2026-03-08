/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/ppc"],
      startServerCommand: "npm start",
      startServerReadyPattern: "Ready",
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": [
          "error",
          { minScore: 0.9, aggregationMethod: "optimistic" },
        ],
        "largest-contentful-paint": [
          "error",
          { maxNumericValue: 2000, aggregationMethod: "optimistic" },
        ],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
