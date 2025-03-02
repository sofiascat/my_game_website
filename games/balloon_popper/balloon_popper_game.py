import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)
PURPLE = (128, 0, 128)
ORANGE = (255, 165, 0)

# Create the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Balloon Popper")
clock = pygame.time.Clock()

# Load fonts
title_font = pygame.font.SysFont('comicsans', 60)
score_font = pygame.font.SysFont('comicsans', 40)
message_font = pygame.font.SysFont('comicsans', 80)

class Bird:
    def __init__(self):
        self.x = 100
        self.y = HEIGHT // 2
        self.width = 50
        self.height = 40
        self.speed = 5
        self.color = YELLOW
        
    def draw(self, surface):
        # Draw the bird body
        pygame.draw.ellipse(surface, self.color, (self.x, self.y, self.width, self.height))
        
        # Draw the bird's beak
        pygame.draw.polygon(surface, ORANGE, [
            (self.x + self.width, self.y + self.height // 2 - 5),
            (self.x + self.width + 20, self.y + self.height // 2),
            (self.x + self.width, self.y + self.height // 2 + 5)
        ])
        
        # Draw the bird's eye
        pygame.draw.circle(surface, BLACK, (self.x + self.width - 10, self.y + 15), 5)
        
    def move(self, keys, mouse_pos, mouse_clicked):
        # Keyboard controls
        if keys[pygame.K_UP] and self.y > 0:
            self.y -= self.speed
        if keys[pygame.K_DOWN] and self.y < HEIGHT - self.height:
            self.y += self.speed
        if keys[pygame.K_LEFT] and self.x > 0:
            self.x -= self.speed
        if keys[pygame.K_RIGHT] and self.x < WIDTH - self.width:
            self.x += self.speed
            
        # Mouse controls (if clicked, move toward mouse position)
        if mouse_clicked:
            target_x, target_y = mouse_pos
            
            # Calculate direction to move
            dx = target_x - (self.x + self.width // 2)
            dy = target_y - (self.y + self.height // 2)
            
            # Normalize and scale by speed
            distance = max(1, (dx**2 + dy**2)**0.5)  # Avoid division by zero
            dx = dx / distance * self.speed
            dy = dy / distance * self.speed
            
            # Update position
            new_x = self.x + dx
            new_y = self.y + dy
            
            # Keep within bounds
            self.x = max(0, min(WIDTH - self.width, new_x))
            self.y = max(0, min(HEIGHT - self.height, new_y))
    
    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

class Balloon:
    def __init__(self):
        self.width = 40
        self.height = 60
        self.x = random.randint(0, WIDTH - self.width)
        self.y = HEIGHT
        self.speed = random.uniform(1, 3)
        self.color = random.choice([RED, BLUE, GREEN, PURPLE, ORANGE])
        self.popped = False
        self.pop_time = 0
        
    def draw(self, surface):
        if self.popped:
            # Draw popping animation (simple expanding circle)
            pop_radius = min(30, (pygame.time.get_ticks() - self.pop_time) // 20)
            pygame.draw.circle(surface, WHITE, 
                              (self.x + self.width // 2, self.y + self.height // 2), 
                              pop_radius)
        else:
            # Draw balloon body
            pygame.draw.ellipse(surface, self.color, 
                               (self.x, self.y, self.width, self.height))
            
            # Draw balloon knot
            pygame.draw.polygon(surface, self.color, [
                (self.x + self.width // 2, self.y + self.height),
                (self.x + self.width // 2 - 5, self.y + self.height + 10),
                (self.x + self.width // 2 + 5, self.y + self.height + 10)
            ])
            
            # Draw balloon string
            pygame.draw.line(surface, BLACK,
                            (self.x + self.width // 2, self.y + self.height + 10),
                            (self.x + self.width // 2, self.y + self.height + 30),
                            1)
    
    def move(self):
        if not self.popped:
            self.y -= self.speed
    
    def is_off_screen(self):
        return self.y < -self.height
    
    def pop(self):
        if not self.popped:
            self.popped = True
            self.pop_time = pygame.time.get_ticks()
            return True
        return False
    
    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

def show_start_screen():
    screen.fill(WHITE)
    title = title_font.render("Balloon Popper", True, BLUE)
    instructions1 = score_font.render("Pop 15 balloons to win!", True, BLACK)
    instructions2 = score_font.render("Use arrow keys or click to move the bird", True, BLACK)
    instructions3 = score_font.render("Press SPACE to start", True, GREEN)
    
    screen.blit(title, (WIDTH//2 - title.get_width()//2, HEIGHT//4))
    screen.blit(instructions1, (WIDTH//2 - instructions1.get_width()//2, HEIGHT//2))
    screen.blit(instructions2, (WIDTH//2 - instructions2.get_width()//2, HEIGHT//2 + 50))
    screen.blit(instructions3, (WIDTH//2 - instructions3.get_width()//2, HEIGHT//2 + 150))
    
    pygame.display.update()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    waiting = False
                elif event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

def show_win_screen(score):
    screen.fill(WHITE)
    win_text = message_font.render("You Did It!", True, GREEN)
    score_text = score_font.render(f"You popped {score} balloons!", True, BLUE)
    restart_text = score_font.render("Press SPACE to play again", True, BLACK)
    
    screen.blit(win_text, (WIDTH//2 - win_text.get_width()//2, HEIGHT//3))
    screen.blit(score_text, (WIDTH//2 - score_text.get_width()//2, HEIGHT//2))
    screen.blit(restart_text, (WIDTH//2 - restart_text.get_width()//2, HEIGHT//2 + 100))
    
    pygame.display.update()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    waiting = False
                elif event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

def main():
    # Game variables
    bird = Bird()
    balloons = []
    score = 0
    balloon_spawn_timer = 0
    balloon_spawn_delay = 1000  # milliseconds
    target_score = 15
    popped_balloons = []
    
    # Show start screen
    show_start_screen()
    
    # Main game loop
    running = True
    mouse_clicked = False
    mouse_pos = (0, 0)
    
    while running:
        current_time = pygame.time.get_ticks()
        
        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_clicked = True
                mouse_pos = pygame.mouse.get_pos()
            elif event.type == pygame.MOUSEBUTTONUP:
                mouse_clicked = False
            elif event.type == pygame.MOUSEMOTION and mouse_clicked:
                mouse_pos = pygame.mouse.get_pos()
        
        # Get keyboard state
        keys = pygame.key.get_pressed()
        
        # Move bird
        bird.move(keys, mouse_pos, mouse_clicked)
        
        # Spawn new balloons
        if current_time - balloon_spawn_timer > balloon_spawn_delay:
            balloons.append(Balloon())
            balloon_spawn_timer = current_time
        
        # Move balloons
        for balloon in balloons:
            balloon.move()
        
        # Check for collisions
        bird_rect = bird.get_rect()
        for balloon in balloons:
            if not balloon.popped and bird_rect.colliderect(balloon.get_rect()):
                if balloon.pop():
                    score += 1
                    popped_balloons.append(balloon)
        
        # Remove balloons that are off screen
        balloons = [b for b in balloons if not b.is_off_screen()]
        
        # Remove popped balloons after animation
        current_time = pygame.time.get_ticks()
        for balloon in popped_balloons[:]:
            if current_time - balloon.pop_time > 500:  # 500ms for pop animation
                if balloon in balloons:
                    balloons.remove(balloon)
                popped_balloons.remove(balloon)
        
        # Draw everything
        screen.fill(WHITE)
        
        # Draw clouds (simple background)
        for i in range(3):
            cloud_x = (WIDTH // 3) * i + 50
            cloud_y = 50 + (i * 20)
            pygame.draw.ellipse(screen, (230, 230, 230), (cloud_x, cloud_y, 100, 50))
            pygame.draw.ellipse(screen, (230, 230, 230), (cloud_x + 25, cloud_y - 20, 80, 50))
            pygame.draw.ellipse(screen, (230, 230, 230), (cloud_x + 50, cloud_y, 100, 50))
        
        # Draw balloons
        for balloon in balloons:
            balloon.draw(screen)
        
        # Draw bird
        bird.draw(screen)
        
        # Draw score
        score_text = score_font.render(f"Score: {score}/{target_score}", True, BLACK)
        screen.blit(score_text, (10, 10))
        
        # Check win condition
        if score >= target_score:
            pygame.display.update()
            show_win_screen(score)
            # Reset game
            bird = Bird()
            balloons = []
            score = 0
            balloon_spawn_timer = pygame.time.get_ticks()
        
        pygame.display.update()
        clock.tick(60)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main() 