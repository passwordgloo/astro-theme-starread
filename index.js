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
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a)));

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
        rl.close();
        process.exit(0);
      }
    }
  } else {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log(`\n🚀 正在创建项目到: ${targetPath} （模式: ${copyMode}）`);
  copyRecursive(templateDir, targetPath, copyMode);
  console.log("✅ 模板复制完成！");

  const installAns = (await ask("👉 是否要立即安装依赖？ (y/n，默认 y): ")).trim().toLowerCase();
  if (!(installAns === "" || installAns === "y")) {
    console.log("\nℹ️  你选择了不安装依赖，可以稍后手动运行：");
    console.log(`   cd ${targetDirInput}`);
    console.log("   npm install / pnpm install / yarn install / cnpm install");
    rl.close();
    process.exit(0);
  }

  let pm = (await ask("👉 请选择包管理器 (pnpm / cnpm / npm / yarn，默认 npm): ")).trim();
  if (!pm) pm = "npm";
  const validPMs = ["pnpm", "cnpm", "npm", "yarn"];
  if (!validPMs.includes(pm)) {
    console.log("\n❌ 无效的包管理器，退出。");
    rl.close();
    process.exit(1);
  }

  console.log(`\n📦 使用 ${pm} 安装依赖...`);
  try {
    execSync(`${pm} install`, { cwd: targetPath, stdio: "inherit" });
    console.log("\n🎉 项目初始化完成，运行以下命令启动：");
    console.log(`   cd ${targetDirInput}`);
    console.log(`   ${pm} run dev 🚀`);
  } catch {
    console.error("\n❌ 依赖安装失败，请手动安装后再运行。");
  }

  rl.close();
})();
