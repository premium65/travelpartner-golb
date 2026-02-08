#!/bin/bash

# TravelPartner Platform - Automated Setup Script
# This script will set up all three services with their dependencies

set -e  # Exit on any error

echo "======================================"
echo "  TravelPartner Platform Setup"
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

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_message "$BLUE" "🔍 Checking prerequisites..."

if ! command_exists node; then
    print_message "$RED" "❌ Node.js is not installed. Please install Node.js v18.12.1 or higher."
    exit 1
fi

if ! command_exists npm; then
    print_message "$RED" "❌ npm is not installed. Please install npm v8.19.2 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_message "$YELLOW" "⚠️  Warning: Node.js version is lower than 18. Some features may not work correctly."
fi

print_message "$GREEN" "✅ Prerequisites check passed"
print_message "$GREEN" "   Node.js: $(node -v)"
print_message "$GREEN" "   npm: $(npm -v)"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to setup environment files
setup_env_files() {
    service_name=$1
    service_dir=$2
    
    print_message "$BLUE" "📝 Setting up environment files for $service_name..."
    
    cd "$SCRIPT_DIR/$service_dir"
    
    if [ "$service_name" == "API Service" ]; then
        if [ ! -f ".env" ]; then
            if [ -f ".env.example" ]; then
                cp .env.example .env
                print_message "$GREEN" "   ✅ Created .env from .env.example"
            else
                print_message "$YELLOW" "   ⚠️  No .env.example found"
            fi
        else
            print_message "$YELLOW" "   ℹ️  .env already exists, skipping..."
        fi
    else
        if [ ! -f ".env.local" ]; then
            if [ -f ".env.example" ]; then
                cp .env.example .env.local
                print_message "$GREEN" "   ✅ Created .env.local from .env.example"
            else
                print_message "$YELLOW" "   ⚠️  No .env.example found"
            fi
        else
            print_message "$YELLOW" "   ℹ️  .env.local already exists, skipping..."
        fi
    fi
}

# Function to install dependencies
install_dependencies() {
    service_name=$1
    service_dir=$2
    
    print_message "$BLUE" "📦 Installing dependencies for $service_name..."
    
    cd "$SCRIPT_DIR/$service_dir"
    
    if [ ! -d "node_modules" ]; then
        # Skip Puppeteer Chromium download to avoid network issues
        export PUPPETEER_SKIP_DOWNLOAD=true
        npm install
        print_message "$GREEN" "   ✅ Dependencies installed"
    else
        print_message "$YELLOW" "   ℹ️  node_modules already exists. Run 'npm install' manually if you want to reinstall."
    fi
    
    echo ""
}

# Setup API Service
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$BLUE" "Setting up API Service (Backend)"
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
setup_env_files "API Service" "api-main"
install_dependencies "API Service" "api-main"

# Setup Admin Panel
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$BLUE" "Setting up Admin Panel (Frontend)"
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
setup_env_files "Admin Panel" "admin-panel-main"
install_dependencies "Admin Panel" "admin-panel-main"

# Setup User Panel
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message "$BLUE" "Setting up User Panel (Frontend)"
print_message "$BLUE" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
setup_env_files "User Panel" "user-panel-main"
install_dependencies "User Panel" "user-panel-main"

# Final message
cd "$SCRIPT_DIR"
echo ""
print_message "$GREEN" "======================================"
print_message "$GREEN" "  ✅ Setup Complete!"
print_message "$GREEN" "======================================"
echo ""
print_message "$BLUE" "📋 Next Steps:"
print_message "$YELLOW" "   1. Review and update environment variables in:"
print_message "$YELLOW" "      - api-main/.env"
print_message "$YELLOW" "      - admin-panel-main/.env.local"
print_message "$YELLOW" "      - user-panel-main/.env.local"
echo ""
print_message "$YELLOW" "   2. Make sure MongoDB is running on your system"
echo ""
print_message "$YELLOW" "   3. Run all services with: ./run.sh"
print_message "$YELLOW" "      Or run them individually:"
print_message "$YELLOW" "      - API:    cd api-main && npm run dev"
print_message "$YELLOW" "      - Admin:  cd admin-panel-main && npm run dev"
print_message "$YELLOW" "      - User:   cd user-panel-main && PORT=3001 npm run dev"
echo ""
print_message "$BLUE" "🌐 Default URLs:"
print_message "$BLUE" "   - API Service:  http://localhost:3005"
print_message "$BLUE" "   - Admin Panel:  http://localhost:3000"
print_message "$BLUE" "   - User Panel:   http://localhost:3001"
echo ""
