import { useState } from 'react';
import { Button } from '../ui/button';
import { ClipboardIcon, CheckIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const BtnClipBoard = ({ url }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(url);
    setClicked(true);
    setTimeout(() => setClicked(false), 2000); // Reset after 2 seconds
  };

  return (
    <Popover open={clicked} onOpenChange={setClicked}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-full bg-[#F6F6F6] shadow-[0px_2px_2.5px_0px_#00000033]"
          onClick={handleClick}
        >
          {clicked ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={15}
        className="w-fit bg-[#F6F6F6] p-2 px-4 text-sm text-[#3E3E3E] !shadow-[0px_2px_2.5px_0px_#00000040]"
      >
        Copied to clipboard!
      </PopoverContent>
    </Popover>
  );
};

export default BtnClipBoard;
