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
  const packageDir = path.join(__dirname, '..'); 
  const filesToCopy = [
    'astro.config.mjs',
    'starread.config.ts',
    'package.json',
    'tsconfig.json',
    'README.md',
    'LICENSE',
    'public',
    'scripts',
    'src'
  ];

  filesToCopy.forEach(name => {
    const srcPath = path.join(packageDir, name);
    const destPath = path.join(process.cwd(), name);

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
      console.log('\nℹ️  你选择了不安装依赖。稍后可以手动运行以下命令安装依赖：');
      console.log('   npm install 或者 pnpm install / yarn install / cnpm install\n');
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
        execSync(`${pm} install`, { stdio: 'inherit' });
        console.log('\n🎉 初始化完成！你可以运行以下命令启动项目：');
        console.log(`   ${pm} run dev 🚀\n`);
      } catch (err) {
        console.error('\n❌ 依赖安装失败，请手动运行 install\n');
      }
      rl.close();
    });
  });
})();
