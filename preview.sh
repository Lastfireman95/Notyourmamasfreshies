#!/usr/bin/env bash
# Start a simple HTTP server serving the repository root so resources load correctly.
# Usage: bash preview.sh
PORT=8000
echo "Serving $(pwd) on http://localhost:${PORT}/"
echo ""
echo "Preview pages:"
echo "  Home: http://localhost:${PORT}/index.html"
echo "  Primary: http://localhost:${PORT}/HTML/Primary-page-HTML"
echo "  Sales: http://localhost:${PORT}/HTML/Sales-page.html"
echo "  Cart: http://localhost:${PORT}/HTML/cart.html"
echo "  Admin Login: http://localhost:${PORT}/HTML/admin-login.html"
echo "  Admin Dashboard: http://localhost:${PORT}/HTML/admin-dashboard.html"
echo ""
python3 -m http.server ${PORT}
