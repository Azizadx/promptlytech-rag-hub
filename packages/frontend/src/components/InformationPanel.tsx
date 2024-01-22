import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PromptCombobox from "./PromptCombobox";
import { useState } from "react";
import { Percent, Shapes } from "lucide-react";

type Props = {};

const InformationPanel = (props: Props) => {
  const [selectedPrompt, setSelectedPrompt] = useState<{
    prompt: string;
    response: {
      accuracy: string;
      classification: string;
    };
  }>({
    prompt:
      "",
    response: {
      accuracy: "",
      classification: "",
    },
  });
  return (
    <div className="bg-gradient-to-br from-[#394F68] to-[#18387E] text-white p-10">
      <PromptCombobox
        selectedPrompt={selectedPrompt}
        setSelectedPrompt={setSelectedPrompt}
      />
      <hr className="my-5 md:my-10" />
      <div className="mb-5 mt-5 flex items-center justify-between space-x-10 w-[339px]">
        <div>
          <p className="text-xl">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <p className="font-extralight">
            Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>

        <p className="text-xl font-bold uppercase">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
      </div>
      <hr className="my-5 md:my-10" />
      {selectedPrompt.prompt !== "" && (
        <div className="flex w-[339px] justify-between space-x-2">
        <Card className="w-1/2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0ea5e9]">
              Accuracy
            </CardTitle>
            <Percent className="text-muted-foreground h-4 w-4 text-[#0ea5e9]" />
          </CardHeader>
          <CardContent>
            <div className="text-center text-2xl font-bold text-[#0ea5e9] pb-2">
              {selectedPrompt.response.accuracy}
            </div>
            <p className="text-muted-foreground text-center text-xs text-[#0ea5e9]">
              Accuracy within context.
            </p>
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0ea5e9]">
              Classification
            </CardTitle>
            <Shapes className="text-muted-foreground h-4 w-4 text-[#0ea5e9]" />
          </CardHeader>
          <CardContent>
            <div className="text-center text-2xl font-bold text-[#0ea5e9] pb-2">
              {selectedPrompt.response.classification}
            </div>
            <p className="text-muted-foreground text-center text-xs text-[#0ea5e9]">
              Relation with context.
            </p>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
};

export default InformationPanel;
