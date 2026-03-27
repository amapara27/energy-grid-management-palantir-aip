# Grid 360 COP Dashboard

A real-time Common Operating Picture (COP) dashboard for energy grid operators, built on [Palantir Foundry](https://www.palantir.com/platforms/foundry/) with the [OSDK](https://www.palantir.com/docs/foundry/ontology-sdk/overview/) (Ontology SDK). Operators can monitor transformer health, run AI-powered risk assessments, create maintenance work orders, and track them — all from a single interface.

## What It Does

- Connects to a Palantir Foundry environment via OAuth and loads live transformer telemetry (oil temperature, load, voltage, age)
- Displays transformer assets in a scrollable sidebar with color-coded health indicators (healthy / warning / critical)
- Runs AIP Logic risk assessments (`evaluateTransformerRisk`) against selected transformers using the full OSDK object — results are displayed in a terminal-style panel with color coding (green for healthy, amber for warning, red for critical)
- Creates maintenance work orders (`createMaintenanceHistory`) directly from analysis results, with auto-derived priority and a placeholder crew assignment
- Shows a collapsible Maintenance Log sidebar with tabs for recent (last 24h) and all orders, sorted newest-first

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 6 |
| Backend | Palantir Foundry (OSDK v2) |
| SDK | `@grid/sdk` (generated ontology), `@osdk/client`, `@osdk/oauth` |
| Testing | Vitest + fast-check (property-based) |

## Project Structure

```
cop-dashboard/
├── src/
│   ├── App.tsx          # Main dashboard — all UI components and OSDK integration
│   ├── client.ts        # OSDK client + OAuth setup
│   ├── main.tsx         # React entry point with BrowserRouter
│   └── index.css        # Tailwind imports
├── tests/
│   ├── properties/      # Property-based tests (fast-check)
│   └── unit/            # Unit tests
├── .env.local           # Foundry URL + OAuth client ID
├── .npmrc               # @grid registry config
├── vite.config.ts       # Vite + Tailwind + Vitest config
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Access to a Palantir Foundry environment with the Grid 360 ontology deployed
- A valid `.npmrc` token for the `@grid` package registry

### Setup

```bash
cd cop-dashboard
npm install
```

### Environment

The `.env.local` file needs two values:

```
VITE_FOUNDRY_URL=https://your-foundry-instance.palantirfoundry.com
VITE_FOUNDRY_CLIENT_ID=your-oauth-client-id
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Click "Connect to Palantir" to authenticate, then "Load Grid Data" to fetch transformers.

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

Runs unit tests and property-based tests (7 correctness properties covering data loading consistency, query faithfulness, priority derivation, button visibility, selection state, loading state resets, and dual-button disable logic).

## OSDK Integration

The dashboard uses two OSDK capabilities:

**Query — `evaluateTransformerRisk`**
Accepts a full `Transformer` OSDK object and returns an LLM-generated risk assessment string. Called via `client(evaluateTransformerRisk).executeFunction()`.

**Action — `createMaintenanceHistory`**
Creates a maintenance work order with six required fields (`transformerId`, `createdTimestamp`, `erpReferenceId`, `priority`, `status`, `assignedCrew`). Called via `client(createMaintenanceHistory).applyAction()`.

Both are imported from `@grid/sdk` and documented in a schema reference comment block at the top of `App.tsx`.

## License

See [LICENSE](./LICENSE).
