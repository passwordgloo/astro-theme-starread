#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ========================
//   STARREAD LOGO
// ========================
console.log(`
███████╗████████╗ █████╗  ██████╗      ██████╗ ███████╗ █████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗ ██╔══██╗     ██╔══██╗██╔════╝██╔══██╗██╔══██╗ 
███████╗   ██║   ███████║ ██████╔╝     ██████╔╝█████╗  ███████║██║  ██║
╚════██║   ██║   ██╔══██║ ██╔══██╗     ██╔══██╗██╔══╝  ██╔══██║██║  ██║
███████║   ██║   ██║  ██║ ██║  ██║     ██║  ██║███████╗██║  ██║██████╔╝    
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
`);

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

// 初始化流程
(function init() {
  // 支持 pnpm create astro-theme-starread my-blog
  const targetDir = process.argv[2] || '.'; // 没传参数就在当前目录
  const targetPath = path.resolve(process.cwd(), targetDir);

  // 如果目录不存在则创建
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const packageDir = path.join(__dirname, '..'); 
  const filesToCopy = [
    'astro.config.mjs',
    'starread.config.ts',
    'package.json',
    'tsconfig.json',
    'index.js',
    'index.d.ts',
    'README.md',
    'LICENSE',
    'public',
    'src'
  ];

  filesToCopy.forEach(name => {
    const srcPath = path.join(packageDir, name);
    const destPath = path.join(targetPath, name);

    console.log(`📂 正在复制 ${name} ...`);
    copyRecursive(srcPath, destPath);
  });

  console.log('✅ 所有文件已复制到你的项目目录！');

  // 交互式依赖安装
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('👉 是否要立即安装依赖？ (y/n，默认 y): ', (answer) => {
    const installNow = answer.trim() === '' || answer.toLowerCase() === 'y';
    if (!installNow) {
      console.log('\nℹ️  你选择了不安装依赖。稍后可以手动运行安装命令：');
      console.log(`   cd ${targetDir} && npm install 或 pnpm install / yarn install / cnpm install\n`);
      rl.close();
      return;
    }

    rl.question('👉 请选择包管理器 (pnpm / cnpm / npm / yarn，默认 npm): ', (pm) => {
      pm = pm.trim() === '' ? 'npm' : pm;  // 默认 npm
      const validPMs = ['pnpm', 'cnpm', 'npm', 'yarn'];
      if (!validPMs.includes(pm)) {
        console.log('\n❌ 无效的选择，请手动安装依赖。\n');
        rl.close();
        return;
      }

      console.log(`\n📦 使用 ${pm} 安装依赖中...\n`);
      try {
        execSync(`${pm} install`, { cwd: targetPath, stdio: 'inherit' });
        console.log('\n🎉 初始化完成！你可以运行以下命令启动项目：');
        console.log(`   cd ${targetDir}`);
        console.log(`   ${pm} run dev 🚀\n`);
      } catch (err) {
        console.error('\n❌ 依赖安装失败，请手动运行安装命令\n');
      }
      rl.close();
    });
  });
})();
