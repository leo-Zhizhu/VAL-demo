// Eren Yeager Color Theme
// Red, dark grey, and white color scheme

import { type ColorTheme } from './colorThemes'

export const erenTheme: ColorTheme = {
  // Part 1 (Header) - Dark theme with red accents
  part1: {
    background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #2c2c2c 100%)',
    title: '#dc2626',
    subtitle: '#ef4444'
  },
  
  // Part 2 (Main Content) - Dark with red accents
  part2: {
    background: 'linear-gradient(145deg, #1a1a1a 0%, #2c2c2c 30%, #1a1a1a 70%, #2c2c2c 100%)',
    contentTypeIndicator: {
      background: 'rgba(220, 38, 38, 0.9)',
      text: '#ffffff',
      button: '#dc2626'
    }
  },
  
  // Part 3 (Story Navigation) - Dark with red highlights
  part3: {
    background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.8) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(44, 44, 44, 0.75) 100%)',
    title: '#dc2626',
    subtitle: '#ef4444',
    dots: {
      active: '#dc2626',
      adjacent: '#ef4444',
      inactive: 'rgba(220, 38, 38, 0.3)'
    }
  },
  
  // Part 4 (Audio Controls) - Dark with red accents
  part4: {
    background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #2c2c2c 100%)',
    title: '#dc2626',
    timeText: '#ef4444',
    progressBar: {
      track: '#374151',
      fill: '#dc2626',
      thumb: '#dc2626'
    },
    playButton: {
      background: '#dc2626',
      hover: '#b91c1c'
    }
  },
  
  // Modal - Dark theme
  modal: {
    backdrop: 'rgba(0, 0, 0, 0.7)',
    background: 'rgba(26, 26, 26, 0.95)',
    title: '#dc2626',
    subtitle: '#ef4444',
    content: '#e5e7eb',
    closeButton: '#dc2626'
  },
  
  // Focused mode - Dark with red accents
  focusedMode: {
    backdrop: 'rgba(0, 0, 0, 0.8)',
    audioDock: {
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(44, 44, 44, 0.98) 50%, rgba(26, 26, 26, 0.95) 100%)',
      title: '#dc2626',
      timeText: '#ef4444',
      progressBar: {
        track: '#374151',
        fill: '#dc2626',
        thumb: '#dc2626'
      },
      playButton: {
        background: '#dc2626',
        hover: '#b91c1c'
      }
    }
  }
}
