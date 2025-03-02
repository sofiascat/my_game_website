import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 600, 400
GRID_SIZE = 20
GRID_WIDTH = WIDTH // GRID_SIZE
GRID_HEIGHT = HEIGHT // GRID_SIZE
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)

# Speed settings
SPEED_SLOW = 5
SPEED_MEDIUM = 10
SPEED_FAST = 15
SPEED = SPEED_MEDIUM  # Default speed

# Create the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake Game")
clock = pygame.time.Clock()

class Snake:
    def __init__(self):
        self.positions = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = (1, 0)  # Start moving right
        self.growth_pending = 0  # Track how many segments to grow
        
    def get_head_position(self):
        return self.positions[0]
    
    def move(self):
        head = self.get_head_position()
        x, y = self.direction
        new_position = ((head[0] + x) % GRID_WIDTH, (head[1] + y) % GRID_HEIGHT)
        
        if new_position in self.positions[1:]:
            return False  # Game over
        
        self.positions.insert(0, new_position)
        
        # Remove tail unless we have pending growth
        if self.growth_pending > 0:
            self.growth_pending -= 1
        else:
            self.positions.pop()
            
        return True
    
    def change_direction(self, direction):
        # Prevent 180-degree turns
        if (direction[0] * -1, direction[1] * -1) != self.direction:
            self.direction = direction
    
    def grow_snake(self, amount=1):
        # Add segments to the growth queue
        self.growth_pending += amount
    
    def draw(self, surface):
        for i, p in enumerate(self.positions):
            # Head is lighter green, body segments get darker as they go back
            if i == 0:
                color = GREEN  # Head color
            else:
                # Create a gradient effect for the body
                green_value = max(50, 200 - (i * 5))
                color = (0, green_value, 0)
                
            rect = pygame.Rect((p[0] * GRID_SIZE, p[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(surface, color, rect)
            pygame.draw.rect(surface, BLACK, rect, 1)

class Food:
    def __init__(self, snake_positions):
        self.position = self.randomize_position(snake_positions)
        
    def randomize_position(self, snake_positions):
        position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        while position in snake_positions:
            position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        return position
    
    def draw(self, surface):
        rect = pygame.Rect((self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(surface, RED, rect)
        pygame.draw.rect(surface, BLACK, rect, 1)

def draw_grid(surface):
    for y in range(0, HEIGHT, GRID_SIZE):
        for x in range(0, WIDTH, GRID_SIZE):
            rect = pygame.Rect((x, y), (GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(surface, BLACK, rect, 1)

def draw_score(surface, score):
    font = pygame.font.SysFont('arial', 20)
    text = font.render(f'Score: {score}', True, BLACK)
    surface.blit(text, (5, 5))

def draw_speed_buttons(surface, current_speed):
    # Draw speed setting buttons
    font = pygame.font.SysFont('arial', 16)
    
    # Slow button
    slow_rect = pygame.Rect(WIDTH - 180, 5, 50, 30)
    slow_color = BLUE if current_speed == SPEED_SLOW else (100, 100, 100)
    pygame.draw.rect(surface, slow_color, slow_rect)
    pygame.draw.rect(surface, BLACK, slow_rect, 2)
    slow_text = font.render('Slow', True, WHITE)
    surface.blit(slow_text, (WIDTH - 170, 12))
    
    # Medium button
    medium_rect = pygame.Rect(WIDTH - 120, 5, 50, 30)
    medium_color = BLUE if current_speed == SPEED_MEDIUM else (100, 100, 100)
    pygame.draw.rect(surface, medium_color, medium_rect)
    pygame.draw.rect(surface, BLACK, medium_rect, 2)
    medium_text = font.render('Med', True, WHITE)
    surface.blit(medium_text, (WIDTH - 110, 12))
    
    # Fast button
    fast_rect = pygame.Rect(WIDTH - 60, 5, 50, 30)
    fast_color = BLUE if current_speed == SPEED_FAST else (100, 100, 100)
    pygame.draw.rect(surface, fast_color, fast_rect)
    pygame.draw.rect(surface, BLACK, fast_rect, 2)
    fast_text = font.render('Fast', True, WHITE)
    surface.blit(fast_text, (WIDTH - 50, 12))
    
    return [
        {"rect": slow_rect, "speed": SPEED_SLOW},
        {"rect": medium_rect, "speed": SPEED_MEDIUM},
        {"rect": fast_rect, "speed": SPEED_FAST}
    ]

def main():
    global SPEED
    snake = Snake()
    food = Food(snake.positions)
    score = 0
    game_over = False
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_r:
                        # Restart game
                        snake = Snake()
                        food = Food(snake.positions)
                        score = 0
                        game_over = False
                else:
                    if event.key == pygame.K_UP:
                        snake.change_direction((0, -1))
                    elif event.key == pygame.K_DOWN:
                        snake.change_direction((0, 1))
                    elif event.key == pygame.K_LEFT:
                        snake.change_direction((-1, 0))
                    elif event.key == pygame.K_RIGHT:
                        snake.change_direction((1, 0))
                    # Speed controls with number keys
                    elif event.key == pygame.K_1:
                        SPEED = SPEED_SLOW
                    elif event.key == pygame.K_2:
                        SPEED = SPEED_MEDIUM
                    elif event.key == pygame.K_3:
                        SPEED = SPEED_FAST
            elif event.type == pygame.MOUSEBUTTONDOWN and not game_over:
                # Check if speed buttons were clicked
                mouse_pos = pygame.mouse.get_pos()
                for button in speed_buttons:
                    if button["rect"].collidepoint(mouse_pos):
                        SPEED = button["speed"]
        
        # Draw everything
        screen.fill(WHITE)
        draw_grid(screen)
        
        # Draw speed buttons
        speed_buttons = draw_speed_buttons(screen, SPEED)
        
        if not game_over:
            # Move snake
            if not snake.move():
                game_over = True
            
            # Check if snake ate food
            if snake.get_head_position() == food.position:
                # Grow the snake by 3 segments when eating food
                snake.grow_snake(3)
                food = Food(snake.positions)
                score += 1
        
        snake.draw(screen)
        food.draw(screen)
        draw_score(screen, score)
        
        if game_over:
            font = pygame.font.SysFont('arial', 30)
            text = font.render('Game Over! Press R to restart', True, BLACK)
            text_rect = text.get_rect(center=(WIDTH//2, HEIGHT//2))
            screen.blit(text, text_rect)
        
        pygame.display.update()
        clock.tick(SPEED)

if __name__ == "__main__":
    main() 