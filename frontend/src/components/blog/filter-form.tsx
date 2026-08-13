import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilterForm = ({
  uniqueTags,
  query,
  setQuery,
  selectedCategory,
  handleSubmit,
  handleChangeCategory,
}) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    ...uniqueTags.map((option) => ({
      value: option,
      label: option,
    })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
      {/* Google-style Pill Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex flex-1 w-full sm:w-72 items-center rounded-full border border-[#DADCE0] bg-white px-4 py-1.5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10"
      >
        <svg
          className="w-4 h-4 text-gray-400 shrink-0 mr-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <Input
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm text-gray-900 placeholder:text-gray-400 h-7 p-0"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-gray-600 mr-1 p-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="hidden"
          aria-label="Search"
        />
      </form>

      {/* Google-style Pill Select Dropdown */}
      <Select onValueChange={handleChangeCategory} value={selectedCategory}>
        <SelectTrigger className="w-full sm:w-[170px] bg-white border border-[#DADCE0] hover:border-gray-300 hover:bg-[#F8F9FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded-full h-10 px-4 text-sm font-medium text-gray-700 shadow-sm transition-all">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-2xl p-1 focus-visible:ring-0">
          {categories.map(({ label, value }) => (
            <SelectItem
              key={value}
              value={value}
              data-btntype="filter"
              className="cursor-pointer truncate rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterForm;
