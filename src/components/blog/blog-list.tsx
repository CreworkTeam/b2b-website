import FilterForm from './filter-form';
import { cn } from '@/lib/utils';
import BlogCard from './blog-card';
import { useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import { BLOG_RESULTS_LIMIT } from '@/constants';
import { Skeleton } from '../ui/skeleton';
import React from 'react';

const initialState = {
  page: 1,
  totalBlogs: 0,
  filteredBlogs: [],
  loading: true,
  tags: [],
  query: '',
  selectedCategory: 'all',
};

const reducer = (state, action) => {
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

const BlogList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get('/api/tags.json', {}).then((response) => {
      const tags = response.data;
      dispatch({ type: 'SET_TAGS', payload: tags });
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
        payload: { blogs: res.blogs, totalBlogs: res.totalBlogs },
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await handleSubmit();
      dispatch({
        type: 'SET_BLOG_DATA',
        payload: { blogs: [...state.filteredBlogs, ...res.blogs], totalBlogs: res.totalBlogs },
      });
    };
    fetchData();
  }, [state.page, state.selectedCategory]);

  return (
    <div className="my-4 space-y-2">
      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <h4 className="text-black">All Articles</h4>
        <FilterForm
          uniqueTags={state.tags}
          query={state.query}
          setQuery={(query: string) => dispatch({ type: 'SET_QUERY', payload: query })}
          selectedCategory={state.selectedCategory}
          handleSubmit={handleSearch}
          handleChangeCategory={handleChangeCategory}
        />
      </div>
      <div className={cn('flex flex-wrap')}>
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
        {state.loading &&
          Array.from({ length: BLOG_RESULTS_LIMIT }).map((_, index) => (
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
      {state.totalBlogs > state.page * BLOG_RESULTS_LIMIT && (
        <button
          className="btn mx-auto block px-14"
          data-btntype="view more"
          onClick={() => {
            dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
          }}
        >
          View More
        </button>
      )}
    </div>
  );
};

export default BlogList;
