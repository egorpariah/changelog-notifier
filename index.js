const core = require('@actions/core');
const github = require('@actions/github');
const locale = require('./locale.json');

try {
  const prefixes = core.getMultilineInput('prefixes');
  const { repo } = github.context.repo;
  const commits = github.context.payload.commits;

  let changelogText = '';
  changelogText += `*${repo}*\n\n`;

  for (const prefix of prefixes) {
    for (const commit of commits) {
      const isCommitMessageHasPrefix = commit.message.includes(prefix);
      if (isCommitMessageHasPrefix) {
        if (!changelogText.includes(locale.prefixes[prefix])) {
          changelogText += `*${locale.prefixes[prefix]}*\n`;
        }
        
        let firstLine = commit.message.slice(0, commit.message.indexOf('\n'));
        firstLine = firstLine.replace(`${prefix}:`, locale.emojis[prefix]);
        changelogText += `${firstLine} \\(${commit.author.username}\\)\n`;
      }
    }

    changelogText += '\n';
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
