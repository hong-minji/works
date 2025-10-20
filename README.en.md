# Gatsby + Notion CMS Blog

**English | [한국어](README.md)**

A Gatsby-powered blog that uses Notion as a CMS, with automatic synchronization via GitHub Actions. Write your posts in Notion, and they'll automatically appear on your website every 10 minutes.

## 🌟 Features

- **Notion as CMS**: Write and manage posts directly in Notion
- **Auto-sync**: GitHub Actions automatically fetch Notion content every 10 minutes
- **Slug Management**: Control URL slugs directly from Notion
- **Template Selection**: Choose between 'post' and 'page' templates in Notion
- **Draft Support**: Mark posts as draft to hide them from the published site
- **Rich Content**: Full support for Notion's rich text, images, code blocks, and more
- **SEO Optimized**: Meta tags, sitemap, RSS feed generation
- **Fast & Responsive**: Built with Gatsby for optimal performance

## 🔐 Security Overview

> **⚠️ CRITICAL: This project uses API keys that must NEVER be committed to your repository**

This project implements several security measures:
- Environment variables for sensitive data (`.env` files)
- GitHub Secrets for CI/CD credentials
- `.gitignore` configured to prevent credential leaks
- No API keys in source code

**Before pushing to GitHub, ensure you follow the security setup instructions below.**

## 📋 Prerequisites

- Node.js 18+ and npm
- A Notion account and workspace
- A GitHub account (for auto-sync and deployment)
- Basic knowledge of Git and command line

## 🚀 Setup Guide

### Step 1: Notion Integration Setup

#### 1.1 Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the integration details:
   - Name: `My Blog Integration` (or any name you prefer)
   - Associated workspace: Select your workspace
   - Capabilities: Read content, Read comments
4. Click **"Submit"**
5. **Copy the "Internal Integration Token"** - you'll need this as `NOTION_API_KEY`

> **🔒 Security Warning**: This token grants access to your Notion workspace. Keep it secret and never commit it to your repository.

#### 1.2 Create Notion Database

1. In Notion, create a new **Database** (Table or Gallery view)
2. Add the following properties to your database:

| Property Name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Title` or `Name` | Title | ✅ Yes | Post title |
| `Slug` | Text | ✅ Yes | URL path (e.g., "my-first-post") |
| `Date` | Date | ✅ Yes | Publication date |
| `Category` | Select | ✅ Yes | Post category |
| `Tags` | Multi-select | ⚪ Optional | Post tags |
| `Description` | Text | ✅ Yes | Post excerpt/description |
| `Draft` | Checkbox | ✅ Yes | Mark as draft to hide from site |
| `Template` | Select | ✅ Yes | Options: "post" or "page" |
| `Social Image` | Files | ⚪ Optional | Social media preview image |

3. **Share the database with your integration**:
   - Click the **"Share"** button in the top right of your database
   - Click **"Invite"**
   - Select your integration (e.g., "My Blog Integration")
   - Click **"Invite"**

4. **Get your Database ID**:
   - Open your database as a full page
   - Copy the URL: `https://notion.so/workspace/DATABASE_ID?v=...`
   - Extract the `DATABASE_ID` (32-character string before the `?`)

### Step 2: Local Development Setup

#### 2.1 Clone and Install

```bash
# Clone your repository (or fork this one)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install
```

#### 2.2 Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env.development
   ```

2. **Edit `.env.development`** and add your Notion credentials:
   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Verify `.env` files are in `.gitignore`**:
   ```bash
   # Check that these lines exist in .gitignore
   cat .gitignore | grep ".env"
   # Should show:
   # .env
   # .env.*
   # !.env.example
   ```

> **🔒 Security Checkpoint**:
> - NEVER commit `.env.development` or `.env` files
> - Only commit `.env.example` (without real credentials)
> - Double-check before every `git add`

#### 2.3 Update Site Configuration

Edit [`content/config.json`](content/config.json) with your information:

```json
{
  "title": "Your Name",
  "url": "https://yourusername.github.io/repository-name",
  "description": "Your site description",
  "pathPrefix": "/repository-name",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "author": {
    "title": "Your Name",
    "photo": "/profile.jpg",
    "description": "Your bio",
    "contacts": [
      {
        "name": "linkedin",
        "contact": "your-linkedin"
      }
    ]
  }
}
```

#### 2.4 Test Locally

```bash
# Start development server
npm start

