const core = require('@actions/core');
const github = require('@actions/github');

try {
  const prefixes = core.getMultilineInput('prefixes');
  const commits = github.context.payload.commits;
  for (const commit of commits) {
    const isCommitMessageHasPrefix = prefixes.some(prefix =>
      commit.message.includes(prefix)
    );
    if (isCommitMessageHasPrefix) {
      console.log(commit.message);
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
