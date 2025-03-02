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
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── games/                 # Game source code
│   └── snake/             # Snake game
│       └── snake_game.py  # Pygame version of Snake
├── static/                # Static files
│   ├── css/               # CSS stylesheets
│   │   └── style.css      # Main stylesheet
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main JavaScript
│   │   └── snake.js       # Web version of Snake game
│   └── images/            # Image assets
│       ├── hero-bg.jpg    # Hero background
│       └── snake_thumbnail.jpg  # Snake game thumbnail
└── templates/             # HTML templates
    ├── base.html          # Base template
    ├── index.html         # Home page
    ├── about.html         # About page
    ├── game.html          # Game page
    └── 404.html           # Error page
```

## Setup and Installation

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

## Adding New Games

To add a new game to the platform:

1. Create a new directory in the `games/` folder for your game
2. Develop your Pygame game
3. Convert it to a web-compatible format (using p5.js or another web framework)
4. Add the game details to the `GAMES` list in `app.py`
5. Create a template for your game in the `templates/` directory if needed
6. Add any necessary static files (images, JavaScript, etc.)

## Deployment

To deploy the website to a production server:

1. Choose a hosting provider (e.g., Heroku, PythonAnywhere, AWS)
2. Set up a production server (e.g., Gunicorn)
3. Configure a web server (e.g., Nginx) to serve static files
4. Set up a domain name and SSL certificate
5. Deploy your code to the server

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pygame for the game development framework
- Flask for the web framework
- p5.js for the web-based game implementation 