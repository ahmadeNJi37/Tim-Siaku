import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/Ui/Popover";
import { Button } from "@/Component/Ui/Button";
import { IconCaretDown, IconCheck } from "@tabler/icons-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup } from "@/Component/ui/command";
import { CommandItem } from "./ui/command";

export default function ComboBox({ items, selectedItem, onSelect, placeholder = 'pilih item...' }) {
    const [open, setOpen] = useState(false);
    const handleSelect = (value) => {
        onSelect(value);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='justify-between w-full'
                    size='xl'
                >
                    {items.find((item) => item.label === selectedItem)?.label ?? placeholder}
                    <IconCaretDown className="size-4 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-content-available-width] p-0'
                align='start'
            >
                <Command>
                    <CommandInput placeholder={placeholder} className='h-9' />
                    <CommandList>
                        <CommandEmpty>Item tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {items.map((item, index) => (
                                <CommandItem key={index} value={item.value} onSelect={(value) => handleSelect(value)}>
                                    {item.label}
                                    <IconCheck
                                        className={cn(
                                            'ml-auto size-4',
                                            selectedItem === item.label ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
