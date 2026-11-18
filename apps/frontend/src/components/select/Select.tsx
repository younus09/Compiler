import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectProps {
  language: string;
  setLanguage: (language: string) => void;
}
const languageMap: Record<string, string> = {
  c: "c",
  js: "javascript",
  py: "python",
};

function LanguageSelect({ language, setLanguage }: LanguageSelectProps) {
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[150px] h-9">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="c">C</SelectItem>
        <SelectItem value="py">Python</SelectItem>
        <SelectItem value="js">JavaScript</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default LanguageSelect;
