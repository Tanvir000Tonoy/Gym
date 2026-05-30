# Fitness

A bold, single-page fitness planner built with React and Vite. It presents a structured bulk-focused workout split, daily nutrition targets, meal timing, and beginner recovery tips in a dark, high-contrast interface.

## Preview

- Workout split with expandable training days
- Nutrition tab with macro targets and meal plan
- Tips and recovery guidance for beginners
- Clickable exercise names that open a learn-more search in a new tab

## Tech Stack

- React 19
- Vite 8
- Plain inline React styles for a fast, self-contained UI

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Deploy

This project is ready to deploy as a static site.

### Vercel

- Import the repository into Vercel
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

- Import the repository into Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

- Build the app with `npm run build`
- Publish the contents of `dist`
- If you want, I can add the GitHub Pages configuration for you

## Project Structure

- `main.jsx` - the full app UI and content
- `index.html` - Vite entry page
- `package.json` - scripts and dependencies

## Notes

- The app is designed as a demo-style fitness plan, not medical advice.
- Exercise links open external search results so users can quickly learn what each movement is.

## License

No license file is included yet. Add one if you plan to publish or share the project publicly.