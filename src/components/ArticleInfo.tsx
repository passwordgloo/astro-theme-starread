import React, { useEffect } from 'react';

// 扩展Window接口以支持BUSUANZI
declare global {
  interface Window {
    BUSUANZI?: {
      fetch: () => void;
    };
  }
}

interface ArticleInfoProps {
  title: string;
  cover: string;
  date: string;
  tags?: string[];
  categories?: string[];
  wordCount?: number;
}

const ArticleInfo: React.FC<ArticleInfoProps> = ({ 
  title, 
  cover, 
  date, 
  tags = [], 
  categories = [], 
  wordCount = 0 
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/busuanzi.min.js';
    script.defer = true;
    script.onload = () => {
      if (window.BUSUANZI) {
        window.BUSUANZI.fetch();
      }
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="/busuanzi.min.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden  bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
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
      <div className="relative p-8 min-h-[240px] flex flex-col justify-end text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">
            {title}
          </h1>
          
          {/* 分类和标签信息 - 同一行显示 */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
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
          
          <div className="flex flex-wrap justify-center items-center text-white/90 text-sm gap-x-6 gap-y-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{wordCount} 字</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                {Math.ceil(wordCount / 100)} 分钟阅读
              </span>
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
        {/* 浅色模式波浪 */}
        <svg 
          className="absolute bottom-0 w-full h-full dark:hidden"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lightWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(242, 245, 249, 0.8)" />
              <stop offset="50%" stopColor="rgba(242, 245, 249, 0.9)" />
              <stop offset="100%" stopColor="rgba(242, 245, 249, 0.8)" />
            </linearGradient>
            <linearGradient id="lightWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(242, 245, 249, 0.6)" />
              <stop offset="50%" stopColor="rgba(242, 245, 249, 0.7)" />
              <stop offset="100%" stopColor="rgba(242, 245, 249, 0.6)" />
            </linearGradient>
          </defs>
          
          {/* 第一层波浪 - 更明显的横向运动 */}
          <path 
            fill="url(#lightWave1)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,192,1392,197.3L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="4s" 
              repeatCount="indefinite"
              values="
                  M-100,180C0,220,60,260,120,280C180,300,240,300,300,280C360,260,420,220,480,200C540,180,600,180,660,200C720,220,780,260,840,280C900,300,960,300,1020,280C1080,260,1140,220,1200,200C1260,180,1320,180,1380,200C1440,220,1500,260,1560,180L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z;
                  M-100,260C0,300,60,340,120,360C180,380,240,380,300,360C360,340,420,300,480,280C540,260,600,260,660,280C720,300,780,340,840,360C900,380,960,380,1020,360C1080,340,1140,300,1200,280C1260,260,1320,260,1380,280C1440,300,1500,340,1560,260L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z;
                  M-100,180C0,220,60,260,120,280C180,300,240,300,300,280C360,260,420,220,480,200C540,180,600,180,660,200C720,220,780,260,840,280C900,300,960,300,1020,280C1080,260,1140,220,1200,200C1260,180,1320,180,1380,200C1440,220,1500,260,1560,180L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z
                "
            />
          </path>
          
          {/* 第二层波浪 - 更明显的横向运动 */}
          <path 
            fill="url(#lightWave2)"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,250.7C672,267,768,277,864,266.7C960,256,1056,224,1152,218.7C1248,213,1344,224,1392,229.3L1440,235L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="5.33s" 
              repeatCount="indefinite"
              values="
                  M-120,210C-20,250,40,290,100,310C160,330,220,330,280,310C340,290,400,250,460,230C520,210,580,210,640,230C700,250,760,290,820,310C880,330,940,330,1000,310C1060,290,1120,250,1180,230C1240,210,1300,210,1360,230C1420,250,1480,290,1540,210L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z;
                  M-120,290C-20,330,40,370,100,390C160,410,220,410,280,390C340,370,400,330,460,310C520,290,580,290,640,310C700,330,760,370,820,390C880,410,940,410,1000,390C1060,370,1120,330,1180,310C1240,290,1300,290,1360,310C1420,330,1480,370,1540,290L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z;
                  M-120,210C-20,250,40,290,100,310C160,330,220,330,280,310C340,290,400,250,460,230C520,210,580,210,640,230C700,250,760,290,820,310C880,330,940,330,1000,310C1060,290,1120,250,1180,230C1240,210,1300,210,1360,230C1420,250,1480,290,1540,210L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z
                "
            />
          </path>
        </svg>
        
        {/* 深色模式波浪 */}
        <svg 
          className="absolute bottom-0 w-full h-full hidden dark:block"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="darkWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(4, 7, 17, 0.9)" />
              <stop offset="50%" stopColor="rgba(4, 7, 17, 0.95)" />
              <stop offset="100%" stopColor="rgba(4, 7, 17, 0.9)" />
            </linearGradient>
            <linearGradient id="darkWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(4, 7, 17, 0.7)" />
              <stop offset="50%" stopColor="rgba(4, 7, 17, 0.8)" />
              <stop offset="100%" stopColor="rgba(4, 7, 17, 0.7)" />
            </linearGradient>
          </defs>
          
          {/* 第一层波浪 - 更明显的横向运动 */}
          <path 
            fill="url(#darkWave1)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,192,1392,197.3L1440,203L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="4s" 
              repeatCount="indefinite"
              values="
                  M-100,180C0,220,60,260,120,280C180,300,240,300,300,280C360,260,420,220,480,200C540,180,600,180,660,200C720,220,780,260,840,280C900,300,960,300,1020,280C1080,260,1140,220,1200,200C1260,180,1320,180,1380,200C1440,220,1500,260,1560,180L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z;
                  M-100,260C0,300,60,340,120,360C180,380,240,380,300,360C360,340,420,300,480,280C540,260,600,260,660,280C720,300,780,340,840,360C900,380,960,380,1020,360C1080,340,1140,300,1200,280C1260,260,1320,260,1380,280C1440,300,1500,340,1560,260L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z;
                  M-100,180C0,220,60,260,120,280C180,300,240,300,300,280C360,260,420,220,480,200C540,180,600,180,660,200C720,220,780,260,840,280C900,300,960,300,1020,280C1080,260,1140,220,1200,200C1260,180,1320,180,1380,200C1440,220,1500,260,1560,180L1560,320L1460,320C1360,320,1260,320,1160,320C1060,320,960,320,860,320C760,320,660,320,560,320C460,320,360,320,260,320C160,320,60,320,-40,320L-120,320Z
                "
            />
          </path>
          
          {/* 第二层波浪 - 更明显的横向运动 */}
          <path 
            fill="url(#darkWave2)"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,250.7C672,267,768,277,864,266.7C960,256,1056,224,1152,218.7C1248,213,1344,224,1392,229.3L1440,235L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate 
              attributeName="d" 
              dur="5.33s" 
              repeatCount="indefinite"
              values="
                  M-120,210C-20,250,40,290,100,310C160,330,220,330,280,310C340,290,400,250,460,230C520,210,580,210,640,230C700,250,760,290,820,310C880,330,940,330,1000,310C1060,290,1120,250,1180,230C1240,210,1300,210,1360,230C1420,250,1480,290,1540,210L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z;
                  M-120,290C-20,330,40,370,100,390C160,410,220,410,280,390C340,370,400,330,460,310C520,290,580,290,640,310C700,330,760,370,820,390C880,410,940,410,1000,390C1060,370,1120,330,1180,310C1240,290,1300,290,1360,310C1420,330,1480,370,1540,290L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z;
                  M-120,210C-20,250,40,290,100,310C160,330,220,330,280,310C340,290,400,250,460,230C520,210,580,210,640,230C700,250,760,290,820,310C880,330,940,330,1000,310C1060,290,1120,250,1180,230C1240,210,1300,210,1360,230C1420,250,1480,290,1540,210L1540,320L1440,320C1340,320,1240,320,1140,320C1040,320,940,320,840,320C740,320,640,320,540,320C440,320,340,320,240,320C140,320,40,320,-60,320L-140,320Z
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