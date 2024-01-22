"use client";

import InformationPanel from "@/components/InformationPanel";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const formSchema = z.object({
  input: z.string().max(1000),
});

type Props = {};

function ChatPage({}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const inputCopy = values.input.trim();
    form.reset();
  }
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <InformationPanel />

      <div className="flex-1 p-5 lg:p-10">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* ADD the chat message */}
            </div>

          <div className="sticky bottom-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center space-x-2"
              >
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem className="grid flex-1 gap-2">
                      <FormControl>
                        <Input placeholder="Enter your prompt..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
