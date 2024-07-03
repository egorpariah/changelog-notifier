const core = require('@actions/core');
const github = require('@actions/github');
const locale = require('./locale.json');

try {
  const prefixes = core.getMultilineInput('prefixes');
  const commits = github.context.payload.commits;
  let changelogText = '';

  for (const prefix of prefixes) {
    changelogText += `*${locale[prefix]}*\n\n`;

    for (const commit of commits) {
      const isCommitMessageHasPrefix = commit.message.includes(prefix);
      if (isCommitMessageHasPrefix) {
        changelogText += `• ${commit.message} (${commit.author.username})\n`;
      }
    }

    changelogText += '\n\n\n';
  }

  core.info(changelogText);
} catch (error) {
  core.setFailed(error.message);
}
