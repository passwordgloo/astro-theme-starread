/**
 * Starread Markdown 语法扩展（satteri mdast 插件，零运行时依赖）
 *
 * Astro 7 的 Markdown 管线：satteri 处理器在构建期把 Markdown 解析为 mdast，
 * 本文件以 satteri 的 mdast 访问者（visitor）形态注册自定义语法，转换后的
 * 节点通过 data.hName / data.hProperties 指示渲染目标 HTML，最终输出到页面。
 *
 * 当前已支持的扩展：
 *   - GFM 风味警告框（Alert）：
 *       > [!note]      备注
 *       > [!tip]       提示
 *       > [!important] 重要
 *       > [!warning]   警告
 *       > [!caution]   注意
 *     渲染为 <div class="markdown-alert markdown-alert-xxx ...tailwind">，
 *     样式全部由节点上的 Tailwind 工具类承载（含 dark: 深色模式色块），
 *     无需在 global.css 中维护 alert 专属 CSS。
 *
 * 扩展方式（后续新增 Markdown 语法时）：
 *   1. 在本文件编写一个 satteri mdast 插件：{ name, <节点类型>(node, ctx){...} }
 *      （ctx 提供 removeNode / replaceNode / prependChild / setProperty 等
 *           变异方法；需要渲染成自定义 HTML 时给节点设置
 *      data.hName / data.hProperties，自定义节点用 type: 'custom'）；
 *   2. 注册到下方 SYNTAX_EXTENSIONS 注册表；
 *   3. 在 starread.config.ts 的 markdown 配置段与
 *      scripts/type/config.d.ts 的 MarkdownConfig 中追加开关字段；
 *   4. 在 astro.config.mjs 给 starreadMarkdownIntegration 传入对应 options。
 *
 * 注册方式：默认导出的 Astro 集成在 `astro:config:done` 钩子中把启用的
 * 插件推入默认 satteri 处理器的 options.mdastPlugins，无需安装
 * @astrojs/markdown-remark 或任何 remark 依赖。
 *
 * 图标 path 数据采用 GitHub Octicons（MIT License，
 * 与 remark-github-blockquote-alert 一致）。
 */

const ALERT_MARKER_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\n|$)/i;

/**
 * Alert 类型定义：octicon 图标类与 path、多语言标题、Tailwind 配色类
 * （containerClass 作用于外框，titleClass 作用于标题行与图标）。
 * 注意：Tailwind 类必须以完整字符串字面量书写，扫描器才能检测生成。
 */
const ALERT_TYPES = {
  note: {
    octicon: 'octicon-info',
    path: 'M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
    containerClass: 'border-sky-400 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-400/10',
    titleClass: 'text-sky-700 dark:text-sky-300',
    labels: { zh: '备注', en: 'Note', ja: 'メモ', ko: '참고', ru: 'Заметка' },
  },
  tip: {
    octicon: 'octicon-light-bulb',
    path: 'M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z',
    containerClass: 'border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-400/10',
    titleClass: 'text-emerald-700 dark:text-emerald-300',
    labels: { zh: '提示', en: 'Tip', ja: 'ヒント', ko: '팁', ru: 'Совет' },
  },
  important: {
    octicon: 'octicon-message',
    path: 'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
    containerClass: 'border-fuchsia-400 bg-fuchsia-50 dark:border-fuchsia-500/40 dark:bg-fuchsia-400/10',
    titleClass: 'text-fuchsia-700 dark:text-fuchsia-300',
    labels: { zh: '重要', en: 'Important', ja: '重要', ko: '중요', ru: 'Важно' },
  },
  warning: {
    octicon: 'octicon-alert',
    path: 'M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
    containerClass: 'border-amber-400 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-400/10',
    titleClass: 'text-amber-700 dark:text-amber-300',
    labels: { zh: '警告', en: 'Warning', ja: '警告', ko: '경고', ru: 'Предупреждение' },
  },
  caution: {
    octicon: 'octicon-stop',
    path: 'M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
    containerClass: 'border-rose-400 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-400/10',
    titleClass: 'text-rose-700 dark:text-rose-300',
    labels: { zh: '注意', en: 'Caution', ja: '注意', ko: '주의', ru: 'Осторожно' },
  },
};

/**
 * 从文件 URL 推断当前文章语言（src/content/<lang>/...）
 */
function detectLang(fileURL) {
  const pathname = fileURL?.pathname || '';
  const lang = /[\\/]content[\\/](en|ja|ko|ru)[\\/]/.exec(pathname)?.[1];
  return lang === 'en' || lang === 'ja' || lang === 'ko' || lang === 'ru' ? lang : 'zh';
}

/**
 * 构造 Alert 标题段落（octicon 图标 + 类型标题）。
 * 用 hName: 'div' 输出而非 <p>：标题不受 prose 排版样式的段落
 * 外边距影响，自身用 mb-2 控制与正文的间距。
 */
function buildTitleNode(alertConfig, label) {
  return {
    type: 'paragraph',
    data: {
      hName: 'div',
      hProperties: {
        className: [
          'markdown-alert-title',
          'flex', 'items-center', 'gap-2', 'mb-2',
          'font-semibold', 'not-italic',
          ...alertConfig.titleClass.split(' '),
        ],
      },
    },
    children: [
      {
        type: 'custom',
        data: {
          hName: 'svg',
          hProperties: {
            className: ['octicon', alertConfig.octicon, 'size-4', 'shrink-0', 'fill-current'],
            viewBox: '0 0 16 16',
            width: 16,
            height: 16,
            'aria-hidden': true,
          },
        },
        children: [
          {
            type: 'custom',
            data: { hName: 'path', hProperties: { d: alertConfig.path } },
            children: [],
          },
        ],
      },
      { type: 'text', value: ` ${label}` },
    ],
  };
}

