#!/bin/bash

# Build the client-side application for Netlify
echo "Building client for Netlify deployment..."

# Run Vite build to create static files
npm run build

# Copy redirect rules to the output directory
cp _redirects dist/public/

# Create a simple index file for the root
echo "Client build completed! Files are ready in dist/public/"
echo "Upload the contents of dist/public/ to Netlify"