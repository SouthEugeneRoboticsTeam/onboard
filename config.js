const { env } = process

const config = {
  frontend: 'https://github.sert2521.org',
  backend: 'http://localhost:5000/sert-invite/us-central1',
  domain: '4j.lane.edu',
  organization: 'SouthEugeneRoboticsTeam',
  driveFileId: '0ABcm_Gsh7ysQUk9PVA',
  githubToken: '',
  slackToken: '',
}

module.exports = {
  frontend: env.INVITE_FRONTEND || config.frontend,
  backend: env.INVITE_BACKEND || config.backend,
  organization: env.INVITE_ORGANIZATION || config.organization,
  domain: env.INVITE_DOMAIN || config.domain,
  driveFileId: env.DRIVE_FILE_ID || config.driveFileId,
  githubToken: env.GITHUB_TOKEN || config.githubToken,
  slackToken: env.SLACK_TOKEN || config.slackToken,
}
