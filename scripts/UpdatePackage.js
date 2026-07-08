#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typewriter(text, speed = 30) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await delay(speed);
  }
  process.stdout.write("\n");
}

function printBanner() {
  console.log(`\x1b[36m
███████╗████████╗ █████╗  ██████╗      ██████╗ ███████╗ █████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗ ██╔══██╗     ██╔══██╗██╔════╝██╔══██╗██╔══██╗ 
███████╗   ██║   ███████║ ██████╔╝     ██████╔╝█████╗  ███████║██║  ██║
╚════██║   ██║   ██╔══██║ ██╔══██╗     ██╔══██╗██╔══╝  ██╔══██║██║  ██║
███████║   ██║   ██║  ██║ ██║  ██║     ██║  ██║███████╗██║  ██║██████╔╝    
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
\x1b[0m`);
}

const packageDir = path.join(__dirname, '..');

const userFiles = [
  { src: 'starread.config.ts', dest: 'starread.config.ts', type: 'config' },
  { src: 'astro.config.mjs', dest: 'astro.config.mjs', type: 'config' },
  { src: 'tsconfig.json', dest: 'tsconfig.json', type: 'config' },
  { src: 'README.md', dest: 'README.md', type: 'doc' },
  { src: 'LICENSE', dest: 'LICENSE', type: 'doc' },
];

async function updatePackage() {
  await printBanner();
  await typewriter("\x1b[35m✨ StarRead 主题更新向导\x1b[0m\n", 50);
  await delay(300);

  const currentDir = process.cwd();
  
  if (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    await typewriter("\x1b[31m❌ 错误：当前目录不是一个有效的项目目录\x1b[0m\n", 40);
    process.exit(1);
  }

  const pkgJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf-8'));
  if (!pkgJson.dependencies?.['astro-theme-starread']) {
    await typewriter("\x1b[31m❌ 错误：当前项目没有安装 astro-theme-starread\x1b[0m\n", 40);
    process.exit(1);
  }

  await typewriter("\x1b[34m📦 正在检查可用更新...\x1b[0m\n", 40);
  await delay(500);

  const themeVersion = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8')).version;
  const installedVersion = pkgJson.dependencies['astro-theme-starread'];

  await typewriter(`\x1b[36m当前安装版本：${installedVersion}\x1b[0m\n`, 30);
  await typewriter(`\x1b[36m可用版本：${themeVersion}\x1b[0m\n`, 30);
  await delay(300);

  for (const file of userFiles) {
    const srcPath = path.join(packageDir, file.src);
    const destPath = path.join(currentDir, file.dest);

    if (fs.existsSync(destPath)) {
      const destContent = fs.readFileSync(destPath, 'utf-8');
      const srcContent = fs.readFileSync(srcPath, 'utf-8');

      if (file.type === 'config') {
        const updatedContent = mergeConfig(srcContent, destContent);
        if (updatedContent !== destContent) {
          fs.writeFileSync(destPath, updatedContent);
          await typewriter(`\x1b[32m✅ 更新配置文件：${file.dest}\x1b[0m`, 30);
        } else {
          await typewriter(`\x1b[33mℹ️  配置文件已是最新：${file.dest}\x1b[0m`, 30);
        }
      } else {
        if (srcContent !== destContent) {
          fs.writeFileSync(destPath, srcContent);
          await typewriter(`\x1b[32m✅ 更新文件：${file.dest}\x1b[0m`, 30);
        } else {
          await typewriter(`\x1b[33mℹ️  文件已是最新：${file.dest}\x1b[0m`, 30);
        }
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
      await typewriter(`\x1b[32m✅ 创建文件：${file.dest}\x1b[0m`, 30);
    }
  }

  await delay(300);
  await typewriter("\n\x1b[32m🎉 更新完成！\x1b[0m\n", 50);
  await typewriter("\x1b[35m提示：\x1b[0m\n", 40);
  await typewriter("   如果配置结构有变化，请检查 starread.config.ts 并根据新结构调整你的配置\n", 30);
  await typewriter("   运行 pnpm install 确保依赖已更新\n", 30);
}

function mergeConfig(newConfig, oldConfig) {
  try {
    const newMatch = newConfig.match(/export const themeConfig: StarreadThemeConfig = ({[\s\S]*});/);
    const oldMatch = oldConfig.match(/export const themeConfig: StarreadThemeConfig = ({[\s\S]*});/);

    if (newMatch && oldMatch) {
      const newConfigObj = eval(`(${newMatch[1]})`);
      const oldConfigObj = eval(`(${oldMatch[1]})`);

      const merged = deepMerge(newConfigObj, oldConfigObj);

      const mergedConfig = `export const themeConfig: StarreadThemeConfig = ${JSON.stringify(merged, null, 2)};`;
      return newConfig.replace(newMatch[0], mergedConfig);
    }
  } catch (e) {
    console.error('\x1b[31m警告：无法自动合并配置，将保留用户配置\x1b[0m');
  }

  return oldConfig;
}

function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    if (key in result && typeof result[key] === 'object' && typeof source[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

updatePackage().catch(console.error);