#!/usr/bin/env node
/**
 * CI 发布脚本：bump patch 版本，提交并打 tag，推送到 origin。
 * 依赖环境变量 GITHUB_TOKEN、GITHUB_REPOSITORY。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) {
  console.error('Missing GITHUB_REPOSITORY or GITHUB_TOKEN');
  process.exit(1);
}

const root = path.resolve(__dirname, '../..');
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const remote = `https://x-access-token:${token}@github.com/${repo}.git`;
execSync('git remote set-url origin ' + remote, { cwd: root, stdio: 'inherit' });
execSync('git config user.name "github-actions[bot]"', { cwd: root, stdio: 'inherit' });
execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd: root, stdio: 'inherit' });

execSync('git add package.json', { cwd: root, stdio: 'inherit' });
if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) {
  execSync('git add pnpm-lock.yaml', { cwd: root, stdio: 'inherit' });
}
execSync(`git commit -m "chore: release v${newVersion}"`, { cwd: root, stdio: 'inherit' });
execSync(`git tag v${newVersion}`, { cwd: root, stdio: 'inherit' });
execSync('git push origin main', { cwd: root, stdio: 'inherit' });
execSync('git push origin --tags', { cwd: root, stdio: 'inherit' });

console.log('Released v' + newVersion);
