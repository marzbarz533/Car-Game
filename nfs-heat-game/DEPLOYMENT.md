# Deployment Instructions

## Deploy to Netlify Drop (Recommended - Easiest)

This is the fastest way to get your game online in seconds!

### Steps:

1. **Prepare the folder**
   - You have the complete `nfs-heat-game` folder ready
   - Make sure the folder contains:
     - `index.html`
     - `css/style.css`
     - `js/` (all 10 JavaScript files)
     - `README.md`
     - `netlify.toml`

2. **Go to Netlify Drop**
   - Open browser and go to: https://app.netlify.com/drop
   - You don't need an account for basic deployment

3. **Upload Your Game**
   - Drag and drop the `nfs-heat-game` folder into the drop zone
   - Or click to select the folder from your computer

4. **Wait for Deployment**
   - Netlify will process your files (usually 5-30 seconds)
   - You'll get a temporary URL like: `https://[random-id].netlify.app`

5. **Share Your Game!**
   - Copy the URL and share with friends
   - Your game is now live online!

### Optional: Get a Custom Domain

1. Create a Netlify account (if you want permanent hosting)
2. After deployment, click "Domain settings"
3. Add your custom domain (requires DNS configuration)
4. Follow Netlify's domain setup guide

---

## Alternative: Deploy with Git + GitHub

For permanent hosting and version control:

### Steps:

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create new repository (name: `nfs-heat-game`)
   - Don't initialize with README (you have one already)

2. **Push Your Code**
   ```bash
   cd nfs-heat-game
   git init
   git add .
   git commit -m "Initial game setup"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nfs-heat-game.git
   git push -u origin main
   ```

3. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose your `nfs-heat-game` repository
   - Settings:
     - **Build command**: (leave empty)
     - **Publish directory**: `/`
   - Click "Deploy site"

4. **Automatic Updates**
   - Every time you push to GitHub, your site updates automatically!

---

## Alternative: Deploy with Netlify CLI

For advanced users who want command-line deployment:

### Prerequisites:
- Node.js installed
- npm or yarn

### Steps:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to your game folder
cd nfs-heat-game

# Deploy
netlify deploy

# For production (permanent URL)
netlify deploy --prod
```

You'll get an interactive prompt to set up your site.

---

## Testing Before Deployment

### Local Testing:

**Using Python:**
```bash
cd nfs-heat-game
python -m http.server 8000
# Visit: http://localhost:8000
```

**Using Node.js/http-server:**
```bash
npm install -g http-server
cd nfs-heat-game
http-server
# Visit the provided URL
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

---

## Troubleshooting

### "Game won't load"
- Check browser console (F12) for errors
- Ensure all JS files are in the `js/` folder
- Make sure WebGL is enabled in your browser

### "404 Not Found after deployment"
- The `netlify.toml` file fixes this
- Make sure it's in the root of your game folder

### "Blank white screen"
- Wait 5-10 seconds for Three.js to load
- Check console for JavaScript errors
- Try clearing browser cache (Ctrl+Shift+Delete)

### "Physics or graphics not working"
- Your browser may not support WebGL
- Try a different browser (Chrome, Firefox, Edge)
- Update your graphics drivers

---

## Performance Optimization (Advanced)

To reduce load times:

1. **Minify CSS** - Use online tools to minify `style.css`
2. **Minify JS** - Bundle and minify all JavaScript files
3. **Compress Images** - If you add images, compress them
4. **Enable GZIP** - Netlify does this automatically

---

## Going Live Checklist

- [ ] Game loads without errors
- [ ] Controls work (WASD, Space, P)
- [ ] Physics feel responsive
- [ ] Map generates properly
- [ ] Cops spawn and chase you
- [ ] Shop opens when pressing P
- [ ] Leaderboard displays scores
- [ ] Game is playable on desktop browser
- [ ] URL is shareable with friends

---

You're all set! 🚀 Deploy your game and start racing!

For questions or issues, check the README.md or QUICKSTART.md files.
