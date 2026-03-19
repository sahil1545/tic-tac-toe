# Tic-Tac-Toe Game

A modern, responsive, and accessible Tic-Tac-Toe game built with vanilla JavaScript, HTML5, and CSS3.

## Features

- 🎮 **Game Modes**: Player vs Player and Player vs Computer
- ⌨️ **Keyboard Navigation**: Full keyboard support with arrow keys and shortcuts
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- 💾 **Persistent Scores**: Scores are saved in localStorage
- ♿ **Accessibility**: ARIA labels, semantic HTML, and screen reader support
- ✨ **Modern Animations**: Smooth transitions and beautiful visual effects
- 🔒 **Security Ready**: Production-ready with security headers

## How to Play

### Mouse/Touch
- Click any empty box to make your move
- Use the control buttons to reset or undo moves

### Keyboard
- **Arrow Keys**: Navigate the game board
- **Enter/Space**: Select the current box
- **Escape**: Undo last move
- **R**: Reset the current game

## Game Rules

1. Players take turns placing X's and O's on the 3x3 grid
2. The first player to get 3 in a row (horizontal, vertical, or diagonal) wins
3. If all 9 boxes are filled without a winner, it's a draw

## Development

### Local Development
```bash
# Start a local development server
npm run dev

# Or use Python
python -m http.server 3000
```

### Deployment
This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The `vercel.json` configuration includes:
- Static file serving
- Security headers
- Cache optimization
- Proper routing

## File Structure

```
tic-tac-toe/
├── tic.html          # Main HTML file
├── tac.css           # Styles and animations
├── toe.js            # Game logic and interactions
├── vercel.json       # Vercel deployment configuration
├── package.json      # Project metadata
└── README.md         # This file
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Security

- XSS protection headers
- Content Security Policy ready
- No external dependencies (except CDN icons)
- Input validation and sanitization

## License

MIT License - feel free to use this project for learning or commercial purposes.
