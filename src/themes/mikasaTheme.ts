// Mikasa Ackerman Color Theme
// Yellow, white, and orange color scheme

import { type ColorTheme } from './colorThemes'

export const mikasaTheme: ColorTheme = {
  // Part 1 (Header) - Warm theme with orange accents
  part1: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
    title: '#92400e',
    subtitle: '#a16207'
  },
  
  // Part 2 (Main Content) - Warm with yellow tones
  part2: {
    background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 30%, #fde68a 70%, #fffbeb 100%)',
    contentTypeIndicator: {
      background: 'rgba(245, 158, 11, 0.9)',
      text: '#ffffff',
      button: '#f59e0b'
    }
  },
  
  // Part 3 (Story Navigation) - Warm with orange highlights
  part3: {
    background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(253, 230, 138, 0.85) 50%, rgba(254, 243, 199, 0.75) 100%)',
    title: '#92400e',
    subtitle: '#a16207',
    dots: {
      active: '#f59e0b',
      adjacent: '#f97316',
      inactive: 'rgba(245, 158, 11, 0.3)'
    }
  },
  
  // Part 4 (Audio Controls) - Warm with orange accents
  part4: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
    title: '#92400e',
    timeText: '#a16207',
    progressBar: {
      track: '#d97706',
      fill: '#f59e0b',
      thumb: '#f59e0b'
    },
    playButton: {
      background: '#f59e0b',
      hover: '#d97706'
    }
  },
  
  // Modal - Warm theme
  modal: {
    backdrop: 'rgba(245, 158, 11, 0.3)',
    background: 'rgba(254, 243, 199, 0.95)',
    title: '#92400e',
    subtitle: '#a16207',
    content: '#78350f',
    closeButton: '#f59e0b'
  },
  
  // Focused mode - Warm with orange accents
  focusedMode: {
    backdrop: 'rgba(245, 158, 11, 0.4)',
    audioDock: {
      background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.98) 50%, rgba(254, 243, 199, 0.95) 100%)',
      title: '#92400e',
      timeText: '#a16207',
      progressBar: {
        track: '#d97706',
        fill: '#f59e0b',
        thumb: '#f59e0b'
      },
      playButton: {
        background: '#f59e0b',
        hover: '#d97706'
      }
    }
  }
}
