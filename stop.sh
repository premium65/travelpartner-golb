#!/bin/bash

# TravelPartner Platform - Stop Script
# This script will stop all running services

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

echo ""
print_message "$BLUE" "======================================"
print_message "$BLUE" "  TravelPartner - Stop All Services"
print_message "$BLUE" "======================================"
echo ""

# Function to kill process on a specific port
kill_port() {
    port=$1
    service_name=$2
    
    PID=$(lsof -t -i:$port 2>/dev/null)
    if [ -n "$PID" ]; then
        print_message "$YELLOW" "🛑 Stopping $service_name (PID: $PID) on port $port..."
        kill -9 $PID
        print_message "$GREEN" "   ✅ Stopped"
    else
        print_message "$BLUE" "   ℹ️  No process running on port $port"
    fi
}

# Stop all services
kill_port 3005 "API Service"
kill_port 3000 "Admin Panel"
kill_port 3001 "User Panel"

echo ""
print_message "$GREEN" "======================================"
print_message "$GREEN" "  ✅ All Services Stopped"
print_message "$GREEN" "======================================"
echo ""
