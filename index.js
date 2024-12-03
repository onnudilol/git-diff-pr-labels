const core = require("@actions/core");
const github = require("@actions/github");

async function parseGitDiff(keywords) {
  const token = core.getInput("github-token");

  const octokit = github.getOctokit(token);
  const context = github.context;

  const base = context.payload.pull_request.base.ref;
  const head = context.payload.pull_request.head.ref;

  const response = await octokit.rest.repos.compareCommitsWithBasehead({
    owner: context.repo.owner,
    repo: context.repo.repo,
    basehead: `${base}...${head}`,
  });

  const files = response.data.files;
  for (const keyword of keywords) {
    for (const file of files) {
      core.info(file.patch)
      const patch = file.patch.toLowerCase();
      if (patch.includes(keyword)) {
        core.info(`Keyword "${keyword}" found in file: ${file.filename}`);

        await octokit.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.payload.pull_request.number,
          labels: [keyword],
        });
        // todo test workflow
        break;
      }
    }
  }
}

try {
  const keywords = JSON.parse(core.getInput("keywords")).map(k => k.toLowerCase());
  parseGitDiff(keywords);
} catch (error) {
  core.setFailed(error.message);
}
