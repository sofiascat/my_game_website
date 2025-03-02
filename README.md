# Game Hub Website

A web platform for hosting and showcasing games developed with Python and Pygame, converted to web-compatible formats.

## Features

- Responsive web design
- Game showcase with descriptions
- Playable games directly in the browser
- About page with project information

## Project Structure

```
game-hub/
├── index.html            # Main landing page for GitHub Pages
├── about.html            # About page
├── 404.html              # Custom 404 error page
├── games/                # Game pages
│   └── snake.html        # Snake game page
├── app.py                # Flask application (for local development)
├── requirements.txt      # Python dependencies
├── games/                # Game source code
│   └── snake/            # Snake game
│       └── snake_game.py # Pygame version of Snake
├── static/               # Static files
│   ├── css/              # CSS stylesheets
│   │   └── style.css     # Main stylesheet
│   ├── js/               # JavaScript files
│   │   ├── main.js       # Main JavaScript
│   │   └── snake.js      # Web version of Snake game
│   └── images/           # Image assets
│       ├── hero-bg.jpg   # Hero background
│       └── snake_thumbnail.jpg  # Snake game thumbnail
└── templates/            # HTML templates (for Flask)
    ├── base.html         # Base template
    ├── index.html        # Home page
    ├── about.html        # About page
    ├── game.html         # Game page
    └── 404.html          # Error page
```

## Local Development Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd game-hub
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## GitHub Pages Deployment

This project is configured to be hosted on GitHub Pages. The static HTML files in the root directory are served directly by GitHub Pages:

1. Push your code to a GitHub repository:
   ```
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to your GitHub repository settings
3. Scroll down to the "GitHub Pages" section
4. Select the branch you want to deploy (usually `main`)
5. Your site will be published at `https://yourusername.github.io/repository-name/`

## Adding New Games

To add a new game to the platform:

1. Create a new directory in the `games/` folder for your game
2. Develop your Pygame game
3. Convert it to a web-compatible format (using p5.js or another web framework)
4. Add the game details to the `GAMES` list in `app.py` (for local development)
5. Create an HTML file for your game in the `games/` directory for GitHub Pages
6. Add any necessary static files (images, JavaScript, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pygame for the game development framework
- Flask for the web framework
- p5.js for the web-based game implementation
- GitHub Pages for hosting 