/**
 * 收集 alert 内含软换行（\n）的文本节点（不含 excluded）。
 * 递归所有子树，inlineCode/html 等只有 value 的节点天然被跳过，
 * 行内代码中的换行不会被改成 <br>。
 * 注意：必须在发出任何变更命令之前调用——satteri 的 JS 侧节点
 * 是代理，变更落盘前读到的是旧值，交叉读写会产生脏数据。
 */
function collectSoftBreakTexts(node, excluded, out) {
  for (const child of node.children ?? []) {
    if (child === excluded) continue;
    if (child.type === 'text') {
      if ((child.value ?? '').includes('\n')) out.push(child);
    } else if (Array.isArray(child.children)) {
      collectSoftBreakTexts(child, excluded, out);
    }
  }
}

/** 把文本值按 \n 拆为 text/break 节点序列，软换行渲染为 <br>。 */
function splitToParts(value) {
  const parts = [];
  value.split('\n').forEach((segment, index) => {
    if (index > 0) parts.push({ type: 'break' });
    if (segment) parts.push({ type: 'text', value: segment });
  });
  return parts;
}

/**
 * 扩展：GFM 风味警告框（satteri mdast 访问者插件）
 *
 * 识别 blockquote 首个段落首个文本节点上的 [!TYPE] 标记，
 * 将引用块转换为 <div class="markdown-alert markdown-alert-type">，
 * 并在开头插入带图标的标题段落。
 */
const alertPlugin = {
  name: 'starread-gfm-alert',
  blockquote(node, ctx) {
    const firstParagraph = node.children?.[0];
    if (!firstParagraph || firstParagraph.type !== 'paragraph') return;

    const firstText = firstParagraph.children?.[0];
    if (!firstText || firstText.type !== 'text') return;

    const match = ALERT_MARKER_REGEX.exec(firstText.value || '');
    if (!match) return;

    const alertType = match[1].toLowerCase();
    const alertConfig = ALERT_TYPES[alertType];
    if (!alertConfig) return;

    // —— 先完成全部"读取"，再统一发出"变更"（satteri 变更队列约束，
    // 且不要对即将被移除的节点/子树再做操作，否则会被丢弃并告警）——

    // 收集除标记文本外所有含软换行的文本节点：alert 内每个源码行
    // 渲染为 <br> 硬换行（对齐 GitHub 多行 alert 行为，默认软换行
    // 在 HTML 中会折叠成空格导致多行挤成一行）。
    const softBreakTexts = [];
    collectSoftBreakTexts(node, firstText, softBreakTexts);

    // 标记文本处理：剥离标记后与正文同段则拆行替换，独占一段则整段清理
    const remainder = firstText.value.replace(ALERT_MARKER_REGEX, '').replace(/^\n+/, '');
    const following = firstParagraph.children.slice(1);
    const isMarkerOnlyParagraph =
      !remainder.trim() &&
      (following.length === 0 ||
        (following[0] && following[0].type === 'break' && following.length === 1));

    // 1. 其余文本节点的软换行拆分
    for (const textNode of softBreakTexts) {
      ctx.replaceNode(textNode, splitToParts(textNode.value));
    }

    // 2. 标记文本：剥离标记并拆行（空结果等于移除该节点）
    if (!isMarkerOnlyParagraph) {
      ctx.replaceNode(firstText, splitToParts(remainder));
      // 标记行与其后内容间的硬换行随标记一并移除
      if (following[0] && following[0].type === 'break') {
        ctx.removeNode(following[0]);
      }
    } else {
      // 标记独占一段（可能带一个尾随硬换行）：整段移除
      ctx.removeNode(firstParagraph);
    }

    // 3. 标题语言跟随文章所在语言目录
    const lang = detectLang(ctx.fileURL);
    const label = alertConfig.labels[lang] || alertConfig.labels.en;
    ctx.prependChild(node, buildTitleNode(alertConfig, label));

    // 指示 satteri 将 blockquote 渲染为带 Tailwind 类的 div。
    // [&>p]:my-0 抵消 prose 排版给内部段落加的上下外边距，
    // 让 alert 紧凑（标题与正文的间距由标题的 mb-2 控制）。
    ctx.setProperty(node, 'data', {
      ...(node.data || {}),
      hName: 'div',
      hProperties: {
        ...(node.data?.hProperties || {}),
        className: [
          'markdown-alert',
          `markdown-alert-${alertType}`,
          'my-5', 'rounded-lg', 'border-l-4', 'px-4', 'py-3',
          '[&>p]:my-0',
          ...alertConfig.containerClass.split(' '),
        ],
      },
    });
  },
};

/**
 * 语法扩展注册表
 * 后续新增语法时，在此注册 { key, enabled, plugin } 即可。
 */
const SYNTAX_EXTENSIONS = [
  {
    key: 'alert',
    enabled: (options) => options.alert === true,
    plugin: alertPlugin,
  },
];

/**
 * Astro 集成：把已启用的 Markdown 语法扩展注册到默认 satteri 处理器。
 *
 * @param {object} [options]
 * @param {boolean} [options.alert=false] 是否启用 GFM 风味警告框
 */
export default function starreadMarkdownIntegration(options = {}) {
  const plugins = SYNTAX_EXTENSIONS
    .filter((ext) => ext.enabled(options))
    .map((ext) => ext.plugin);

  return {
    name: 'starread-markdown-syntax',
    hooks: {
      'astro:config:done': ({ config }) => {
        const mdastPlugins = config.markdown?.processor?.options?.mdastPlugins;
        if (Array.isArray(mdastPlugins)) {
          mdastPlugins.push(...plugins);
        }
      },
    },
  };
}

export { ALERT_TYPES, SYNTAX_EXTENSIONS };
