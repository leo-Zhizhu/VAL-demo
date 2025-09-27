// Main Story Configuration
// This file manages all character story configurations and provides a unified interface

import { erenStoryPoints, type StoryPoint, type StoryPointContent } from './config/erenConfig'
import { mikasaStoryPoints } from './config/mikasaConfig'

// Character story mappings
export const characterStories = {
  'Eren Yeager': erenStoryPoints,
  'Mikasa Ackerman': mikasaStoryPoints,
  'Armin Arlert': erenStoryPoints, // Using Eren's config as placeholder
  'Levi Ackerman': erenStoryPoints, // Using Eren's config as placeholder
  'Historia Reiss': erenStoryPoints  // Using Eren's config as placeholder
}

// Get story points for a specific character
export const getStoryPointsForCharacter = (characterName: string): StoryPoint[] => {
  return characterStories[characterName as keyof typeof characterStories] || erenStoryPoints
}

// Get current story point data for a character
export const getCurrentStoryData = (characterName: string, storyIndex: number): StoryPoint | null => {
  const stories = getStoryPointsForCharacter(characterName)
  return stories[storyIndex] || null
}

// Get total number of story points for a character
export const getTotalStoryPointsForCharacter = (characterName: string): number => {
  const stories = getStoryPointsForCharacter(characterName)
  return stories.length
}

// Validate story point index for a character
export const isValidStoryPointIndex = (characterName: string, index: number): boolean => {
  const stories = getStoryPointsForCharacter(characterName)
  return index >= 0 && index < stories.length
}

// Re-export types for convenience
export type { StoryPoint, StoryPointContent }
