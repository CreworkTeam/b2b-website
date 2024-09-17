import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Design', value: 'design' },
  { label: 'E-commerce', value: 'e-commerce' },
  { label: 'Mobile App', value: 'mobile-app' },
  { label: 'Web Security', value: 'web-security' },
  { aabel: 'SEO', value: 'seo' },
];

const SelectTag = () => {
  return (
    <Select>
      <SelectTrigger className="flex-1 bg-[#F4F4F4] focus-visible:outline-none focus-visible:ring-0 md:w-[180px] md:flex-none">
        <SelectValue placeholder="Categories" />
      </SelectTrigger>
      <SelectContent className="bg-[#F4F4F4] focus-visible:ring-0">
        {categories.map((category) => (
          <SelectItem
            key={category.value}
            value={category.value}
            className="cursor-pointer hover:bg-black/80"
          >
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectTag;
