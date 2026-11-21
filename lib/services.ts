export type Service = {
  number: string;
  name: string;
  category: string;
  description: string;
  operation: string;
  repository: string;
  tone: "blue" | "orange" | "red" | "gray";
};

export const services: Service[] = [
  {
    number: "01",
    name: "HACKER BLOG",
    category: "Security media",
    description:
      "Security news, technical explainers, and research notes presented with clear sourcing and context.",
    operation:
      "A collection and editorial workflow separates source material, analysis, translation, review, and publication.",
    repository: "https://github.com/lazysecure/hacker-blog",
    tone: "blue"
  },
  {
    number: "02",
    name: "Security Community",
    category: "Community",
    description:
      "A place for people interested in information security to exchange knowledge and discuss technical topics.",
    operation:
      "Community discussions are organized around shared topics, with moderation and clear participation guidelines.",
    repository: "https://github.com/lazysecure/security-community",
    tone: "orange"
  },
  {
    number: "03",
    name: "Virus Archive",
    category: "Threat reference",
    description:
      "A reference archive for malware-related identifiers, historical context, and defensive research.",
    operation:
      "Entries focus on non-executable reference data, hashes, detection names, analysis summaries, and source references.",
    repository: "https://github.com/lazysecure/virus-archive",
    tone: "red"
  },
  {
    number: "04",
    name: "Documentation",
    category: "Knowledge base",
    description:
      "Technical documentation and reference material for lazysecure projects and services.",
    operation:
      "Documentation is maintained as version-controlled content alongside the projects it describes.",
    repository: "https://github.com/lazysecure/docs",
    tone: "gray"
  }
];
