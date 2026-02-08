#!/bin/bash

# TravelPartner Platform - Individual Service Runner
# This script allows you to run services individually

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

# Show menu
echo ""
print_message "$BLUE" "======================================"
print_message "$BLUE" "  TravelPartner - Service Selector"
print_message "$BLUE" "======================================"
echo ""
print_message "$GREEN" "Which service would you like to run?"
echo ""
print_message "$YELLOW" "  1) API Service (Backend) - Port 3005"
print_message "$YELLOW" "  2) Admin Panel (Frontend) - Port 3000"
print_message "$YELLOW" "  3) User Panel (Frontend) - Port 3001"
print_message "$YELLOW" "  4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_message "$GREEN" "🚀 Starting API Service..."
        cd "$SCRIPT_DIR/api-main"
        if [ ! -f ".env" ]; then
            print_message "$RED" "❌ .env file not found. Please run ./setup.sh first."
            exit 1
        fi
        npm run dev
        ;;
    2)
        print_message "$GREEN" "🚀 Starting Admin Panel..."
        cd "$SCRIPT_DIR/admin-panel-main"
        if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
            print_message "$RED" "❌ Environment file not found. Please run ./setup.sh first."
            exit 1
        fi
        npm run dev
        ;;
    3)
        print_message "$GREEN" "🚀 Starting User Panel..."
        cd "$SCRIPT_DIR/user-panel-main"
        if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
            print_message "$RED" "❌ Environment file not found. Please run ./setup.sh first."
            exit 1
        fi
        PORT=3001 npm run dev
        ;;
    4)
        print_message "$BLUE" "👋 Goodbye!"
        exit 0
        ;;
    *)
        print_message "$RED" "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
