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
        changelogText += `• ${commit.message} \\(${commit.author.username}\\)\n`;
      }
    }

    changelogText += '\n\n';
  }

  const TOKEN = core.getInput('TOKEN');
  const CHAT_ID = core.getInput('CHAT_ID');

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const urlSearchParams = new URLSearchParams({
    chat_id: CHAT_ID,
    text: changelogText,
    parse_mode: 'MarkdownV2',
  });

  fetch(url + '?' + urlSearchParams.toString()).then(async response => {
    if (!response.ok) {
      const { description } = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, description: ${description}`
      );
    }
  });
} catch (error) {
  core.setFailed(error.message);
}
