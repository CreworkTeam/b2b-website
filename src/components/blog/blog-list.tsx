import { useEffect, useReducer } from 'react';
import axios from 'axios';

import FilterForm from './filter-form';
import BlogCard from './blog-card';

import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES_MAP, BLOG_RESULTS_LIMIT } from '@/constants';
import { Skeleton } from '../ui/skeleton';

const initialState = {
  page: 1,
  totalBlogs: 0,
  filteredBlogs: [],
  loading: true,
  tags: [],
  query: '',
  selectedCategory: 'all',
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_TAGS':
      return { ...state, tags: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_BLOG_DATA':
      return {
        ...state,
        filteredBlogs: action.payload.blogs,
        totalBlogs: action.payload.totalBlogs,
      };

    case 'SET_PAGE':
      return { ...state, page: action.payload };

    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    default:
      return state;
  }
};

const BlogList = ({ category }: { category?: string } = {}) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, selectedCategory: category || 'all' });

  useEffect(() => {
    axios.get('/api/tags.json').then((response) => {
      dispatch({ type: 'SET_TAGS', payload: response.data });
    });
  }, []);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await axios.get('/api/blogs.json', {
        params: {
          page: state.page,
          search: state.query,
          category: state.selectedCategory,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return { blogs: [], totalBlogs: 0 };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetData = () => {
    dispatch({
      type: 'SET_BLOG_DATA',
      payload: { blogs: [], totalBlogs: 0 },
    });
    dispatch({ type: 'SET_PAGE', payload: 1 });
  };

  const handleChangeCategory = (category: string) => {
    resetData();
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
  };

  const handleSearch = () => {
    resetData();

    handleSubmit().then((res) => {
      dispatch({
        type: 'SET_BLOG_DATA',
        payload: {
          blogs: res.blogs,
          totalBlogs: res.totalBlogs,
        },
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await handleSubmit();

      dispatch({
        type: 'SET_BLOG_DATA',
        payload: {
          blogs: [...state.filteredBlogs, ...res.blogs],
          totalBlogs: res.totalBlogs,
        },
      });
    };

    fetchData();
  }, [state.page, state.selectedCategory]);

  return (
    <div className="pb-4 space-y-2">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 pb-8">
        <a
          href="/blog"
          className={cn(
            'border px-4 py-1.5 rounded-full text-sm md:text-base transition-colors',
            state.selectedCategory === 'all'
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          )}
        >
          All
        </a>

        {BLOG_CATEGORIES_MAP.map(({ name, tag }: { name: string, tag: string }) => (
          <a
            key={tag}
            href={`/category/${tag}`}
            className={cn(
              'border px-4 py-1.5 rounded-full text-sm md:text-base transition-colors whitespace-nowrap',
              state.selectedCategory === tag
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {name}
          </a>
        ))}
      </div>

      {/* Header + Filter */}
      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <h4 className="text-black">{state.selectedCategory === 'all' ? 'All' : BLOG_CATEGORIES_MAP.find((cat) => cat.tag === state.selectedCategory)?.name || ''} Articles</h4>

        <FilterForm
          uniqueTags={state.tags}
          query={state.query}
          setQuery={(query: string) =>
            dispatch({ type: 'SET_QUERY', payload: query })
          }
          selectedCategory={state.selectedCategory}
          handleSubmit={handleSearch}
          handleChangeCategory={handleChangeCategory}
        />
      </div>

      {/* Blog List */}
      <div className="flex flex-wrap">
        {state.filteredBlogs?.map(({ slug, data }: any, index: number) => (
          <div
            key={slug}
            className={cn('w-full py-4 md:w-1/2', {
              'md:pr-2': index % 2 === 0,
              'md:pl-2': index % 2 !== 0,
            })}
          >
            <BlogCard {...data} slug={slug} client:load />
          </div>
        ))}

        {/* Skeleton Loader */}
        {state.loading &&
          Array.from({
            length:
              state.totalBlogs === 0 ||
                state.totalBlogs > state.page * BLOG_RESULTS_LIMIT
                ? BLOG_RESULTS_LIMIT
                : state.totalBlogs % BLOG_RESULTS_LIMIT,
          }).map((_, index) => (
            <div
              key={index}
              className={cn('w-full space-y-3 px-2 py-4 md:w-1/2', {
                'md:pr-2': index % 2 === 0,
                'md:pl-2': index % 2 !== 0,
              })}
            >
              <Skeleton className="aspect-[16/8] w-full" />
              <div className="space-y-2 pr-4">
                <Skeleton className="h-3 w-4/12" />
                <Skeleton className="h-6" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-8/12" />
              </div>
            </div>
          ))}
      </div>

      {/* View More Button */}
      {state.totalBlogs > state.page * BLOG_RESULTS_LIMIT && (
        <button
          className="btn mx-auto block px-14"
          data-btntype="view more"
          onClick={() =>
            dispatch({ type: 'SET_PAGE', payload: state.page + 1 })
          }
        >
          View More
        </button>
      )}
    </div>
  );
};

export default BlogList;