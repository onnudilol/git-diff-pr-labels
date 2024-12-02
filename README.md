# Git Diff PR Labels

This GitHub Action automatically labels pull requests based on the changes detected in the diff.

## Features

- Automatically labels pull requests based on file changes.
- Customizable keywords.

## Usage

To use this action, add the following to your workflow YAML file:

```yaml
name: Label PRs

on:
    pull_request:
        types: [opened, synchronize]

jobs:
    label:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
                uses: actions/checkout@v2

            - name: Run Git Diff PR Labels
                uses: onnudilol/git-diff-pr-labels@v1
                with:
                    github-token: ${{ secrets.GITHUB_TOKEN }}
                    keywords: '["todo", "fixme", "bug"]'
```


## Inputs

- `github-token`: (required) GitHub token to authorize label changes.
- `keywords`: Array of strings in JSON format to label the PR when detected in the git diff

## License

This project is licensed under the MIT License.