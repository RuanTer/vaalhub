# GitHub Pages Deployment Guide

This guide will help you deploy the VaalHub site to GitHub Pages with automatic deployments on every push to the master branch.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Configure your repository:
   - **Repository name**: `vaalhub` (or your preferred name)
   - **Description**: "VaalHub - Local news, events, and business information for the Vaal Triangle"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Update Git Remote URL

After creating your repository, update the remote URL with your actual GitHub username:

```bash
cd vaalhub-site
git remote set-url origin https://github.com/YOUR_ACTUAL_USERNAME/vaalhub.git
```

Replace `YOUR_ACTUAL_USERNAME` with your GitHub username.

Verify the remote is set correctly:
```bash
git remote -v
```

## Step 3: Configure GitHub Secrets

Your application uses environment variables that should not be exposed in the code. Set these up as GitHub Secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VITE_NEWSLETTER_API_URL` | Your Google Apps Script URL | Newsletter subscription endpoint |
| `VITE_ADVERTISING_API_URL` | Your Google Apps Script URL | Advertising form endpoint |
| `VITE_GA_MEASUREMENT_ID` | `G-VQZFG8PNVG` | Google Analytics ID |
| `VITE_RECAPTCHA_SITE_KEY` | Your reCAPTCHA site key | reCAPTCHA v3 key (get from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)) |

**To find your current values:**
- Check your `.env` file (DO NOT commit this file to GitHub)
- The URLs and keys are already configured locally

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions** (not "Deploy from a branch")
4. Click **Save**

## Step 5: Push Your Code to GitHub

Now push your local code to GitHub:

```bash
cd vaalhub-site
git push -u origin master
```

If this is your first push, you may be prompted to authenticate with GitHub. Use a Personal Access Token (PAT) if prompted for a password.

### Creating a Personal Access Token (if needed):

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name like "VaalHub Deployment"
4. Select scopes: `repo` (all repo permissions)
5. Click **Generate token**
6. Copy the token and use it as your password when pushing

## Step 6: Monitor Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see a workflow run called "Deploy to GitHub Pages"
4. Click on it to watch the deployment progress
5. Once complete (green checkmark), your site is live!

## Step 7: Access Your Site

Your site will be available at:
- **Option A (Custom Domain)**: `https://vaalhub.co.za` (requires DNS configuration - see below)
- **Option B (GitHub Pages URL)**: `https://YOUR_USERNAME.github.io/vaalhub/`

## Step 8: Configure Custom Domain (vaalhub.co.za)

To use your custom domain `vaalhub.co.za`:

### A. Add Custom Domain in GitHub:

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter: `vaalhub.co.za`
3. Click **Save**
4. Check **Enforce HTTPS** (after DNS is verified)

### B. Create CNAME File:

Create a file in `vaalhub-site/public/CNAME` with just one line:
```
vaalhub.co.za
```

Then commit and push:
```bash
cd vaalhub-site
echo "vaalhub.co.za" > public/CNAME
git add public/CNAME
git commit -m "Add CNAME for custom domain"
git push
```

### C. Configure DNS Settings:

Go to your domain registrar (where you bought vaalhub.co.za) and update DNS records:

**Option 1: Using A Records (Recommended)**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

**Option 2: Using CNAME (if your registrar supports it for apex domain)**
```
Type: CNAME
Name: @
Value: YOUR_USERNAME.github.io

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### D. Wait for DNS Propagation:

- DNS changes can take 24-48 hours to propagate
- Check status at: https://dnschecker.org
- Once propagated, GitHub will automatically provision an SSL certificate

## Step 9: Update Base URL (if using /vaalhub/ path)

If you're NOT using a custom domain and your site is at `username.github.io/vaalhub/`, you need to update the base URL:

1. Edit `vite.config.js`:
```javascript
base: '/vaalhub/', // Change from '/' to '/vaalhub/'
```

2. Commit and push:
```bash
git add vite.config.js
git commit -m "Update base URL for GitHub Pages"
git push
```

**Note**: If using custom domain (vaalhub.co.za), keep `base: '/'`

## Automatic Deployments

After initial setup, every time you push to the `master` branch, GitHub Actions will:
1. Install dependencies
2. Build the project
3. Deploy to GitHub Pages
4. Your site updates automatically!

## Manual Deployment Trigger

You can also manually trigger a deployment:
1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow**

## Troubleshooting

### Build Fails:
- Check the **Actions** tab for error logs
- Ensure all GitHub Secrets are set correctly
- Verify `package.json` and `package-lock.json` are committed

### Site Shows 404:
- Verify base URL in `vite.config.js` matches your deployment (custom domain = `/`, GitHub Pages subdirectory = `/vaalhub/`)
- Check that GitHub Pages is enabled and source is set to "GitHub Actions"

### Custom Domain Not Working:
- Verify DNS records are correct using `nslookup vaalhub.co.za`
- Check CNAME file exists in `public/CNAME`
- Wait for DNS propagation (can take 24-48 hours)
- Ensure custom domain is saved in GitHub Pages settings

### Environment Variables Not Working:
- Verify all secrets are set in GitHub → Settings → Secrets and variables → Actions
- Secret names must match exactly (case-sensitive)
- Redeploy after adding secrets

## Project Structure

```
vaalhub-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   ├── CNAME                   # Custom domain configuration
│   └── ads/
│       └── factorpro-logo.jpg
├── src/
│   ├── components/
│   ├── pages/
│   ├── config/
│   └── ...
├── .env                        # Local environment variables (NOT committed)
├── .env.example               # Template for environment variables
├── vite.config.js             # Vite configuration
└── package.json
```

## Security Notes

- **NEVER** commit `.env` file to GitHub
- Always use GitHub Secrets for sensitive data
- `.env` is in `.gitignore` to prevent accidental commits
- API keys and URLs are injected at build time via GitHub Actions

## Support

For issues with:
- **GitHub Pages**: [GitHub Pages Documentation](https://docs.github.com/en/pages)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Custom Domains**: [GitHub Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Update remote URL
3. ✅ Configure GitHub Secrets
4. ✅ Enable GitHub Pages
5. ✅ Push code to GitHub
6. ✅ Monitor deployment in Actions tab
7. ✅ Configure custom domain (optional)
8. ✅ Update DNS records (if using custom domain)

Your VaalHub site will be live and automatically deploy on every push to master! 🚀
