# Easy School App

A full-stack web app for learning vocabulary sets with user authentication, learning modes, and admin management.

## Preview

- Frontend local URL: `http://localhost:3000`
- Backend local URL: `http://localhost:5000`
- API health check: `GET http://localhost:5000/api/test`

You can add screenshots to `docs/` and reference them here, e.g.:

```md
![Login screen](docs/login.png)
```

## Tech Stack

- Frontend: React 19, Vite 7, React Router, Axios
- Backend: Node.js, Express 5, MongoDB native driver, JWT, bcryptjs
- Tooling: ESLint, npm workspaces, GitHub Actions

## Project Structure

```text
.
|- easy-school-client/
|  |- public/
|  |- src/
|  |  |- admin/
|  |  |- api/
|  |  |- components/
|  |  |- context/
|  |  |- pages/
|  |- package.json
|  |- vercel.json
|- easy-school-server/
|  |- middleware/
|  |- models/
|  |- routes/
|  |- scripts/
|  |- utils/
|  |- .env.example
|  |- Dockerfile
|  |- package.json
|- .github/workflows/ci.yml
|- package.json
|- README.md
```

## Environment Variables

### Backend (`easy-school-server/.env`)

Copy from `easy-school-server/.env.example`:

```bash
cp easy-school-server/.env.example easy-school-server/.env
```

Required:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

Optional (email sending):

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_TEST_MODE`

### Frontend (`easy-school-client/.env`, optional)

Copy from `easy-school-client/.env.example` if you want explicit API URL:

- `VITE_API_URL`

In local dev, Vite proxy already maps `/api` to `http://localhost:5000`.

## Local Development

1. Install dependencies from repo root:

```bash
npm install
```

2. Configure env:

- create `easy-school-server/.env`
- optionally create `easy-school-client/.env`

3. Run frontend + backend:

```bash
npm run dev
```

## Available Scripts (root)

- `npm run dev` - start backend + frontend in dev mode
- `npm run start` - start backend in production mode
- `npm run build` - build frontend
- `npm run preview` - preview frontend build
- `npm run lint` - run ESLint for frontend
- `npm run test` - placeholder server test command

## Deployment

### Option A: Frontend on Vercel + Backend on Render/Railway

1. Deploy `easy-school-server` to Render or Railway.
2. Set backend environment variables from `.env.example`.
3. Deploy `easy-school-client` to Vercel.
4. Set `VITE_API_URL` in Vercel to your backend URL, e.g. `https://api.example.com/api`.
5. `easy-school-client/vercel.json` already rewrites all routes to `index.html` for SPA routing.

### Option B: Backend Docker Deployment

Build and run backend container from `easy-school-server`:

```bash
docker build -t easy-school-server .
docker run --env-file .env -p 5000:5000 easy-school-server
```

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml`.

Triggered on:

- push to `main`
- pull requests targeting `main`

Pipeline steps:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run test`

## Security Notes

- `.env` files are ignored by Git.
- `node_modules`, build artifacts, and logs are ignored.
- `easy-school-server/.env` was removed from tracked files.
- `easy-school-server/node_modules` was removed from tracked files.

Important: a previous commit (`304c1ad`) included `.env` in history. Before public release, rotate all leaked credentials and rewrite Git history (for example with `git filter-repo`) if you need a fully clean public history.

## Production Checklist

- Set strong `JWT_SECRET`.
- Use production MongoDB credentials.
- Set strict `CORS_ORIGIN`.
- Set `EMAIL_TEST_MODE=false` only when SMTP credentials are configured.
- Verify `GET /api/test` on deployed backend.
- Verify direct SPA routes (e.g. `/login`, `/admin`) on deployed frontend.

## Roadmap (Optional)

- Add real automated tests for API and UI.
- Add role-based audit logging.
- Add password reset and email verification flow.
- Add seed scripts and demo data profile.