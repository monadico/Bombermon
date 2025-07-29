# 🚀 Deploying Bomberman to Vercel

This guide will help you deploy your Multiplayer Bomberman game to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your project should be in a Git repository (GitHub, GitLab, etc.)
3. **MultiSynq API Key**: Get your free API key from [multisynq.io/coder](https://multisynq.io/coder)

## 🔧 Step 1: Configure Your API Key

Before deploying, you need to update the API key in your configuration:

1. Open `config.js`
2. Replace `'234567_Paste_Your_Own_API_Key_Here_7654321'` with your actual MultiSynq API key
3. Save the file

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push to Git**: Make sure your code is pushed to your Git repository
2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a static site
3. **Deploy**: Click "Deploy" - no additional configuration needed!

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? `[Your account]`
   - Link to existing project? `N`
   - Project name: `bomberman` (or your preferred name)
   - In which directory is your code located? `./` (current directory)
   - Want to override the settings? `N`

## 🌐 Step 3: Access Your Deployed Game

After deployment, Vercel will provide you with URLs:

- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each Git branch/PR

### Game URLs:
- **Main Lobby**: `https://your-project-name.vercel.app/`
- **Multiplayer Game**: `https://your-project-name.vercel.app/game`
- **Alternative Multiplayer**: `https://your-project-name.vercel.app/multiplayer`

## 🔄 Step 4: Automatic Deployments

Once connected to Vercel:
- **Automatic Deployments**: Every push to your main branch triggers a new deployment
- **Preview Deployments**: Pull requests get preview URLs
- **Custom Domains**: Add your own domain in the Vercel dashboard

## 🎮 Step 5: Share Your Game

1. **Share the URL**: Send the Vercel URL to friends
2. **Test Multiplayer**: Have friends join the same game session
3. **Enjoy**: Play Bomberman together!

## 🔧 Configuration Details

The `vercel.json` file handles:
- **Static File Serving**: All HTML, JS, CSS, images, and audio files
- **Routing**: Clean URLs for different game modes
- **Security Headers**: Basic security protection
- **Asset Optimization**: Automatic compression and caching

## 🐛 Troubleshooting

### Common Issues:

**"Failed to connect to multiplayer server"**
- ✅ Verify your API key is correct in `config.js`
- ✅ Check that your domain is allowlisted in MultiSynq dashboard
- ✅ Ensure you have internet connectivity

**Assets not loading**
- ✅ Verify all files are committed to Git
- ✅ Check that file paths are correct (case-sensitive)
- ✅ Ensure Vercel deployment completed successfully

**Game not working**
- ✅ Check browser console for JavaScript errors
- ✅ Verify MultiSynq client is loading correctly
- ✅ Test with a fresh browser session

## 📊 Monitoring

- **Vercel Analytics**: View deployment status and performance
- **MultiSynq Dashboard**: Monitor multiplayer connections
- **Browser Console**: Check for client-side errors

## 🔄 Updates

To update your deployed game:
1. Make changes to your code
2. Commit and push to Git
3. Vercel automatically deploys the new version
4. Share the updated URL with players

## 🎯 Next Steps

- **Custom Domain**: Add your own domain in Vercel settings
- **Environment Variables**: Use Vercel's env vars for API keys (optional)
- **Analytics**: Enable Vercel Analytics for usage insights
- **CDN**: Vercel's global CDN ensures fast loading worldwide

---

🎮 **Your Bomberman game is now live and ready for multiplayer action!** 💣✨ 