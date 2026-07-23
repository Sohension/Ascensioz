export type PythonPracticeQuestion = {
  id: string;
  title: string;
  description: string;
  expectedOutput: string;
  starterCode: string;
  difficulty: "beginner";
  reward_xp: number;
  reward_coins: number;
  logic_weight: number;
};

const questions: PythonPracticeQuestion[] = [
  {
    id: "python-01-hello-world",
    title: "Print Hello, World!",
    description: 'Print exactly "Hello, World!".',
    expectedOutput: "Hello, World!",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-02-print-variable",
    title: "Print a Variable",
    description: 'Create a variable named greeting with the value "Hello, Python!", then print it.',
    expectedOutput: "Hello, Python!",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-03-sum-variables",
    title: "Add Two Variables",
    description: "Create variables first_number = 7 and second_number = 5, then print their sum.",
    expectedOutput: "12",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-04-string-input",
    title: "Echo a String",
    description: "Read one string with input() and print the value that was entered.",
    expectedOutput: "The entered string",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-05-integer-sum",
    title: "Add Two Inputs",
    description: "Read two integer inputs and print their sum.",
    expectedOutput: "The sum of the two integers",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-06-data-types",
    title: "Explore Basic Data Types",
    description: "Create an int, float, str, and bool, then print each value and its type.",
    expectedOutput: "Four values with their types",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-07-arithmetic",
    title: "Practice Arithmetic",
    description: "Using 10 and 3, print the results of +, -, *, and / on separate lines.",
    expectedOutput: "13\n7\n30\n3.3333333333333335",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-08-f-strings",
    title: "Format a Message",
    description: 'Create name = "Ada" and age = 36, then print: Ada is 36 years old.',
    expectedOutput: "Ada is 36 years old.",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-09-convert-integer",
    title: "Convert Text to an Integer",
    description: "Read a number as a string, convert it to an integer, and print the result.",
    expectedOutput: "The converted integer",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
  {
    id: "python-10-sum-message",
    title: "Mini Challenge: Sum with a Message",
    description: 'Read two numbers and print a descriptive result such as "The sum is 12".',
    expectedOutput: "The sum with a descriptive message",
    starterCode: "",
    difficulty: "beginner",
    reward_xp: 10,
    reward_coins: 5,
    logic_weight: 1,
  },
];

export const pythonPracticeQuestions = questions;

export function getPythonPracticeQuestion(id: string) {
  return questions.find((question) => question.id === id) ?? null;
}

function hasAssignment(code: string, name: string) {
  return new RegExp(`(?:^|\\n)\\s*${name}\\s*=`, "m").test(code);
}

export function validatePythonPracticeSolution(id: string, code: string) {
  const normalized = code.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  switch (id) {
    case "python-01-hello-world":
      return /print\s*\(\s*["']hello, world!["']\s*\)/.test(normalized);
    case "python-02-print-variable":
      return hasAssignment(code, "greeting") && /print\s*\(\s*greeting\s*\)/.test(normalized);
    case "python-03-sum-variables":
      return hasAssignment(code, "first_number") && hasAssignment(code, "second_number") && /print\s*\(\s*first_number\s*\+\s*second_number\s*\)/.test(normalized);
    case "python-04-string-input":
      return /input\s*\(/.test(normalized) && /print\s*\(/.test(normalized);
    case "python-05-integer-sum":
      return (normalized.match(/input\s*\(/g) ?? []).length >= 2 && /int\s*\(/.test(normalized) && /print\s*\(.*\+/.test(normalized);
    case "python-06-data-types":
      return /int\s*\(/.test(normalized) && /float\s*\(/.test(normalized) && /str\s*\(/.test(normalized) && /bool\s*\(/.test(normalized);
    case "python-07-arithmetic":
      return /\+/.test(normalized) && /-/.test(normalized) && /\*/.test(normalized) && /\//.test(normalized);
    case "python-08-f-strings":
      return hasAssignment(code, "name") && hasAssignment(code, "age") && /print\s*\(\s*f["']/.test(normalized);
    case "python-09-convert-integer":
      return /int\s*\(\s*input\s*\(/.test(normalized) && /print\s*\(/.test(normalized);
    case "python-10-sum-message":
      return (normalized.match(/input\s*\(/g) ?? []).length >= 2 && /print\s*\(\s*f["'].*sum/.test(normalized) && /\+/.test(normalized);
    default:
      return false;
  }
}