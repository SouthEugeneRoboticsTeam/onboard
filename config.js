const { env } = process

const config = {
  frontend: 'https://github.sert2521.org',
  backend: 'https://sert-github-invite.herokuapp.com',
  organization: 'SouthEugeneRoboticsTeam',
  domain: '4j.lane.edu',
  token: '',
}

module.exports = {
  frontend: env.INVITE_FRONTEND || config.frontend,
  backend: env.INVITE_BACKEND || config.backend,
  organization: env.INVITE_ORGANIZATION || config.organization,
  domain: env.INVITE_DOMAIN || config.domain,
  token: env.GITHUB_TOKEN || config.token,
}
