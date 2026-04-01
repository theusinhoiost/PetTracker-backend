import slug from 'slug'
import { GenerationRandomSuffix } from './generate-random-suffix'
export function createSlugFromText(text: string) {
  const fullSlug = slug(text)
  return `${fullSlug}-${GenerationRandomSuffix()}`
}
