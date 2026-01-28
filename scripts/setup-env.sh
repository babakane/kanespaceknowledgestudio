#!/bin/bash

# Cloudflare Environment Variables Setup Script
# This script configures environment variables for your Cloudflare Pages deployment

echo "=================================="
echo "Cloudflare Pages Env Setup"
echo "=================================="
echo ""

# Check if Cloudflare CLI is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

echo "📝 This script will help you set environment variables for Cloudflare Pages"
echo ""

# Get Cloudflare credentials
read -p "Enter your Cloudflare API Token: " CF_API_TOKEN
read -p "Enter your Cloudflare Account ID: " CF_ACCOUNT_ID
read -p "Enter your Google Gemini API Key: " GEMINI_API_KEY
read -p "Enter your HuggingFace API Key: " HF_API_KEY

echo ""
echo "Setting environment variables in Cloudflare..."
echo ""

# Export the API token
export CLOUDFLARE_API_TOKEN=$CF_API_TOKEN

# The actual environment variables are set in GitHub Secrets
# Here we provide instructions for manual setup

echo "✅ Configuration Complete!"
echo ""
echo "📌 NEXT STEPS - Add these to GitHub Secrets:"
echo "=================================="
echo "1. Go to: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/settings/secrets/actions"
echo "2. Click 'New repository secret' and add:"
echo ""
echo "   Name: CLOUDFLARE_API_TOKEN"
echo "   Value: [Your Cloudflare API Token]"
echo ""
echo "   Name: CLOUDFLARE_ACCOUNT_ID"
echo "   Value: $CF_ACCOUNT_ID"
echo ""
echo "   Name: VITE_API_KEY"
echo "   Value: $GEMINI_API_KEY"
echo ""
echo "   Name: VITE_HF_API_KEY"
echo "   Value: $HF_API_KEY"
echo "=================================="
echo ""
echo "📌 Get your Cloudflare credentials:"
echo "   - API Token: https://dash.cloudflare.com/profile/api-tokens"
echo "   - Account ID: https://dash.cloudflare.com (top right, under subdomain)"
echo ""
echo "✨ Once added, push any change to trigger deployment!"
