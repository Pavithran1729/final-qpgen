import { Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, BorderStyle, HeightRule, TableLayoutType, WidthType } from "docx";
import { documentStyles } from "./documentStyles";
import { MappedQuestion } from "@/types/question";

export const createHeaderTable = (formData: any) => {
  return new Table({
    rows: [
      new TableRow({
        height: { value: 400, rule: HeightRule.EXACT },
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [],
              }),
            ],
            width: { size: 50, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Reg. No.",
                    bold: true,
                    font: documentStyles.fonts.header,
                    size: 24,
                  }),
                ],
                spacing: { before: 120, after: 120 },
                alignment: AlignmentType.RIGHT,
              }),
            ],
            width: { size: 15, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            verticalAlign: "center",
          }),
          ...Array(12).fill(null).map(() => 
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "", font: documentStyles.fonts.header })],
                  spacing: { before: 120, after: 120 },
                }),
              ],
              width: { size: 2.5, type: "pct" },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              },
              verticalAlign: "center",
              margins: {
                top: 40,
                bottom: 40,
                left: 40,
                right: 40,
              },
              shading: { fill: "FFFFFF" },
            })
          ),
          new TableCell({
            children: [new Paragraph({ children: [] })],
            width: { size: 5, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Question Paper Code",
                    bold: true,
                    font: documentStyles.fonts.header,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 120, after: 120 },
              }),
            ],
            width: { size: 50, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.questionPaperCode || "UTI CBM170",
                    font: documentStyles.fonts.header,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { before: 120, after: 120 },
              }),
            ],
            columnSpan: 13,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
        ],
      }),
    ],
    width: { size: 100, type: "pct" },
    layout: TableLayoutType.FIXED,
  });
};

export const createTimeMarksTable = () => {
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Time: 2 Hours",
                    bold: true,
                    font: documentStyles.fonts.header,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            width: { size: 50, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Max Marks: 50",
                    bold: true,
                    font: documentStyles.fonts.header,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
            width: { size: 50, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
        ],
      }),
    ],
    width: { size: 100, type: "pct" },
  });
};

export const createPartBHeader = () => {
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PART – B - Answer any 2     ( 2 × 12= 24 marks)",
                    font: documentStyles.fonts.body,
                    size: 24,
                  }),
                ],
              }),
            ],
            width: { size: 70, type: "pct" },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Marks",
                    font: documentStyles.fonts.body,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 10, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "K-Level",
                    font: documentStyles.fonts.body,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 10, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CO",
                    font: documentStyles.fonts.body,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 10, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),
        ],
      }),
    ],
    width: { size: 100, type: "pct" },
  });
};

export const createPartCHeader = () => {
  return new Paragraph({
    children: [
      new TextRun({
        text: "PART – C ( 1×16= 16 marks)",
        font: documentStyles.fonts.body,
        size: 24,
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
  });
};

export const createQuestionRow = (index: number, question: MappedQuestion, part: string, isOr: boolean = false) => {
  const questionText = isOr ? (question.orContent || "") : question.content;
  const marks = isOr ? (question.orMarks || question.marks) : question.marks;
  const klevel = isOr ? (question.orKLevel || question.kLevel) : question.kLevel;
  const co = isOr ? (question.orCoLevel || question.coLevel) : question.coLevel;

  // Determine question number format
  let questionNumber = "";
  if (isOr) {
    questionNumber = "OR";
  } else {
    switch (part) {
      case 'A':
        questionNumber = index.toString();
        break;
      case 'B':
        questionNumber = `${index}`;
        break;
      case 'C':
        questionNumber = `${index}`;
        break;
      default:
        questionNumber = index.toString();
    }
  }

  // Create cells for the row
  const cells = [
    // Question number cell
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: questionNumber,
              bold: !isOr,
              font: documentStyles.fonts.body,
              size: 24,
            }),
          ],
          alignment: isOr ? AlignmentType.CENTER : AlignmentType.LEFT,
        }),
      ],
      width: { size: 5, type: "pct" },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
    }),

    // Question text cell
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: questionText,
              font: documentStyles.fonts.body,
              size: 24,
            }),
          ],
        }),
      ],
      width: { size: part === 'A' ? 75 : 95, type: "pct" },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
    })
  ];

  // Add CO and K-Level cells for Part A
  if (part === 'A') {
    cells.push(
      // CO Level cell
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `CO${co || ''}`,
                font: documentStyles.fonts.body,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 10, type: "pct" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
      // K Level cell
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `K${klevel || ''}`,
                font: documentStyles.fonts.body,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 10, type: "pct" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      })
    );
  }

  return new TableRow({
    children: cells,
  });
};

export const createDistributionTable = () => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Distribution of COs (Percentage wise)", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
            columnSpan: 7,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Evaluation", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          }),
          ...Array.from({ length: 6 }, (_, i) => new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: `CO${i + 1}`, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          })),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "Marks", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          }),
          ...Array.from({ length: 6 }, () => new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "-", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          })),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "%", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          }),
          ...Array.from({ length: 6 }, () => new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: "-", size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER
            })],
          })),
        ],
      }),
    ],
  });
};