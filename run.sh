#!/bin/bash

# TravelPartner Platform - Run Script
# This script will start all three services concurrently

set -e

echo "======================================"
echo "  TravelPartner Platform Launcher"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if setup has been run
if [ ! -d "$SCRIPT_DIR/api-main/node_modules" ] || \
   [ ! -d "$SCRIPT_DIR/admin-panel-main/node_modules" ] || \
   [ ! -d "$SCRIPT_DIR/user-panel-main/node_modules" ]; then
    print_message "$RED" "❌ Dependencies not installed. Please run ./setup.sh first."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check for port conflicts
print_message "$BLUE" "🔍 Checking for port conflicts..."

if check_port 3005; then
    print_message "$YELLOW" "⚠️  Warning: Port 3005 is already in use (API Service)"
    print_message "$YELLOW" "   Please stop the process or the API service won't start"
fi

if check_port 3000; then
    print_message "$YELLOW" "⚠️  Warning: Port 3000 is already in use (Admin Panel)"
    print_message "$YELLOW" "   Please stop the process or the Admin Panel won't start"
fi

if check_port 3001; then
    print_message "$YELLOW" "⚠️  Warning: Port 3001 is already in use (User Panel)"
    print_message "$YELLOW" "   Please stop the process or the User Panel won't start"
fi

echo ""

# Create a function to cleanup background processes on exit
cleanup() {
    print_message "$YELLOW" "🛑 Stopping all services..."
    jobs -p | xargs -r kill 2>/dev/null
    wait
    print_message "$GREEN" "✅ All services stopped"
    exit 0
}

# Trap CTRL+C and other termination signals
trap cleanup SIGINT SIGTERM

print_message "$GREEN" "🚀 Starting all services..."
echo ""

# Start API Service
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$GREEN" "Starting API Service on port 3005..."
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$SCRIPT_DIR/api-main"
npm run dev > "$SCRIPT_DIR/logs-api.log" 2>&1 &
API_PID=$!
echo ""

# Wait a moment for API to start
sleep 2

# Start Admin Panel
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$GREEN" "Starting Admin Panel on port 3000..."
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$SCRIPT_DIR/admin-panel-main"
npm run dev > "$SCRIPT_DIR/logs-admin.log" 2>&1 &
ADMIN_PID=$!
echo ""

# Start User Panel on port 3001
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$GREEN" "Starting User Panel on port 3001..."
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$SCRIPT_DIR/user-panel-main"
PORT=3001 npm run dev > "$SCRIPT_DIR/logs-user.log" 2>&1 &
USER_PID=$!
echo ""

# Display status
print_message "$GREEN" "======================================"
print_message "$GREEN" "  ✅ All Services Started!"
print_message "$GREEN" "======================================"
echo ""
print_message "$BLUE" "🌐 Access the services at:"
print_message "$GREEN" "   • API Service:  http://localhost:3005"
print_message "$GREEN" "   • Admin Panel:  http://localhost:3000"
print_message "$GREEN" "   • User Panel:   http://localhost:3001"
echo ""
print_message "$BLUE" "📋 Process IDs:"
print_message "$YELLOW" "   • API Service:  $API_PID"
print_message "$YELLOW" "   • Admin Panel:  $ADMIN_PID"
print_message "$YELLOW" "   • User Panel:   $USER_PID"
echo ""
print_message "$BLUE" "📝 Logs are being written to:"
print_message "$YELLOW" "   • API:    $SCRIPT_DIR/logs-api.log"
print_message "$YELLOW" "   • Admin:  $SCRIPT_DIR/logs-admin.log"
print_message "$YELLOW" "   • User:   $SCRIPT_DIR/logs-user.log"
echo ""
print_message "$YELLOW" "💡 Tip: You can tail the logs with:"
print_message "$YELLOW" "   tail -f logs-*.log"
echo ""
print_message "$RED" "Press CTRL+C to stop all services"
echo ""

# Wait for all background jobs
wait
