#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 递归拷贝
function copyRecursive(src, dest) {
  if (fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 检测包管理器
function detectPackageManager() {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
  return 'npm';
}

// 初始化流程
(function init() {
  const packageDir = path.join(__dirname, '..'); 
  const srcDir = path.join(packageDir, 'src');   // 当前主题包里的 src
  const targetDir = path.join(process.cwd(), 'src'); // 用户项目里的 src

  console.log('📂 正在复制 src 文件夹...');
  copyRecursive(srcDir, targetDir);

  console.log('✅ src 已复制到你的项目');

  const pm = detectPackageManager();
  console.log(`📦 使用 ${pm} 安装依赖...`);
  try {
    execSync(`${pm} install`, { stdio: 'inherit' });
    console.log('🎉 初始化完成！可以运行 dev 了 🚀');
  } catch (err) {
    console.error('❌ 依赖安装失败，请手动运行 install');
  }
})();
