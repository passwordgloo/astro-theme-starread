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
    'index.js',
    'tsconfig.json',
    'README.md',
    'LICENSE',
    'public',
    'CHANGELOG.md',
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

  // 交互式依赖安装 - 使用键盘上下键选择
  function selectOption(question, options, defaultIndex = 0) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // 启用原始模式以便捕获方向键
      process.stdin.setRawMode(true);
      
      let selectedIndex = defaultIndex;
      let isFirstDisplay = true;
      
      // 清除当前行
      function clearLine() {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
      }
      
      // 显示选项
      function displayOptions() {
        // 只有在第一次显示时才添加换行
        if (isFirstDisplay) {
          console.log();
          isFirstDisplay = false;
        } else {
          // 清除之前的显示内容
          const totalLines = options.length + 2; // 选项行数 + 问题行 + 提示行
          for (let i = 0; i < totalLines; i++) {
            readline.cursorTo(process.stdout, 0);
            readline.moveCursor(process.stdout, 0, -1);
            readline.clearLine(process.stdout, 0);
          }
        }
        
        // 显示问题
        console.log(`\x1b[1m${question}\x1b[0m`);
        
        // 显示选项
        options.forEach((option, index) => {
          const isSelected = index === selectedIndex;
          // 使用ANSI转义序列高亮显示选中项（不使用底纹）
          const prefix = isSelected ? '\x1b[36m▶\x1b[0m' : '  ';
          const optionText = isSelected ? `\x1b[1;36m${option}\x1b[0m` : option;
          console.log(`${prefix} ${optionText}`);
        });
        
        // 显示提示信息
        console.log('\x1b[33m按 Enter 确认选择，使用 ↑ ↓ 键切换选项\x1b[0m');
      }
      
      // 处理键盘输入
      process.stdin.on('keypress', (chunk, key) => {
        // 处理Enter键
        if (key && key.name === 'return') {
          process.stdin.setRawMode(false);
          rl.close();
          
          // 清除提示信息
          const totalLines = options.length + 2; // 选项行数 + 问题行 + 提示行
          for (let i = 0; i < totalLines; i++) {
            readline.cursorTo(process.stdout, 0);
            readline.moveCursor(process.stdout, 0, -1);
            readline.clearLine(process.stdout, 0);
          }
          
          resolve(selectedIndex);
          return;
        }
        
        // 处理向上键
        if (key && key.name === 'up') {
          selectedIndex = Math.max(0, selectedIndex - 1);
          displayOptions();
          return;
        }
        
        // 处理向下键
        if (key && key.name === 'down') {
          selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
          displayOptions();
          return;
        }
      });
      
      displayOptions();
    });
  }

  // 询问是否安装依赖
  selectOption('👉 是否要立即安装依赖？', ['是 (默认)', '否'])
    .then(async (installChoice) => {
      const installNow = installChoice === 0;
      
      if (!installNow) {
        console.log('\nℹ️  你选择了不安装依赖。稍后可以手动运行以下命令安装依赖：');
        console.log('   npm install 或者 pnpm install / yarn install / cnpm install\n');
        process.exit(0);
      }
      
      // 选择包管理器
      const pmOptions = ['npm (默认)', 'pnpm', 'yarn', 'cnpm'];
      const pmChoice = await selectOption('👉 请选择包管理器：', pmOptions);
      
      const pmMap = ['npm', 'pnpm', 'yarn', 'cnpm'];
      const pm = pmMap[pmChoice];
      
      console.log(`\n📦 使用 ${pm} 安装依赖中...\n`);
      try {
        execSync(`${pm} install`, { stdio: 'inherit' });
        console.log('\n🎉 初始化完成！你可以运行以下命令启动项目：');
        console.log(`   ${pm} run dev 🚀\n`);
      } catch (err) {
        console.error('\n❌ 依赖安装失败，请手动运行 install\n');
      }
    });

})();
