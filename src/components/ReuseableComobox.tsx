import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface IComboboxItem {
  id: number;
  label: string;
}

interface ReusableComboboxProps {
  items: IComboboxItem[];
  value: number | undefined;
  onChange: (id: number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  hasError?: boolean;
  className?: string;
  contentClassName?: string;
  initialValue?: number;
}

export default function ReusableCombobox({
  items,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  loading = false,
  hasError = false,
  className,
  contentClassName,
  initialValue,
}: ReusableComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.id === value);
  console.log(value);

  useEffect(() => {
    if (initialValue) {
      onChange(initialValue);
    }
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={"w-full"}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full! justify-between font-normal rounded-md  px-3  py-2 h-auto text-sm bg-green-50 ",
            " focus:border-[#3B6D11]",
            hasError && "border-rose-300",
            !selected && "text-slate-400",
            className,
          )}
        >
          {loading ? "Loading..." : selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[--radix-popover-trigger-width] p-0 bg-white",
          contentClassName,
          "  shadow-lg border-none!",
        )}
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 border-0"
          />
          <CommandList className="scrollbar-green">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                console.log(value === item.id);
                const isSelected = value === item.id;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      isSelected && "bg-green-900! text-white!",
                      "hover:bg-green-400 hover:text-white",
                    )}
                  >
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
