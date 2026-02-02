# Landing Page Server

This folder contains a simple landing page that can be served using PM2.

## Running with PM2

The landing page is configured in the main `ecosystem.config.cjs` file at the repository root.

### Starting the landing page

```bash
# Start only the landing page
pm2 start ecosystem.config.cjs --only landingpage

# Or start all services including the landing page
pm2 start ecosystem.config.cjs
```

### Managing the landing page

```bash
# Check status
pm2 status

# View logs
pm2 logs landingpage

# Restart
pm2 restart landingpage

# Stop
pm2 stop landingpage

# Delete from PM2
pm2 delete landingpage
```

## Running without PM2

You can also run the landing page server directly:

```bash
cd landingpage
node server.js
```

The server will start on port 3001 by default. You can change the port using the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

## Configuration

The landing page server is configured in `ecosystem.config.cjs`:

- **Name**: landingpage
- **Script**: server.js
- **Port**: 3001 (default)
- **CWD**: /var/www/html/main-admin/landingpage (production path)
