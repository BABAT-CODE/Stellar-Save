# Stellar Save — Mobile E2E Tests (Maestro)

Automated end-to-end test suite for the Stellar Save mobile app using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

## Running Tests

```bash
# Run all non-quarantined flows
npm test

# Run the lightweight smoke suite (fastest CI feedback)
npm run test:smoke

# Run individual flows
npm run test:onboarding
npm run test:wallet
npm run test:create-group
npm run test:join-group
npm run test:contribute
```

## Test Flows

| Flow | File | Covers |
|------|------|--------|
| Onboarding | `onboarding.yaml` | App launch, welcome screen, wallet connect prompt |
| Wallet Creation | `wallet_creation.yaml` | Create wallet, backup seed phrase, confirm |
| Create Group | `create_group.yaml` | Fill form, set amount/cycle/members, confirm tx |
| Join Group | `join_group.yaml` | Browse groups, join, confirm membership |
| Contribute | `contribute.yaml` | Navigate to group, submit contribution, success |
| Smoke Suite | `smoke.yaml` | Critical-path abbreviated run of all flows |

## Quarantine Mechanism

Flaky tests can be quarantined to prevent CI failures while they are being fixed.

**Quarantine a test:**
```bash
echo ".maestro/flaky_flow.yaml  # see issue #123" \
  >> mobile/quarantine/quarantined_tests.txt
```

**View quarantine report:**
```bash
npm run test:quarantine-report
```

See [`quarantine/README.md`](quarantine/README.md) for the full policy.

## CI Integration

The GitHub Actions workflow (`.github/workflows/mobile-e2e.yml`) runs:
- iOS simulator on `macos-14` (Apple Silicon)
- Android emulator on `ubuntu-latest`

A broken core flow fails the suite deterministically. Quarantined tests are
skipped and reported as a warning.

## Directory Structure

```
mobile/
├── .maestro/
│   ├── config.yaml          # Global Maestro config
│   ├── smoke.yaml           # Critical-path smoke suite
│   ├── onboarding.yaml
│   ├── wallet_creation.yaml
│   ├── create_group.yaml
│   ├── join_group.yaml
│   └── contribute.yaml
├── quarantine/
│   ├── README.md            # Quarantine policy
│   └── quarantined_tests.txt
├── scripts/
│   ├── run-tests.sh         # Quarantine-aware test runner
│   └── quarantine-report.sh
└── package.json
```
