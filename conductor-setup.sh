#!/bin/zsh

echo "🚀 Setting up homework-center workspace..."

# Fail fast on errors
set -e

# Check for required tools
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Copy environment variables from the root if they exist
if [ -f "$CONDUCTOR_ROOT_PATH/.env" ]; then
    echo "🔑 Copying environment variables..."
    cp "$CONDUCTOR_ROOT_PATH/.env" .env
else
    echo "⚠️  Warning: No .env file found in root. Please create one with:"
    echo "   VITE_SUPABASE_URL=your_supabase_url"
    echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "   VITE_API_URL=your_api_url"
fi

# Generate TypeScript types from Supabase (optional - will continue if fails)
echo "🏗️ Attempting to generate Supabase types..."
npm run generate-types || echo "⚠️  Warning: Could not generate Supabase types. This is okay if you haven't configured Supabase yet."

# Build the project to catch any initial errors
echo "🔨 Running initial build..."
npm run build

echo "✅ Workspace setup complete! Click the Run button to start the dev server."