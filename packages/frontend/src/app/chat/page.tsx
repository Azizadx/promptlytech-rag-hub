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
import axios from "axios";
import { useState } from "react";

const formSchema = z.object({
  input: z.string().max(1000),
});

type Props = {};

function ChatPage({}: Props) {
  const [answer, setAnswer] = useState("");
  const [inputCopy, setInputCopy] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setInputCopy(values.input.trim())
        await axios.post("https://promptly-qmv5.onrender.com/api/chatbot", {
        'objective': inputCopy,
      }).then((response)=>{
            console.log(response.data[0])
      setAnswer(response.data[0]);
      }).catch((error) => {
      console.error(error);
      // Handle any errors here, such as displaying an error message to the user
    })
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <InformationPanel />

      <div className="flex-1 p-5 lg:p-10">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* ADD the chat message */}
            <div className="flex items-end justify-end">
              <div className="max-w-xs bg-green-500 text-white p-2 rounded-tl-lg rounded-bl-lg rounded-br-lg">
                <p className="text-sm">{inputCopy}</p>
              </div>
            </div>
            <div className="flex items-end justify-start">
              <div className="max-w-xs bg-gray-200 text-black p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                <p className="text-sm">{answer}</p>
              </div>
            </div>
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
