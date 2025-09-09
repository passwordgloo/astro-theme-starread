import React from 'react';

const ArticleInfo = ({ title, cover, date, tags = [], categories = [] }) => {
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
          
          <div className="flex items-center text-white/90 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{date}</span>
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
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,192,1392,197.3L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,240L48,229.3C96,219,192,197,288,197.3C384,197,480,219,576,234.7C672,251,768,261,864,250.7C960,240,1056,208,1152,202.7C1248,197,1344,208,1392,213.3L1440,219L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,192,1392,197.3L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
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
                M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,250.7C672,267,768,277,864,266.7C960,256,1056,224,1152,218.7C1248,213,1344,224,1392,229.3L1440,235L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,267L48,256C96,245,192,224,288,224C384,224,480,245,576,261.3C672,277,768,288,864,277.3C960,267,1056,235,1152,229.3C1248,224,1344,235,1392,240L1440,245L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,250.7C672,267,768,277,864,266.7C960,256,1056,224,1152,218.7C1248,213,1344,224,1392,229.3L1440,235L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
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