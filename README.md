# Playwright + TypeScript + BDD softcar project

This repository now includes a Playwright test runner, TypeScript source, and Gherkin-based BDD coverage for the existing softcar C3 API flow.

The original shell flow in `softcar_c3_flow.sh` is kept as a legacy reference. The new automated test suite lives under `features/` and `src/`.

## What is included

- Playwright test runner via `@playwright/test`
- TypeScript project setup
- BDD layer via `playwright-bdd`
- API-focused scenario for the softcar C3 flow
- Environment-variable driven test data and endpoint configuration
- HTML reporting and Playwright trace capture on retry

## Project structure

```text
.
├── .env.example
├── features/
│   └── api/
│       └── softcar_c3_flow.feature
├── playwright.config.ts
├── softcar_c3_flow.sh
├── src/
│   ├── bdd/
│   │   └── fixtures.ts
│   ├── fixtures/
│   │   └── softcarData.ts
│   ├── steps/
│   │   └── api/
│   │       └── softcar_c3_flow.steps.ts
│   └── support/
│       ├── api/
│       │   └── c3SoftcarClient.ts
│       └── c3env.ts
└── tsconfig.json
```

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env` if you want to override defaults.
3. Run the BDD tests.

If you later add browser-based scenarios, install Playwright browsers as an extra setup step.

```bash
cd /home/ab000419/scripts
npm install
cp .env.eu-west-1.qa .env
npm test
```

Optional browser setup for future UI scenarios:

```bash
cd /home/ab000419/scripts
npm run install:browsers
```

## Available scripts

```bash
npm run bddgen
npm run typecheck
npm test
npm run test:smoke
npm run test:headed
npm run test:debug
npm run test:ui
npm run install:browsers
```

## Environment variables

The suite reads these values from `.env` or the shell environment:

- `BASE_URL`
- `SOFTCAR_VIN`
- `SOFTCAR_SERVICE_TYPE`
- `ROUTING_CALL_CENTER_ID`
- `SOFTCAR_POSITION_1`
- `SOFTCAR_POSITION_2`
- `SOFTCAR_DESTINATION`
- `SOFTCAR_TERMINATE_REASON`
- `API_TIMEOUT_MS`

## Notes

- The current BDD scenario uses Playwright's API request capabilities, so it does not require UI interactions or browser installation.
- Generated Playwright-BDD files are written to `.features-gen/` and are ignored by Git.
- If the target QA environment requires connectivity or auth not available locally, the suite will still typecheck and generate correctly, but the live API scenario may fail until network access is available.


