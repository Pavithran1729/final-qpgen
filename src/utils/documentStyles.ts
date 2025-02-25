import { AlignmentType, HeadingLevel } from "docx";

export const documentStyles = {
  fonts: {
    header: "Times New Roman",
    body: "Times New Roman",
  },
  spacing: {
    before: 120,
    after: 120,
  },
  margins: {
    top: 1440, // 1 inch in twips
    right: 1440,
    bottom: 1440,
    left: 1440,
  },
  defaultFontSize: 24, // 12pt
  headerFontSize: 28, // 14pt
  tableBorders: {
    top: { style: "single", size: 1 },
    bottom: { style: "single", size: 1 },
    left: { style: "single", size: 1 },
    right: { style: "single", size: 1 },
  },
};