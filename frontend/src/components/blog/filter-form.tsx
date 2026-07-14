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
    { value: 'all', label: 'All' },
    ...uniqueTags.map((option) => ({
      value: option,
      label: option,
    })),
  ];

  return (
    <div className="flex gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex flex-1 items-center rounded-md border bg-[#F4F4F4]"
      >
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-0 shadow-none focus-visible:ring-0"
        />
        <button type="submit" className="h-full">
          <img
            width={6}
            height={6}
            src="/icons/search.svg"
            alt="search"
            className="h-full w-6 cursor-pointer rounded-r-md object-contain pr-2"
          />
        </button>
      </form>
      <Select onValueChange={handleChangeCategory} value={selectedCategory}>
        <SelectTrigger className="flex-1 bg-[#F4F4F4] focus-visible:outline-none focus-visible:ring-0 md:w-[180px] md:flex-none">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-[#F4F4F4] focus-visible:ring-0">
          {categories.map(({ label, value }) => (
            <SelectItem
              key={value}
              value={value}
              data-btntype="filter"
              className="cursor-pointer truncate hover:bg-black/80"
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
