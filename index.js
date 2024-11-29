const core = require("@actions/core");
const github = require("@actions/github");

async function parseGitDiff(keywords) {
  const token = core.getInput("repo-token");
  const octokit = github.getOctokit(token);
  const context = github.context;

  const base = context.payload.pull_request.base.sha;
  const head = context.payload.pull_request.head.sha;

  const response = await octokit.repos.compareCommitsWithBasehead({
    owner: context.repo.owner,
    repo: context.repo.repo,
    basehead: `${base}...${head}`,
  });

//   todo test workflow
  const files = response.data.files;
  for (const file of files) {
    const patch = file.patch;
    for (const keyword of keywords) {
      if (patch.includes(keyword)) {
        core.info(`Keyword "${keyword}" found in file: ${file.filename}`);

        await octokit.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.payload.pull_request.number,
          labels: [keyword],
        });
      }
    }
  }
}

try {
  const keywords = JSON.parse(core.getInput("keywords"));
  parseGitDiff(keywords);
} catch (error) {
  core.setFailed(error.message);
}
