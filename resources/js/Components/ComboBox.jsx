import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { IconCaretDown, IconCheck } from '@tabler/icons-react';

export default function ComboBox({
    items,
    selectedItem,
    onSelect,
    placeholder = 'Pilih item...',
}) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value) => {
        onSelect(value);
        setOpen(false);
    };

    const selectedLabel =
        items.find((item) => item.value === selectedItem)?.label ?? placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    size="xl"
                >
                    {selectedLabel}
                    <IconCaretDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-60 w-64 p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>Item tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {items.map((item, index) => (
                                <CommandItem
                                    key={index}
                                    value={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    {item.label}
                                    <IconCheck
                                        className={cn(
                                            'ml-auto size-4',
                                            selectedItem === item.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
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
