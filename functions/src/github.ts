import axios from 'axios'

import { organization, githubToken } from './config'

const GITHUB_BASE = 'https://api.github.com'

export default async (githubAccount: string): Promise<boolean> => {
  const ghRequest = axios.create({
    baseURL: GITHUB_BASE,
    headers: {
      'Authorization': `token ${githubToken}`,
      'User-Agent': `${organization}-Invite`,
    },
  })

  console.log('trying to add github member')

  try {
    await ghRequest.put(`/orgs/${organization}/memberships/${githubAccount}`)
    return true
  } catch (e) {
    try {
      await ghRequest.get(`/orgs/${organization}/members/${githubAccount}`)
      return true
    } catch (e) {
      return false;
    }
  }
}
