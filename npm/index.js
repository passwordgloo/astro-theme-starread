#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import readline from "node:readline";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);

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

// ========== 工具函数 ==========
let rl = null;
function getRl() {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return rl;
}
const ask = (q) => new Promise((res) => getRl().question(q, (a) => res(a)));
function closeRl() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

function copyRecursive(src, dest, mode = "overwrite") {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (file === "node_modules" || file === ".git") continue;
      copyRecursive(path.join(src, file), path.join(dest, file), mode);
    }
  } else {
    if (fs.existsSync(dest)) {
      if (mode === "skip") return; // 跳过已有文件
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// 找到 astro-theme-starread 包根目录
function resolveTemplateDir() {
  try {
    // 直接找 package.json 来定位包根目录（兼容无 index.js 的包）
    const pkgJsonPath = require.resolve("astro-theme-starread/package.json");
    return path.dirname(pkgJsonPath);
  } catch (err) {
    console.error("❌ 无法找到 `astro-theme-starread` 包。");
    console.error("   如果你的包开启了 exports 限制，请在 astro-theme-starread/package.json 中添加：");
    console.error(`
"exports": {
  "./package.json": "./package.json"
}
    `);
    console.error("错误详情:", err.message);
    process.exit(1);
  }
}

// 交互式依赖安装 - 使用键盘上下键选择
function selectOption(question, options, defaultIndex = 0) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      resolve(defaultIndex);
      return;
    }

    const rlInstance = getRl();
    readline.emitKeypressEvents(process.stdin, rlInstance);
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
    
    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('keypress', onKeypress);
    }
    
    // 处理键盘输入
    function onKeypress(chunk, key) {
      // 处理Enter键
      if (key && key.name === 'return') {
        const totalLines = options.length + 2; // 选项行数 + 问题行 + 提示行
        for (let i = 0; i < totalLines; i++) {
          readline.cursorTo(process.stdout, 0);
          readline.moveCursor(process.stdout, 0, -1);
          readline.clearLine(process.stdout, 0);
        }
        
        cleanup();
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
      
      // 处理 Ctrl+C
      if (key && key.ctrl && key.name === 'c') {
        cleanup();
        closeRl();
        process.exit(0);
      }
    }
    
    process.stdin.on('keypress', onKeypress);
    
    displayOptions();
  });
}

// ========== 主流程 ==========
(async function main() {
  const targetDirInput = process.argv[2] || "my-blog";
  const targetPath = path.resolve(process.cwd(), targetDirInput);
  const templateDir = resolveTemplateDir();

  let copyMode = "overwrite";
  if (fs.existsSync(targetPath)) {
    const files = fs.readdirSync(targetPath);
    if (files.length > 0) {
      const ans = (await ask(`⚠️  目录 "${targetDirInput}" 已存在且非空。覆盖 (y) / 跳过已有 (s) / 取消 (n) [默认 n]: `))
        .trim()
        .toLowerCase();
      if (ans === "y") copyMode = "overwrite";
      else if (ans === "s") copyMode = "skip";
      else {
        console.log("❌ 操作已取消。");
        closeRl();
        process.exit(0);
      }
    }
  } else {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log(`\n🚀 正在创建项目到: ${targetPath} （模式: ${copyMode}）`);
  copyRecursive(templateDir, targetPath, copyMode);
  console.log('✅ 所有文件已复制到你的项目目录！');

  // 询问是否安装依赖
  const installChoice = await selectOption('👉 是否要立即安装依赖？', ['是 (默认)', '否']);
  const installNow = installChoice === 0;
  
  if (!installNow) {
    console.log('\nℹ️  你选择了不安装依赖。稍后可以手动运行以下命令安装依赖：');
    console.log(`   cd ${targetDirInput}`);
    console.log('   npm install 或者 pnpm install / yarn install / cnpm install\n');
    closeRl();
    process.exit(0);
  }
  
  // 选择包管理器
  const pmOptions = ['npm (默认)', 'pnpm', 'yarn', 'cnpm'];
  const pmChoice = await selectOption('👉 请选择包管理器：', pmOptions);
  
  const pmMap = ['npm', 'pnpm', 'yarn', 'cnpm'];
  const pm = pmMap[pmChoice];
  
  console.log(`\n📦 使用 ${pm} 安装依赖中...\n`);
  try {
    execSync(`${pm} install`, { cwd: targetPath, stdio: 'inherit' });
    console.log('\n🎉 初始化完成！你可以运行以下命令启动项目：');
    console.log(`   cd ${targetDirInput}`);
    console.log(`   ${pm} run dev 🚀\n`);
  } catch (err) {
    console.error('\n❌ 依赖安装失败，请手动运行 install\n');
  } finally {
    closeRl();
  }
})();
