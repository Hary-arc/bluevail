# 🚀 Automated Private-to-Public Deploy Setup

This project uses a secure, automated pipeline to compile our static site inside a **private repository** and host the compiled output on **GitHub Pages via a separate public repository**. This architecture keeps our source code 100% hidden while utilizing free GitHub hosting tiers.

---

## 🛠️ How It Works (The Workflow)

* **Source Code:** Kept fully secure and hidden inside this private repository.
* **The Builder:** A GitHub Action compiles the project (`npm run build`) on every push to the `main` branch.
* **The Target:** The Action verifies or creates a public repository (`kodegrove-labs/bluevail`) and force-pushes *only* the compiled static files (`/dist`) there.
* **Hosting:** GitHub Pages serves the live site directly from the `main` branch of that public repository.

---

## 📋 Configuration Summary

### 1. GitHub Action Pipeline (`.github/workflows/deploy.yml`)
Automates the compilation and cross-repository synchronization using a Personal Access Token (`GH_PAT`) stored securely in repository secrets:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build

      - name: Ensure Public Repo Exists
        env:
          GH_TOKEN: \${{ secrets.GH_PAT }}
        run: |
          if ! gh repo view kodegrove-labs/bluevail >/dev/null 2>&1; then
            gh repo create kodegrove-labs/bluevail --public --description "Auto-deployed static site build"
          fi
        
      - name: Deploy to Public Repo
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          token: \${{ secrets.GH_PAT }}
          repository-name: kodegrove-labs/bluevail 
          branch: main
          folder: ./dist
```

### 2. Vite Router Base Path (`vite.config.js`)
Configured to ensure all asset paths route through the GitHub Pages project subfolder (`/bluevail/`) instead of the default root domain:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bluevail/', // 🚨 Critical for GitHub Pages subfolder routing
})
```

### 3. Dynamic Asset Paths (React / JSX)
Because the application is hosted in a subfolder, hardcoded paths referencing the `public/` directory (like `/images/...`) must be dynamically prefixed with Vite’s base environment variable:

* **Standard Static Image Tags:**
  ```jsx
  <img src={`${import.meta.env.BASE_URL}images/dentist-portrait.jpg`} alt="Portrait" />
  ```

* **Dynamic Mapping / Arrays:**
  ```jsx
  <img src={`${import.meta.env.BASE_URL}${member.image.substring(1)}`} alt={member.name} />
  ```

* **Inline Tailwind Background Styles:**
  ```jsx
  style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${img.src.substring(1)})` }}
  ```

---

## 🔁 Everyday Development Cycle

To update your live website, you only need to push code to your private repository. Run these commands locally:

```bash
git add .
git commit -m "feat: updated website content"
git push origin main
```

The GitHub Action runner will take over, build your project, overwrite the public distribution branch, and update your public domain in about 45 seconds.
