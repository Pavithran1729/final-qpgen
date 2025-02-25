import { FormData } from "@/types/form";
import { MappedQuestion } from "@/types/question";
import { generateQuestionPaperDoc } from "./docGenerator";

const sampleFormData: FormData = {
  department: ["Computer Science/Information Technology"],
  year: ["3"],
  semester: ["7"],
  subject_code: "CBM",
  subject_name: "Wearable Devices",
  tests: ["Unit 3"],
  duration: "2",
  date: ["July/Dec 2024"],
};

const sampleQuestions: MappedQuestion[] = [
  // Part A Questions
  {
    id: "q1",
    content: "Define Body area network.",
    marks: "2",
    kLevel: "1",
    coLevel: "CO3",
    part: "A",
    hasOr: "false",
  },
  {
    id: "q2",
    content: "State WBAN Security.",
    marks: "2",
    kLevel: "1",
    coLevel: "CO3",
    part: "A",
    hasOr: "false",
  },
  {
    id: "q3",
    content: "Discuss the role of IEEE 802.15.",
    marks: "2",
    kLevel: "1",
    coLevel: "CO3",
    part: "A",
    hasOr: "false",
  },
  {
    id: "q4",
    content: "Classify the types of communication in body sensor network.",
    marks: "2",
    kLevel: "2",
    coLevel: "CO3",
    part: "A",
    hasOr: "false",
  },
  {
    id: "q5",
    content: "Explain the various fields which are used in WBAN.",
    marks: "2",
    kLevel: "2",
    coLevel: "CO3",
    part: "A",
    hasOr: "false",
  },

  // Part B Questions
  {
    id: "q6",
    content: "Explain about the technical challenges in BAN architecture design.",
    marks: "12",
    kLevel: "2",
    coLevel: "CO3",
    part: "B",
    hasOr: "true",
    orContent: "Discuss about the BAN Architecture and workflow with neat diagram.",
    orMarks: "12",
    orKLevel: "2",
    orCoLevel: "CO3",
  },
  {
    id: "q7",
    content: "Explain about the WBAN Standards and Technologies.",
    marks: "12",
    kLevel: "2",
    coLevel: "CO3",
    part: "B",
    hasOr: "true",
    orContent: "Discuss about the wireless communication technologies for wearable systems.",
    orMarks: "12",
    orKLevel: "2",
    orCoLevel: "CO3",
  },

  // Part C Question
  {
    id: "q8",
    content: "Describe in detail about the system security and reliability for wearable technology.",
    marks: "16",
    kLevel: "2",
    coLevel: "CO3",
    part: "C",
    hasOr: "true",
    orContent: "Explain about the security issues in WBAN network.",
    orMarks: "16",
    orKLevel: "2",
    orCoLevel: "CO3",
  },
];

export const generateSampleQuestionPaper = () => {
  const doc = generateQuestionPaperDoc(sampleFormData, sampleQuestions);
  return doc;
};
