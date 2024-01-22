"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  input: z.string().max(1000),
});

type Props = {};

const ChatInput = (props: Props) => {
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

    router.push("/chat");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#394F68] to-[#183B7B] p-10 flex flex-col justify-center items-center">
      <Card className="max-w-4xl mx-auto p-10">
        <CardTitle className="text-5xl md:text-6xl font-bold text-center mb-10">
          PromptlyTech
        </CardTitle>
        <CardDescription className="text-xl text-center">
          The mission at PromptlyTech is to make AI-powered solutions more
          accessible, efficient, and effective for a variety of industries.
        </CardDescription>
        <Separator className="my-10" />
        <CardContent>
          <Card className="bg-gradient-to-br from-[#394F68] to-[#183B7B]">
            <CardContent className="p-5">
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
                          <Input
                            placeholder="Enter your prompt..."
                            {...field}
                          />
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
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInput;
