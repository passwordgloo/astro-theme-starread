import React, { useEffect } from 'react';

const ArticleInfo = ({ title, cover, date, tags = [], categories = [] }) => {
  useEffect(() => {
    // 动态加载本地busuanzi脚本
    const script = document.createElement('script');
    script.src = '/busuanzi.min.js';
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      // 清理脚本
      const existingScript = document.querySelector('script[src="/busuanzi.min.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* 背景图片 */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      </div>
      
      {/* 内容区域 */}
      <div className="relative p-8 min-h-[240px] flex flex-col justify-end">
        <div className="mb-6">
          {/* 标签和分类 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category, index) => (
              <span 
                key={`cat-${index}`}
                className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-100 rounded-full backdrop-blur-sm"
              >
                {category}
              </span>
            ))}
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={`tag-${index}`}
                className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-100 rounded-full backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">
            {title}
          </h1>
          
          <div className="flex items-center text-white/90 text-sm space-x-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">
                <span id="busuanzi_page_pv">加载中...</span> 次阅读
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 优化波浪动画 - 控制在文字下方 */}
      <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
          
          {/* 第一层波浪 - 轻微起伏 */}
          <path 
            fill="url(#waveGradient1)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,192,1392,197.3L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="6s" 
              repeatCount="indefinite"
              values="
                  M0,200L48,230C96,260,192,300,288,280C384,260,480,220,576,200C672,180,768,190,864,210C960,230,1056,250,1152,240C1248,230,1344,200,1392,185L1440,170L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                  M0,240L48,270C96,300,192,340,288,320C384,300,480,260,576,240C672,220,768,230,864,250C960,270,1056,290,1152,280C1248,270,1344,240,1392,225L1440,210L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                  M0,200L48,230C96,260,192,300,288,280C384,260,480,220,576,200C672,180,768,190,864,210C960,230,1056,250,1152,240C1248,230,1344,200,1392,185L1440,170L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
                "
            />
          </path>
          
          {/* 第二层波浪 - 更轻微 */}
          <path 
            fill="url(#waveGradient2)"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,250.7C672,267,768,277,864,266.7C960,256,1056,224,1152,218.7C1248,213,1344,224,1392,229.3L1440,235L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="8s" 
              repeatCount="indefinite"
              values="
                  M0,230L48,260C96,290,192,330,288,310C384,290,480,250,576,230C672,210,768,230,864,250C960,270,1056,290,1152,280C1248,270,1344,240,1392,225L1440,210L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                  M0,270L48,300C96,330,192,370,288,350C384,330,480,290,576,270C672,250,768,270,864,290C960,310,1056,330,1152,320C1248,310,1344,280,1392,265L1440,250L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                  M0,230L48,260C96,290,192,330,288,310C384,290,480,250,576,230C672,210,768,230,864,250C960,270,1056,290,1152,280C1248,270,1344,240,1392,225L1440,210L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
                "
            />
          </path>
        </svg>
      </div>
      
      {/* 优化的浮动粒子效果 - 避免SSR不匹配 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 80 + 10}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              backgroundColor: `rgba(255, 255, 255, ${0.3 + (i * 0.1) % 0.3})`,
              animationDelay: `${(i * 0.7) % 3}s`,
              animationDuration: `${3 + (i * 0.5) % 2}s`,
              boxShadow: `0 0 ${2 + (i % 2) * 2}px rgba(255, 255, 255, 0.4)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleInfo;