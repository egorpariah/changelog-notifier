const core = require('@actions/core');
const github = require('@actions/github');
const locale = require('./locale.json');

try {
  const prefixes = core.getMultilineInput('prefixes');
  const projectName = core.getInput('project_name');
  const { repo } = github.context.repo;
  const commits = github.context.payload.commits;

  let changelogText = '';
  changelogText += `*${projectName || repo}*\n\n`;

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

    if (changelogText.includes(locale.prefixes[prefix])) {
      changelogText += '\n';
    }
  }

  const token = core.getInput('token');
  const chatId = core.getInput('chat_id');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const urlSearchParams = new URLSearchParams({
    chat_id: chatId,
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
