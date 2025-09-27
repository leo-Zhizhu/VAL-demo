// Color Theme System
// This file defines the color theme interface and manages character-specific themes

import { erenTheme } from './erenTheme'
import { mikasaTheme } from './mikasaTheme'

export interface ColorTheme {
  // Part 1 (Header) colors
  part1: {
    background: string
    title: string
    subtitle: string
  }
  
  // Part 2 (Main Content) colors
  part2: {
    background: string
    contentTypeIndicator: {
      background: string
      text: string
      button: string
    }
  }
  
  // Part 3 (Story Navigation) colors
  part3: {
    background: string
    title: string
    subtitle: string
    dots: {
      active: string
      adjacent: string
      inactive: string
    }
  }
  
  // Part 4 (Audio Controls) colors
  part4: {
    background: string
    title: string
    timeText: string
    progressBar: {
      track: string
      fill: string
      thumb: string
    }
    playButton: {
      background: string
      hover: string
    }
  }
  
  // Modal colors
  modal: {
    backdrop: string
    background: string
    title: string
    subtitle: string
    content: string
    closeButton: string
  }
  
  // Focused mode colors
  focusedMode: {
    backdrop: string
    audioDock: {
      background: string
      title: string
      timeText: string
      progressBar: {
        track: string
        fill: string
        thumb: string
      }
      playButton: {
        background: string
        hover: string
      }
    }
  }
}

// Character theme mappings
export const characterThemes = {
  'Eren Yeager': erenTheme,
  'Mikasa Ackerman': mikasaTheme,
  'Armin Arlert': erenTheme, // Using Eren's theme as placeholder
  'Levi Ackerman': erenTheme, // Using Eren's theme as placeholder
  'Historia Reiss': erenTheme  // Using Eren's theme as placeholder
}

// Get theme for a specific character
export const getThemeForCharacter = (characterName: string): ColorTheme => {
  return characterThemes[characterName as keyof typeof characterThemes] || erenTheme
}
