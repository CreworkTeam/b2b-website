# Crework Labs - B2B

## 🚀 Project Structure

We have recently migrated to a modular Astro architecture for maximum performance, isolating React strictly to interactive UI islands.

```text
/
├── public/
│   ├── companies/
│   ├── portfolio/
│   ├── social/
│   └── styles/
├── src/
│   ├── components/
│   │   ├── ai-ops/         # Modular Astro components for the AI Operations page
│   │   ├── main-dashboard/ # Modular Astro components for the new Homepage
│   │   └── react/          # Isolated React components (e.g., Framer Motion islands)
│   ├── pages/
│   │   ├── index.astro         # The new Main Dashboard (Home)
│   │   ├── CTO.astro           # The original homepage (Overnight CTO)
│   │   └── ai-operations.astro # The AI Operations Dashboard
│   └── styles/
│       └── dashboard/      # CSS for the dashboards
├── .prettierrc.mjs
├── astro.config.mjs
└── package.json
```

### 🛠️ Working Branch
We are using the `feature/Website-updates` branch to integrate the crework-dashboard components and pages natively into Astro.

## 🧞 How to run this project locally

To start the project on your local machine, run the following commands in your terminal:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs all necessary dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/` |
| `npm run preview` | Preview your build locally, before deploying |

**Note on Package Managers:** If you encounter issues with `pnpm` not being recognized, we have optimized the repository to work seamlessly with `npm`.