# The site will be available at http://localhost:8000
```

If you see your Notion posts appearing, the integration is working! 🎉

### Step 3: GitHub Repository Setup

#### 3.1 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a **new repository** (public or private)
3. **Do NOT initialize with README** (we already have one)

#### 3.2 Configure GitHub Secrets

> **🔒 CRITICAL SECURITY STEP**: Never push your API keys to GitHub. Use GitHub Secrets instead.

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `NOTION_API_KEY` | `secret_...` | From Step 1.1 (Notion Integration Token) |
| `NOTION_DATABASE_ID` | `32-char string` | From Step 1.2 (Database URL) |

**Adding each secret**:
- Click **"New repository secret"**
- Name: `NOTION_API_KEY`
- Secret: Paste your Notion integration token
- Click **"Add secret"**
- Repeat for `NOTION_DATABASE_ID`

> **✅ Security Verification**:
> - GitHub Secrets are encrypted and never exposed in logs
> - They're only accessible during GitHub Actions runs
> - You cannot view them after creation (only update/delete)

#### 3.3 Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
3. Click **"Save"**

Your site will be available at: `https://yourusername.github.io/repository-name`

#### 3.4 Push Your Code

```bash
# BEFORE PUSHING: Verify no secrets in code
git status
# Make sure .env files are NOT listed

# Initialize and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add .
git commit -m "Initial commit: Gatsby + Notion blog"
git push -u origin main
```

### Step 4: GitHub Actions Configuration

The repository includes two workflows:

#### 4.1 Auto-sync Workflow (`.github/workflows/sync-notion.yml`)

- **Trigger**: Runs every 10 minutes automatically
- **Purpose**: Fetch latest Notion content and deploy if changes detected
- **Configuration**:
  ```yaml
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  ```

**To modify sync frequency**, edit the cron expression:
- Every 5 minutes: `*/5 * * * *`
- Every 30 minutes: `*/30 * * * *`
- Every hour: `0 * * * *`

#### 4.2 Manual Deploy Workflow (`.github/workflows/deploy.yml`)

- **Trigger**: Manual execution from GitHub Actions tab
- **Purpose**: Force deployment without waiting for scheduled sync

**To manually trigger**:
1. Go to **Actions** tab in GitHub
2. Select **"Manual Deploy to GitHub Pages"**
3. Click **"Run workflow"**
4. Add optional deployment message
5. Click **"Run workflow"**

### Step 5: Verify Deployment

1. **Check GitHub Actions**:
   - Go to **Actions** tab
   - Wait for the first workflow run to complete (green checkmark)
   - Click on the workflow to see detailed logs

2. **View your site**:
   - Visit `https://yourusername.github.io/repository-name`
   - Your Notion posts should appear!

