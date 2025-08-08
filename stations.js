// Radio Stations Configuration
// Add new stations by following the format: { id: 'YouTubeVideoID', name: 'Station Name' }
// The first station (index 0) will be the default station

const STATIONS = [
  { 
    id: 'jfKfPfyJRdk', 
    name: 'Live Lofi - 24/7 chill beats' 
  },
  { 
    id: 'wAPCSnAhhC8', 
    name: 'lofi hip hop radio - beats to relax/study to' 
  },
  { 
    id: 'M8J9zHyyUYc', 
    name: 'lofi beats to do absolutely nothing to' 
  },
  { 
    id: '-FlxM_0S2lA', 
    name: 'jazz/lofi hip hop radio - beats to relax/study to' 
  },
  { 
    id: '_tV5LEBDs7w', 
    name: 'lofi hip hop radio - beats to sleep/chill to' 
  },
  { 
    id: 'BTYAsjAVa3I', 
    name: 'chillhop radio - jazzy & lofi hip hop beats' 
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STATIONS;
}
