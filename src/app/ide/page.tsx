import PythonIDE from "@/components/ide/PythonIDE";

export const metadata = {
  title: "Ascension Python IDE",
  description: "A responsive, browser-based Python IDE with a real execution sandbox.",
};

export default function IDEPage() {
  return <PythonIDE />;
}
