#!/bin/bash
# E2E Test Runner Script
# Simple script to run E2E tests with proper environment setup

set -e

# Default values
ENV=${TEST_ENV:-local}
HEADLESS=${HEADLESS:-true}
SLOW_MO=${SLOW_MO:-0}

echo "🧸 My Teddy Magic - E2E Test Runner 🧸"
echo "======================================"
echo "Environment: $ENV"
echo "Headless: $HEADLESS"
echo "Slow Mo: ${SLOW_MO}ms"
echo ""

# Set environment variables
export TEST_ENV=$ENV
export HEADLESS=$HEADLESS
export SLOW_MO=$SLOW_MO

# Run tests using tsx
npx tsx tests/e2e/runner.ts

