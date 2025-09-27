// Mikasa Ackerman Story Configuration
// This file contains Mikasa's story point data, making it easy to manage and update content

export interface StoryPointContent {
  type: 'music' | 'image' | 'video'
  mediaPath: string
  imagePath?: string // For music content
  info: string
}

export interface StoryPoint {
  id: string
  title: string
  subtitle: string
  content: StoryPointContent
}

export const mikasaStoryPoints: StoryPoint[] = [
  {
    id: 'a-place-of-innocence',
    title: 'A Place of Innocence',
    subtitle: 'Where bonds were first formed',
    content: {
      type: 'music',
      mediaPath: '/resources/Under-the-tree/a/a1.mp3',
      imagePath: '/resources/Under-the-tree/d/d1.jpg',
      info: 'The tree symbolizes childhood, friendship, and the fleeting peace that existed before the world’s cruelty tore it apart.'
    }
  },
  {
    id: 'waiting-for-someone',
    title: 'Waiting for Someone',
    subtitle: 'Longing in silence',
    content: {
      type: 'image',
      mediaPath: '/resources/Under-the-tree/p/p1.jpg',
      info: 'Under the tree, one waits endlessly for the person they love and cherish, hoping their promise will not be broken by time or fate.'
    }
  },
  {
    id: 'love-amid-despair',
    title: 'Love Amid Despair',
    subtitle: 'Holding onto warmth',
    content: {
      type: 'video',
      mediaPath: '/resources/Under-the-tree/v/v1.mp4',
      info: 'Even in a world full of violence and destruction, the memory of companionship offers strength to endure the unbearable.'
    }
  },
  {
    id: 'the-eternal-witness',
    title: 'The Eternal Witness',
    subtitle: 'The tree remembers',
    content: {
      type: 'video',
      mediaPath: '/resources/Under-the-tree/v/v2.mp4',
      info: 'Standing tall through generations, the tree holds the stories of joy, grief, and sacrifice, becoming a symbol of memory and eternity.'
    }
  }
]

// Helper function to get story point by index
export const getMikasaStoryPointByIndex = (index: number): StoryPoint | null => {
  return mikasaStoryPoints[index] || null
}

// Helper function to get total number of story points
export const getMikasaTotalStoryPoints = (): number => {
  return mikasaStoryPoints.length
}

// Helper function to validate story point index
export const isValidMikasaStoryPointIndex = (index: number): boolean => {
  return index >= 0 && index < mikasaStoryPoints.length
}
