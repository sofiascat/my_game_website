from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# List of games with their details
GAMES = [
    {
        "id": "snake",
        "title": "Snake Game",
        "description": "Classic Snake game where you control a snake to eat food and grow without hitting walls or yourself. Features three difficulty levels with adjustable speed settings for players of all skill levels.",
        "image": "snake_thumbnail.jpg",
        "play_url": "/games/snake"
    },
    {
        "id": "balloon_popper",
        "title": "Balloon Popper",
        "description": "A fun and colorful game designed for young children. Control a cheerful bird as it flies through the sky, popping balloons of different colors. The simple controls and bright visuals make it perfect for kids as young as 6 years old.",
        "image": "balloon_popper_thumbnail.jpg",
        "play_url": "/games/balloon_popper"
    },
    {
        "id": "tetris",
        "title": "Tetris",
        "description": "The classic Tetris game with a vibrant, sparkly twist! Arrange falling blocks to create complete lines and score points. Features three difficulty levels, colorful visuals, and special effects when clearing lines. Now with a beautiful starry background, hold piece functionality, ghost piece preview, and high score tracking!",
        "image": "tetris_thumbnail.jpg",
        "play_url": "/games/tetris"
    },
    {
        "id": "animal_dressup",
        "title": "Animal Dress-Up Adventure",
        "description": "In Animal Dress-Up Adventure, the player helps a cute animal character prepare for various fun occasions by selecting outfits and accessories. The game is colorful, easy to use, and encourages creativity, making it ideal for a young child. With a drag-and-drop interface, cheerful sounds, and themed adventures, it offers a playful experience that's both entertaining and accessible.",
        "image": "animal_dressup_thumbnail.jpg",
        "play_url": "/games/animal_dressup"
    }
]

@app.route('/')
def index():
    """Render the home page with the list of games"""
    return render_template('index.html', games=GAMES)

@app.route('/about')
def about():
    """Render the about page"""
    return render_template('about.html')

@app.route('/games/<game_id>')
def game(game_id):
    """Render a specific game page"""
    # Find the game with the matching ID
    game_info = next((g for g in GAMES if g["id"] == game_id), None)
    
    if game_info:
        return render_template('game.html', game=game_info)
    else:
        return render_template('404.html'), 404

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True) 