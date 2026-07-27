# Publishing the IJABE site

This project is now prepared for a safe public setup:

- **Vercel** hosts the public and administrator website.
- **Railway** hosts the backend and its managed PostgreSQL database.
- **Cloudflare R2** holds PDFs and images permanently, outside the application server.

Do not publish the present local SQLite file or the `backend/uploads` folder. They remain suitable only for development and as the source from which your content is moved.

## Before you begin

Create or sign in to accounts on GitHub, Railway, Cloudflare, and Vercel. Purchase or identify the site domain if the Faculty has one. Keep this project in a private GitHub repository until the site is ready.

You will use the following names in the instructions. Replace them with your real values:

| Item | Example |
| --- | --- |
| Website address | `www.ijabe.example.edu.ng` |
| API address | `ijabe-api.up.railway.app` |
| File address | `files.ijabe.example.edu.ng` |

## 1. Make a backup and export the local content

1. Close the local site, then make a safe copy of the entire project folder somewhere outside this project folder.
2. In the `backend` folder, run `npm run data:export:sqlite`.
3. Confirm that `backend/data/local-export.json` exists. It contains the articles, issues, site details, news, conferences, applications, enquiries, and administrator account currently in the local database. Do not share this file publicly.
4. Keep the existing `backend/uploads` folder. It is the source for PDFs and images that will be moved to R2 later.

## 2. Create permanent file storage in Cloudflare R2

1. In Cloudflare, open **R2 Object Storage**, then create a bucket named `ijabe-production`.
2. In the bucket settings, connect a custom domain such as `files.ijabe.example.edu.ng`. Cloudflare will show the DNS record to add. Wait until it reports that the domain is active.
3. Create an R2 API token with **Object Read & Write** access restricted to this one bucket. Save the Access Key ID and Secret Access Key immediately; Cloudflare shows the secret only once.
4. Find the Cloudflare Account ID in the R2 overview.
5. Keep these five values ready: Account ID, Access Key ID, Secret Access Key, bucket name, and the `https://files...` address.

## 3. Publish the backend and PostgreSQL database on Railway

1. Push this project to a private GitHub repository.
2. In Railway, create a new project. Select **Deploy from GitHub repo**, choose the repository, and set the service **Root Directory** to `backend`.
3. Add a **PostgreSQL** service to the same Railway project.
4. Open the backend service's **Variables** page. Add the values from `backend/.env.production.example`.
5. For `DATABASE_URL`, use Railway's PostgreSQL connection variable (`${{Postgres.DATABASE_URL}}` when the database service is named Postgres). Do not paste the local `file:./dev.db` value.
6. Create two different long random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (at least 32 characters each). They must never be committed to GitHub.
7. Set `FRONTEND_URL` temporarily to the Vercel address you will receive in step 5. You can return here to change it after Vercel is deployed. Set `STORAGE_PROVIDER` to `r2` and add all five R2 values.
8. Railway reads `backend/railway.toml`. It will generate the PostgreSQL client, create the database tables before deployment, build the backend, and check `/api/health` before it marks the service healthy.
9. In Railway networking, generate a public domain. Open `https://YOUR-API-DOMAIN/api/health` in a browser. A small successful status message means the backend is live.

## 4. Move your existing content and files once

Perform these commands from your own computer in the `backend` folder. Use the **public** Railway PostgreSQL connection string for `DATABASE_URL` only in this command window. Never put it in the frontend or commit it to a file.

1. Set `DATABASE_URL` to the Railway PostgreSQL connection string.
2. Run `npm run prisma:generate:production`.
3. Run `npm run prisma:migrate:production`.
4. Run `npm run data:import:production`.
5. With the same production values for `DATABASE_URL` and all five R2 variables, run `npm run files:migrate:production`.
6. Visit the Railway API and use the administrator site after step 5. Check at least one PDF and one image. If a file was never saved under `backend/uploads`, upload it again from the administrator page.

The import does not copy old sign-in sessions. The existing administrator email and password are copied, but all administrators will need to sign in again. That is intentional and safer.

## 5. Publish the website on Vercel

1. In Vercel, select **Add New Project** and import the same GitHub repository.
2. Set the project **Root Directory** to `frontend`.
3. Add the environment variable `VITE_API_BASE_URL` with the exact value `https://YOUR-API-DOMAIN/api`. It must begin with `https` and end with `/api`.
4. Deploy. Vercel will provide an address like `https://ijabe.vercel.app`.
5. Return to Railway and set `FRONTEND_URL` to that exact Vercel address. If you will use both the Vercel address and a Faculty domain, put the second address in `FRONTEND_URLS`.
6. Redeploy the Railway backend after saving the address. This permits secure administrator login and public enquiry submissions only from your website.

## 6. Connect the real domain

1. Add `www.ijabe.example.edu.ng` to Vercel and follow its DNS instructions.
2. Change Railway `FRONTEND_URL` to the new exact `https://www...` address. Keep the Vercel address in `FRONTEND_URLS` while testing if needed.
3. Keep the R2 custom domain on `files.ijabe.example.edu.ng`.
4. Redeploy the backend, then test the real address on a phone and computer. HTTPS certificates are managed automatically by Vercel, Railway, and Cloudflare once DNS is correct.

## 7. Launch checklist

- Confirm the public site opens at the real domain and no browser security warning appears.
- Sign in as administrator, then add a test image and a test PDF. Confirm both use the `files...` address.
- Add, edit, and remove one test article; confirm it is attached to an issue.
- Submit a conference application and an enquiry from the public site; confirm both appear in the administrator area.
- Leave the administrator area unused for 10 minutes; confirm it signs out. While actively using it, confirm it remains signed in.
- Confirm at least one database backup schedule in Railway and record who holds the Cloudflare and Railway account recovery details.
- Remove any test article, application, enquiry, and file before formally announcing the site.

## Routine after launch

New uploads use R2 automatically. New database content is kept in Railway PostgreSQL. Do not make changes directly in the production database. Use the administrator area, then keep a separate backup of journal PDFs and site images owned by the Faculty.