3. **Test auto-sync**:
   - Add a new post in Notion
   - Uncheck the "Draft" checkbox
   - Wait up to 10 minutes
   - Refresh your website - new post should appear!

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── sync-notion.yml      # Auto-sync every 10 minutes
│       └── deploy.yml           # Manual deployment
├── content/
│   ├── config.json              # Site configuration
│   └── logo.png                 # Site logo
├── internal/
│   ├── gatsby/                  # Gatsby configuration
│   │   ├── source-nodes.ts      # Notion data sourcing
│   │   ├── create-pages.ts      # Page generation
│   │   └── queries/             # GraphQL queries
│   └── notion/                  # Notion integration
│       ├── client.ts            # Notion API client
│       ├── fetch-pages.ts       # Fetch Notion pages
│       ├── transform.ts         # Transform to frontmatter
│       ├── markdown-converter.ts # Convert blocks to markdown
│       └── image-downloader.ts  # Download Notion images
├── src/
│   ├── components/              # React components
│   ├── templates/               # Page templates
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utility functions
├── gatsby-config.ts             # Gatsby configuration
├── gatsby-node.ts               # Gatsby Node APIs
├── .env.example                 # Example environment variables
└── .gitignore                   # Ignored files (includes .env)
```

## 🔧 Configuration

### Notion Database Properties

The system looks for these Notion properties (case-sensitive):

- **Title/Name**: Post title (falls back to "Untitled")
- **Slug**: URL path (auto-generated from title if missing)
- **Date**: Publication date (falls back to creation date)
- **Category**: Post category (falls back to "uncategorized")
- **Tags**: Array of tags (optional)
- **Description**: Post excerpt (optional)
- **Draft**: Boolean - if true, post won't be published
- **Template**: "post" or "page" (falls back to "post")
- **Social Image**: Preview image for social media (optional)

### Gatsby Configuration

Edit [`gatsby-config.ts`](gatsby-config.ts) for:
- Plugin configuration
- SEO settings
- RSS feed options
- Google Analytics

## 🐛 Troubleshooting

### Posts not appearing

1. **Check Notion database sharing**:
   - Open your Notion database
   - Click "Share" → Verify your integration has access

2. **Verify Draft status**:
   - In Notion, ensure "Draft" checkbox is UNCHECKED

3. **Check GitHub Secrets**:
   - Settings → Secrets → Verify `NOTION_API_KEY` and `NOTION_DATABASE_ID` exist

4. **Review GitHub Actions logs**:
   - Actions tab → Click latest workflow run
   - Look for error messages

### GitHub Actions failing

1. **"NOTION_API_KEY is required"**:
   - Secret missing or misspelled in GitHub Secrets
   - Go to Settings → Secrets → Add/update secret

2. **"unauthorized" error**:
   - Invalid Notion API key
   - Regenerate integration token in Notion
   - Update GitHub Secret

3. **"object_not_found" error**:
   - Wrong database ID
   - Database not shared with integration
   - Verify database ID and sharing settings

### Local development errors

1. **"NOTION_API_KEY is required"**:
   - Create `.env.development` file
   - Copy credentials from `.env.example`

2. **Port 8000 already in use**:
   ```bash
   # Kill existing process
   lsof -ti:8000 | xargs kill -9

   # Or use different port
   gatsby develop -p 8001
   ```

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use GitHub Secrets for all API keys
- ✅ Keep `.env` files in `.gitignore`
- ✅ Use `.env.example` without real credentials
- ✅ Rotate API keys if accidentally exposed
- ✅ Review commit history before pushing
- ✅ Use environment-specific env files (`.env.development`, `.env.production`)

### ❌ DON'T:
- ❌ Commit `.env` files to Git
- ❌ Share API keys in issues or pull requests
- ❌ Hardcode credentials in source files
- ❌ Push to public repos without checking secrets
- ❌ Use production keys in development
- ❌ Ignore security warnings from Git or GitHub

### 🚨 If you accidentally commit secrets:

1. **Immediately rotate all exposed keys**:
   - Notion: Create new integration, update secrets
   - GitHub: Generate new personal access tokens

2. **Remove from Git history**:
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # Then force push (WARNING: destructive)
   git push --force
   ```

3. **Verify on GitHub**:
   - Check commit history is clean
   - Verify no secrets in any branch

## 📝 Customization

### Styling

- Edit SCSS files in [`src/assets/scss/`](src/assets/scss/)
- Main colors and fonts in [`src/assets/scss/_variables.scss`](src/assets/scss/_variables.scss)

### Adding Features

- **New Notion properties**: Update [`internal/notion/transform.ts`](internal/notion/transform.ts)
- **New page types**: Add templates in [`src/templates/`](src/templates/)
- **Custom components**: Create in [`src/components/`](src/components/)

## 📚 Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [Notion API Documentation](https://developers.notion.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Markdown Guide](https://www.markdownguide.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is based on [Gatsby Lumen Theme](https://github.com/alxshelepenok/gatsby-starter-lumen) - MIT License

## 💬 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [GitHub Issues](../../issues)
3. Create a new issue with:
   - Error messages (remove any secrets!)
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

---

**Built with ❤️ using Gatsby and Notion**
