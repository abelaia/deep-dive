export const storyState = {
  fish: 0,
  snow: 0,
  bubbles: 0,
  light: 0,
  waves: 0,
  under: 0,
  whale: 0,
  sonar: 0,
  deep: 0,
  depth: 0,
  crack: 0,
  motes: 0,
  sparks: 0,
  speed: 0,
}

export type StoryState = typeof storyState

export const resetStoryState = () => {
  for (const key of Object.keys(storyState) as (keyof StoryState)[]) storyState[key] = 0
}
