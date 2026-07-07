# Crework Labs - B2B

## 🚀 Project Structure

```text
/
├── public/
│   └── companies/
│   └── portfolio/
│   └── social/
│   └── styles/
├── src/
│   └── components/
│   └── pages/
│       └── index.astro
└── .prettierrc.mjs
└── astro.config.mjs
└── package.json
```

Currently, we have our components for the landing page in the `src/components/` directory. We created components because each file doesn’t have many lines of code.
We will place our images or other static content into the `public/` directory, and we’ll try to organize them by grouping similar items into folders.

### 🛠️ Working Branch
We are using the `feature/Website-updates` branch to integrate the crework-dashboard components and pages.


## 🧞 Commands

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `pnpm install` | Installs dependencies                        |
| `pnpm dev`     | Starts local dev server at `localhost:4321`  |
| `pnpm build`   | Build your production site to `./dist/`      |
| `pnpm preview` | Preview your build locally, before deploying |
