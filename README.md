# 🎵 Music Games 

A responsive interactive web application centered around music education through gamification, built with HTML, CSS, and JavaScript.

## 📋 Overview

**Music Games** is an engaging platform designed to make learning music theory enjoyable through interactive games. This project was developed as part of a Frontend Development assignment, demonstrating proficient use of HTML, CSS, and JavaScript to create a fully functional game platform with user authentication, multiple game modes, and leaderboards.

## 💻 Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Local Storage for data persistence
- Font Awesome for icons
- Custom animations and transitions

## ✨ Key Features

- **User Authentication System** - Register, login, and profile management
- **Multiple Game Modes**:
  - Piano Memory Game - Test your memory and musical ear
  - Note Bubble Game - Improve reflexes by catching falling musical notes
- **Leaderboard System** - Track high scores across all users
- **Achievement System** - Earn medals and level up based on performance
- **Responsive Design** - Works on all device sizes
- **RTL Support** - Full Hebrew language support

## 📁 Project Structure

```
/
├── Games/
│   ├── pictures/           # Game images and assets
│   └── sounds/             # Audio files for game effects
│   
├── Main/
│   ├── main_css/           # Main application CSS
│   ├── main_html/          # Main application HTML pages
│   └── main_js/            # Main application JavaScript
│   
└── games/
    ├── games_css/          # Game-specific CSS
    │   ├── LogicGame-styles_1.css  # Piano memory game styles
    │   ├── MoveGame-styles.css     # Bubble game styles
    │   └── leaderboard-styles.css  # Leaderboard styles
    │
    ├── games_html/         # Game HTML pages
    │   ├── LogicGame_1.html        # Piano memory game
    │   ├── MoveGame.html           # Bubble game
    │   ├── leaderboard_logicGame.html
    │   └── leaderboard_moveGame.html
    │
    └── games_js/           # Game JavaScript
        ├── LogicGame_1_class.js    # Piano game class definition
        ├── LogicGame_1_events.js   # Piano game event handlers
        ├── MoveGame_class.js       # Bubble game class definition
        ├── MoveGame_events.js      # Bubble game event handlers
        ├── leaderboard_LogicGame.js
        └── leaderboard_MoveGame.js
```

## 📸 Screenshots
### LogIn Page 
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/home_page.png" width="80%">
</p>

### Register Page 
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/register.png" width="80%">
</p>

### Games Board Page
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/game_board_page.png" width="80%">
</p>

### Piano Game Page
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/piano_game_page.png" width="80%">
</p>

### Bubbles Game Page
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/bubbles_game_page.png" width="80%">
</p>

### Leaderboard Page
<p align="left">
<img src="https://github.com/Tehila-David/Gaming_Website/blob/main/Screenshots/leaderboard_page.png" width="80%">
</p>



## 🎮 Game Modes

### Piano Memory Game
- Listen to a musical sequence and repeat it on the virtual piano
- Difficulty increases with each level
- Features famous songs that players must recreate from memory

### Music Note Bubble Game
- Catch falling musical note bubbles before they disappear
- Speed increases with each level
- Features colorful animations and sound effects

## 🏆 Achievement System

Players earn medals and level up based on their performance:
- Beginner  - Starting level
- Skilled - Earned after reaching 3 medals
- Expert - Earned after reaching 6 medals
- Champion - Earned after reaching 9 medals

