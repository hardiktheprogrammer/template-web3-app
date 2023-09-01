import { env } from '@/env.mjs'

import { submitPassport } from './use-submit-passport'
import { ScoreResponse } from '../utils/types'

const GET_PASSPORT_SCORE_URI = 'https://api.scorer.gitcoin.co/registry/score'

export const getScore = async (address: string) => {
  // console.log('api key', env.NEXT_PUBLIC_GITCOIN_PASSPORT_API_KEY)
  await submitPassport(address)
  try {
    const response = await fetch(`${GET_PASSPORT_SCORE_URI}/${env.NEXT_PUBLIC_GITCOIN_PASSPORT_SCORER_ID}/${address}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.NEXT_PUBLIC_GITCOIN_PASSPORT_API_KEY,
      },
    })
    const passportData: ScoreResponse = await response.json()
    if (passportData.score) {
      // if the user has a score, round it and set it in the local state
      const roundedScore = Math.round(passportData.score * 100) / 100
      return roundedScore
    } else {
      // if the user has no score, display a message letting them know to submit thier passporta
      console.log('No score available, please add stamps to your passport and then resubmit.')
    }
  } catch (e) {
    const error = e as Error & { status?: number }
    throw new Error(`${error.message}`)
  }
}
