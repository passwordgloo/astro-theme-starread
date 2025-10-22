// 自定义CHANGELOG更新器，将版本标题从三级改为二级
module.exports = function (updaterConfig) {
  
  return {
    detectBreakingChanges: true,
    breakingPrefix: 'BREAKING CHANGE: ',
    header: `# Changelog
All notable changes to this project were written by foresee.
`,
    parseCommit: (commit) => commit,
    generateNotes: (commit, context) => {
      return commit;
    },
    writeChangelog: (changelog) => {
      // 将三级标题替换为二级标题
      return changelog.replace(/### \[/g, '## [');
    }
  };
};