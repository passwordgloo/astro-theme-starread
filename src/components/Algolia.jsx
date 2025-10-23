import "../styles/global.css";
import { algoliasearch } from 'algoliasearch';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Snippet,
  Pagination,
  useInstantSearch,
  Configure,
} from 'react-instantsearch';

// 🔹 原始 Algolia client，添加错误处理防止环境变量缺失导致构建失败
let algoliaClient;
let searchClient;

try {
  algoliaClient = algoliasearch(
    import.meta.env.PUBLIC_ALGOLIA_APP_ID,
    import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY
  );

  // 🔹 包一层，拦截空查询，避免请求 Algolia API
  searchClient = {
    ...algoliaClient,
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            processingTimeMS: 0,
          })),
        });
      }
      return algoliaClient.search(requests);
    },
  };
} catch (error) {
  // 环境变量缺失时提供默认的模拟客户端
  console.warn('Algolia配置缺失，使用模拟客户端');
  searchClient = {
    search: () => Promise.resolve({
      results: [{ hits: [], nbHits: 0, processingTimeMS: 0 }]
    })
  };
};

const renderTags = (tags) => {
  if (!tags) return null;
  const tagList = Array.isArray(tags) ? tags : tags.split(',');
  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {tagList.map((tag, i) => (
        <span
          key={i}
          className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
        >
          #{tag.trim()}
        </span>
      ))}
    </div>
  );
};

function Hit({ hit }) {
  const { indexUiState } = useInstantSearch();
  const hasQuery = indexUiState.query && indexUiState.query.trim().length > 0;
  const link = `/${hit.slug}`;

  return (
    <article className="flex items-center shadow-sm border border-gray-100 p-6 text-sm bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 font-normal leading-5 
      first:!rounded-t-md last:!rounded-b-md 
      rounded-none
     mb-0"
    >
      {hit.cover && hit.cover.trim() !== '' && (
        <a
          href={link}
          className="block w-45 h-30 mr-4 flex-shrink-0 rounded overflow-hidden"
        >
          <img
            src={hit.cover}
            alt={hit.title}
            className="w-full h-full object-cover"
          />
        </a>
      )}

      <div className="flex-1">
        <h3 className="mb-2 font-semibold">
          <a
            href={link}
            className="text-primary dark:text-secondary hover:underline no-underline"
          >
            <Highlight attribute="title" hit={hit} />
          </a>
        </h3>

        {hit.content && (
          <p className="mb-2 text-sm text-gray-600 dark:text-slate-300">
            {hasQuery ? (
              <Snippet attribute="content" hit={hit} />
            ) : (
              hit.content.split('\n').slice(0, 3).join(' ')
            )}
          </p>
        )}

        {renderTags(hit.tags)}

        {hit.categories && (
          <div className="text-xs text-gray-500">
            📂 {Array.isArray(hit.categories) ? hit.categories.join(' / ') : hit.categories}
          </div>
        )}
      </div>
    </article>
  );
}

// 🔹 查询结果：query 为空时不渲染
function SearchResults() {
  const { indexUiState, results } = useInstantSearch();
  const hasQuery = indexUiState.query && indexUiState.query.trim().length > 0;

  if (!hasQuery) {
    // 显示占位提示
    return (
      <div className="text-center text-gray-500 dark:text-slate-300">
        🔍 搜索结果为空，输入关键词开始搜索
      </div>
    );
  }

  const hasResults = results && results.nbHits > 0;

  return (
    <>
      {hasResults ? (
        <>
          <Hits 
            hitComponent={Hit}
            classNames={{
              list: 'list-none m-0 p-0',
            }}
          />
          <div className="mt-5 text-center">
            <Pagination
              classNames={{
                list: 'flex items-center justify-center m-0 p-0 list-none',
                item: 'inline-block first:rounded-l-md last:rounded-r-md overflow-hidden',
                link: 'appearance-none bg-gradient-to-b from-white to-gray-50 border border-gray-300 text-gray-800 cursor-pointer inline-flex text-sm font-normal h-8 justify-center leading-5 px-4 items-center no-underline select-none hover:from-white hover:to-gray-100 hover:border-gray-300 focus:border-blue-500 focus:outline-none active:border-gray-300 active:shadow-inner disabled:from-white disabled:to-gray-100 disabled:border-gray-200 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed rounded-none',
                selectedItem: 'font-bold',
                disabledItem: '',
              }}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-slate-300">
          没有找到相关内容
        </div>
      )}
    </>
  );
}

export default function AlgoliaSearch() {
  return (
    <div className="p-5">
      <InstantSearch
        searchClient={searchClient}
        indexName={import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME}
        future={{ preserveSharedStateOnUnmount: true }}
        initialUiState={{ [import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME]: { query: '' } }}
      >
        <Configure hitsPerPage={5} />

        {/* 搜索框 */}
        <div className="relative w-full h-10 text-sm leading-5 mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <span className="icon-[lucide--search] h-5 w-5 text-primary dark:text-secondary fill-none"></span>
          </div>

          <SearchBox
            placeholder="搜索文章..."
            classNames={{
              root: 'w-full',
              form: 'flex bg-white/60 backdrop-blur-lg dark:bg-white/5 dark:border-white/10 text-sm h-10 leading-5 relative w-full',
              input:
                'appearance-none bg-gray-50 dark:bg-white/5 border border-gray-300 rounded shadow-inner pl-10 pr-4 py-2 flex-1 text-gray-800 dark:text-white caret-blue-600 placeholder-primary dark:placeholder-secondary focus:border-blue-500 focus:shadow-none focus:outline-none',
              submitIcon: 'hidden',
              resetIcon: 'hidden',
            }}
          />
        </div>

        <div className="flex mt-5 gap-5">
          <main className="flex-1">
            <SearchResults />
          </main>
        </div>
      </InstantSearch>
    
    </div>
  );
}