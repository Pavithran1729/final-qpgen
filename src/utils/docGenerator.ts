import { Document, Packer, Paragraph, AlignmentType, TextRun, Table, TableRow, TableCell, BorderStyle, TableLayoutType, WidthType, convertInchesToTwip } from "docx";
import { FormData } from "@/types/form";
import { MappedQuestion } from "@/types/question";

const calculateTotalMarks = (questions: MappedQuestion[]): number => {
  return questions.reduce((total, question) => {
    // For OR questions, only count the main question's marks
    const questionMarks = Number(question.marks) || 0;
    return total + questionMarks;
  }, 0);
};

const createQuestionTable = (questions: MappedQuestion[], startIndex: number) => {
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [
      convertInchesToTwip(0.5),  // Question number
      convertInchesToTwip(6.0),  // Content
      convertInchesToTwip(0.5),  // Marks
      convertInchesToTwip(0.7),  // CO Level
      convertInchesToTwip(0.5)   // K Level
    ],
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.NIL },
      bottom: { style: BorderStyle.NIL },
      left: { style: BorderStyle.NIL },
      right: { style: BorderStyle.NIL },
      insideHorizontal: { style: BorderStyle.NIL },
      insideVertical: { style: BorderStyle.NIL },
    },
    rows: questions.flatMap((question, index) => {
      const questionNumber = startIndex + index + 1;
      const rows = [];

      // Main question row
      rows.push(new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ 
                text: question.hasOr === "true" ? `${questionNumber}.a.` : `${questionNumber}.`, 
                size: 24, 
                font: "Times New Roman" 
              })],
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60 },
            })],
            verticalAlign: "center",
            width: { size: 5, type: "pct" },
            margins: { left: convertInchesToTwip(0.1) },
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: question.content, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.LEFT,
              spacing: { before: 60, after: 60 },
            })],
            verticalAlign: "center",
            width: { size: 75, type: "pct" },
            margins: { left: convertInchesToTwip(0.1) },
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${question.marks || ''}`, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
            })],
            width: { size: 5, type: "pct" },
            verticalAlign: "center",
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${question.coLevel || ''}`, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 60, after: 60 },
            })],
            width: { size: 10, type: "pct" },
            verticalAlign: "center",
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${question.kLevel || ''}`, size: 24, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 60, after: 60 },
            })],
            width: { size: 5, type: "pct" },
            verticalAlign: "center",
            borders: {
              top: { style: BorderStyle.NIL },
              bottom: { style: BorderStyle.NIL },
              left: { style: BorderStyle.NIL },
              right: { style: BorderStyle.NIL },
            },
          }),
        ],
      }));

      // OR question row if exists
      if (question.hasOr === "true" && question.orContent) {
        // Add OR row with invisible borders
        rows.push(new TableRow({
          children: Array(5).fill(null).map((_, index) => 
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: index === 1 ? "OR" : "", // Only show "OR" in the second column
                  size: 24, 
                  font: "Times New Roman",
                  bold: true 
                })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
              })],
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
              width: index === 1 ? { size: 75, type: "pct" } : { size: 5, type: "pct" },
            })
          ),
        }));

        // Add the OR question with b numbering
        rows.push(new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: `${questionNumber}.b.`, 
                  size: 24, 
                  font: "Times New Roman" 
                })],
                alignment: AlignmentType.LEFT,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
              width: { size: 5, type: "pct" },
              margins: { left: convertInchesToTwip(0.1) },
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: question.orContent, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.LEFT,
                spacing: { before: 60, after: 60 },
              })],
              verticalAlign: "center",
              width: { size: 75, type: "pct" },
              margins: { left: convertInchesToTwip(0.1) },
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `${question.orMarks || question.marks || ''}`, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 20, after: 20 },
              })],
              width: { size: 5, type: "pct" },
              verticalAlign: "center",
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `${question.orCoLevel || question.coLevel || ''}`, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              })],
              width: { size: 10, type: "pct" },
              verticalAlign: "center",
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `${question.orKLevel || question.kLevel || ''}`, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              })],
              width: { size: 5, type: "pct" },
              verticalAlign: "center",
              borders: {
                top: { style: BorderStyle.NIL },
                bottom: { style: BorderStyle.NIL },
                left: { style: BorderStyle.NIL },
                right: { style: BorderStyle.NIL },
              },
            }),
          ],
        }));
      }

      return rows;
    }),
  });

  return table;
};

const createPartHeader = (part: string, marks: string) => {
  return new Paragraph({
    children: [
      new TextRun({ 
        text: `PART-${part} ${marks}`,
        size: 24, 
        font: "Times New Roman"
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    border: {
      bottom: { style: BorderStyle.NIL }
    }
  });
};

const createCODistributionTable = (questions: MappedQuestion[]) => {
  // Calculate CO distribution (only using main question marks for OR questions)
  const coDistribution = questions.reduce((acc: { [key: string]: number }, question) => {
    // Add main question marks
    const mainCO = question.coLevel || '';
    acc[mainCO] = (acc[mainCO] || 0) + (Number(question.marks) || 0);
    
    // Add OR question marks if present
    if (question.hasOr === "true" && question.orCoLevel) {
      const orCO = question.orCoLevel;
      acc[orCO] = (acc[orCO] || 0) + (Number(question.orMarks || question.marks) || 0);
    }
    return acc;
  }, {});

  // Set fixed percentage of 100 for each CO
  const percentages: { [key: string]: number } = {};
  Object.keys(coDistribution).forEach(co => {
    percentages[co] = 100;
  });

  // Create table rows
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: "Evaluation", size: 24, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
        })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
      ...Array.from({ length: 6 }, (_, i) => 
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: `CO${i + 1}`, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
          })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
        })
      ),
    ],
  });

  const marksRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: "Marks", size: 24, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
        })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
      ...Array.from({ length: 6 }, (_, i) => {
        const co = `CO${i + 1}`;
        return new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ 
              text: `${coDistribution[co] || '-'}`, 
              size: 24, 
              font: "Times New Roman" 
            })],
            alignment: AlignmentType.CENTER,
          })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
        });
      }),
    ],
  });

  const percentageRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: "%", size: 24, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
        })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
      ...Array.from({ length: 6 }, (_, i) => {
        const co = `CO${i + 1}`;
        return new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ 
              text: `${percentages[co] || '-'}`, 
              size: 24, 
              font: "Times New Roman" 
            })],
            alignment: AlignmentType.CENTER,
          })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
        });
      }),
    ],
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [
      convertInchesToTwip(1.5),  // Evaluation
      ...Array(6).fill(convertInchesToTwip(1.25))  // CO1-CO6
    ],
    layout: TableLayoutType.FIXED,
    rows: [headerRow, marksRow, percentageRow],
  });
};

const createKnowledgeLevelLegend = () => {
  return new Paragraph({
    children: [
      new TextRun({ 
        text: "Knowledge Level: K1 – Remember, K2 – Understand, K3 – Apply, K4 – Analyze, K5 – Evaluate, K6 – Create",
        size: 24, 
        font: "Times New Roman"
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 240 }
  });
};

export const generateQuestionPaperDoc = async (formData: FormData, questions: MappedQuestion[]): Promise<Blob> => {
  const partAQuestions = questions.filter(q => q.part.toUpperCase() === 'A');
  const partBQuestions = questions.filter(q => q.part.toUpperCase() === 'B');
  const partCQuestions = questions.filter(q => q.part.toUpperCase() === 'C');

  const totalMarks = calculateTotalMarks([...partAQuestions, ...partBQuestions, ...partCQuestions]);
  const testCode = formData.tests[0]?.replace('UNIT TEST - ', 'UT') || 'UT1';

  // Convert semester number to word
  const semesterMap: { [key: string]: string } = {
    "1": "FIRST",
    "2": "SECOND",
    "3": "THIRD",
    "4": "FOURTH",
    "5": "FIFTH",
    "6": "SIXTH",
    "7": "SEVENTH",
    "8": "EIGHTH"
  };

  const semester = formData.semester[0];
  const semesterWord = semesterMap[semester] || semester;

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: "Question Paper Code", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 60 },
                  })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                  width: { size: 20, type: "pct" },
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: `${testCode}${formData.subject_code}`, size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 60 },
                  })],
                  width: { size: 10, type: "pct" },
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: "Register No", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 60 },
                  })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                  width: { size: 20, type: "pct" },
                }),
                new TableCell({
                  children: [new Paragraph("")],
                  width: { size: 15, type: "pct" },
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ST.PETER'S COLLEGE OF ENGINEERING AND TECHNOLOGY", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
           new Paragraph({
                  children: [
                    new TextRun({ text: "(An Autonomous Institution)", size: 24, font: "Times New Roman", bold: true }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 120 }
                }),
        new Paragraph({
          children: [
            new TextRun({ text: "AVADI, CHENNAI 600 054", size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `B.E./B.TECH - DEGREE EXAMINATIONS ${formData.date}`, size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${semesterWord} SEMESTER`, size: 24, font: "Times New Roman", bold: true }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: formData.tests[0] || '', size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `DEPARTMENT OF ${formData.department}`, size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${formData.subject_code} - ${formData.subject_name}`, size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `(Regulations ${formData.regulations[0] || '2021'})`, size: 24, font: "Times New Roman" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 360 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Duration: ${formData.duration} hours`, size: 24, font: "Times New Roman" })
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NIL, size: 0 },
                  bottom: { style: BorderStyle.NIL, size: 0 },
                  left: { style: BorderStyle.NIL, size: 0 },
                  right: { style: BorderStyle.NIL, size: 0 },
                },
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Max. Marks: ${totalMarks}`, size: 24, font: "Times New Roman" })
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NIL, size: 0 },
                  bottom: { style: BorderStyle.NIL, size: 0 },
                  left: { style: BorderStyle.NIL, size: 0 },
                  right: { style: BorderStyle.NIL, size: 0 },
                },
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
            ],
          })],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Answer ALL Questions", size: 24, font: "Times New Roman" })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 }
        }),
        createPartHeader("A", "(5 × 2 = 10 Marks)"),
        createQuestionTable(partAQuestions, 0),
        createPartHeader("B", "(2 × 12= 24 marks)"),
        createQuestionTable(partBQuestions, partAQuestions.length),
        createPartHeader("C", "(1 × 16= 16 marks)"),
        createQuestionTable(partCQuestions, partAQuestions.length + partBQuestions.length),
        new Paragraph({
          children: [
            new TextRun({ 
              text: "Distribution of CO's (Percentage wise)", 
              size: 24, 
              font: "Times New Roman",
              bold: true 
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240 }
        }),
        createCODistributionTable(questions),
        createKnowledgeLevelLegend()
      ],
    }],
  });

  return await Packer.toBlob(doc);
};
