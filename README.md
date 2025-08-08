# Lofi YouTube Player

A beautiful, minimalist lofi music player that streams live YouTube radio stations with a reactive waveform visualization.

# Live app: [lofiiplayer](https://lofiiplayer.netlify.app/)

## Features

- 🎵 **6 Live Lofi Radio Stations** - Curated selection of the best lofi streams
- 🎨 **Reactive Waveform** - Beautiful animated visualization that responds to music
- 🎛️ **Simple Controls** - Play/pause, previous/next, volume control
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Minimalist UI** - Clean, distraction-free interface
- ⌨️ **Keyboard Shortcuts** - Full keyboard control (Space/K for play, arrows for navigation, etc.)

## Radio Stations (via lofi girl)

1. **Live Lofi - 24/7 chill beats** (Default)
2. **lofi hip hop radio - beats to relax/study to**
3. **synthwave radio - beats to chill/game to**
4. **jazz/lofi hip hop radio - beats to relax/study to**
5. **lofi hip hop radio - beats to sleep/chill to**
6. **chillhop radio - jazzy & lofi hip hop beats**

## File Structure

```
Lofi/
├── index.html      # Main HTML file
├── styles.css      # All CSS styles
├── script.js       # JavaScript functionality
├── stations.js     # Radio stations configuration
└── README.md       # This documentation
```

## How to Use

1. **Open** `index.html` in your web browser
2. **Click the play button** to start the default station
3. **Use the menu** (top-left chevron) to switch between stations
4. **Adjust volume** by clicking the speaker icon
5. **Navigate** with previous/next buttons or keyboard shortcuts
6. **Go fullscreen** by pressing 'F'

## Controls

### Mouse/Touch Controls
- **Play/Pause**: Center button
- **Previous Station**: Left arrow button
- **Next Station**: Right arrow button
- **Volume**: Speaker icon (click to show slider)
- **Station Menu**: Top-left chevron icon

### Keyboard Shortcuts
- **Space** or **K**: Play/Pause
- **←** (Left Arrow) or **J**: Previous Station
- **→** (Right Arrow) or **L**: Next Station
- **M**: Toggle Station Menu
- **F**: Toggle Fullscreen
- **↑** (Up Arrow) or **=**: Volume Up
- **↓** (Down Arrow) or **-**: Volume Down
- **0**: Mute/Unmute (remembers previous volume)

## Technical Details

- **YouTube API**: Uses YouTube's iframe API for streaming
- **Canvas Animation**: Custom waveform visualization with beat simulation
- **Responsive Design**: CSS Grid and Flexbox for layout
- **Smooth Animations**: CSS transitions and JavaScript animations
- **Cross-browser**: Works on all modern browsers

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Development

The project is organized into separate files for better maintainability:

- **HTML**: Structure and content
- **CSS**: All styling and animations
- **JavaScript**: Player logic and waveform generation
- **Stations**: Radio station configuration

### Adding New Radio Stations

To add new radio stations, edit the `stations.js` file:

1. Find a YouTube live stream or video ID
2. Add a new entry to the `STATIONS` array:
   ```javascript
   { 
     id: 'YouTubeVideoID', 
     name: 'Your Station Name' 
   }
   ```
3. The first station (index 0) will be the default station
4. Save the file and refresh the page

## License

This project is open source and available under the MIT License.

## Credits

- YouTube API for streaming
- Curated lofi radio stations from YouTube from Lofi Girl
- Custom waveform visualization
