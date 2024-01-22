"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import axios from "axios";

type Props = {
  selectedPrompt: {
    prompt: string;
    response: {
      accuracy: string;
      classification: string;
    };
  };
  setSelectedPrompt: React.Dispatch<
    React.SetStateAction<{
      prompt: string;
      response: {
        accuracy: string;
        classification: string;
      };
    }>
  >;
};

type promptsType = {
  prompt: string;
  response: {
    accuracy: string;
    classification: string;
  };
};

const PromptCombobox = ({ selectedPrompt, setSelectedPrompt }: Props) => {
  const [open, setOpen] = useState(false);

  const [prompts, setPrompts] = useState<promptsType[] | null>(null);

  const getPrompts = axios
    .get("https://promptly-qmv5.onrender.com/api/get_prompts")
    .then((res) => {
      const prompts = res.data.map((data: promptsType) => {
        return {
          prompt: data.prompt,
          response: {
            accuracy: data.response.accuracy,
            classification: data.response.classification,
          },
        };
      });

      setPrompts([...prompts])
    }
    );

  if (!getPrompts) return <div />;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm text-[#0ea5e9] md:w-[339px]"
          >
            {selectedPrompt.prompt
              ? prompts?.find((prompt) => prompt.prompt === selectedPrompt.prompt)?.prompt
              : "Select prompt..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 md:w-[339px]">
          <Command className="text-[#0ea5e9] dark:text-[#0ea5e9]">
            <CommandInput placeholder="Search prompt..." />
            <CommandEmpty>No prompt found.</CommandEmpty>
            <CommandGroup className="h-fit max-h-96 overflow-y-auto text-[#0ea5e9] dark:text-[#0ea5e9]">
              {prompts?.map((prompt) => (
                <CommandItem
                  key={prompt.prompt}
                  onSelect={() => {
                    setSelectedPrompt(prompt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPrompt.prompt === prompt.prompt
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {prompt.prompt}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PromptCombobox;
