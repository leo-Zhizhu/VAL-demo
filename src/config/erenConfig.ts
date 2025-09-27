// Eren Yeager Story Configuration
// This file contains Eren's story point data, making it easy to manage and update content

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

export const erenStoryPoints: StoryPoint[] = [
  {
    id: 'child-of-darkness',
    title: 'Child of Darkness',
    subtitle: 'The weight of inherited sins',
    content: {
      type: 'music',
      mediaPath: '/resources/Akuma-no-Ko/a/a1.mp3',
      imagePath: '/resources/Akuma-no-Ko/d/d1.jpg',
      info: 'This haunting melody captures the essence of a soul burdened by inherited darkness. The composition weaves together themes of destiny, choice, and the weight of family legacy.'
    }
  },
  {
    id: 'cycle-of-hatred',
    title: 'The Cycle of Hatred',
    subtitle: 'Enemy and victim intertwined',
    content: {
      type: 'image',
      mediaPath: '/resources/Akuma-no-Ko/p/p1.png',
      info: 'A powerful visual representation of the endless cycle of violence and revenge. The artwork depicts how victims can become perpetrators, and how hatred perpetuates itself across generations.'
    }
  },
  {
    id: 'fragile-humanity',
    title: 'Fragile Humanity',
    subtitle: 'Love and hate in the same heart',
    content: {
      type: 'video',
      mediaPath: '/resources/Akuma-no-Ko/v/v1.mp4',
      info: 'This video explores the delicate balance between love and hate within the human heart. It shows how even the strongest emotions can coexist, creating internal conflict and external consequences.'
    }
  },
  {
    id: 'weight-of-choice',
    title: 'The Weight of Choice',
    subtitle: 'Freedom at any cost',
    content: {
      type: 'music',
      mediaPath: '/resources/Akuma-no-Ko/a/a2.mp3',
      imagePath: '/resources/Akuma-no-Ko/d/d1.jpg',
      info: 'A musical journey through the burden of making difficult choices. The melody reflects the internal struggle of deciding between personal desires and greater good, with each note representing a moment of decision.'
    }
  },
  {
    id: 'monster-within',
    title: 'The Monster Within',
    subtitle: 'Becoming what you feared',
    content: {
      type: 'image',
      mediaPath: '/resources/Akuma-no-Ko/p/p2.png',
      info: 'This striking image reveals the transformation that occurs when one becomes the very thing they once feared. It\'s a visual metaphor for how fighting monsters can turn you into one yourself.'
    }
  },
  {
    id: 'glimmer-of-hope',
    title: 'A Glimmer of Hope',
    subtitle: 'Beyond the hatred',
    content: {
      type: 'video',
      mediaPath: '/resources/Akuma-no-Ko/v/v2.mp4',
      info: 'The final piece shows that even in the darkest moments, there is always a glimmer of hope. This video represents the possibility of breaking free from cycles of violence and finding peace.'
    }
  }
]
