export const categorizeComplaint = (text: string) => {
  const lower = text.toLowerCase();

  if (lower.includes("water")) return { category: "water", dept: "Water Dept" };
  if (lower.includes("road")) return { category: "road", dept: "Road Dept" };
  if (lower.includes("electricity")) return { category: "electricity", dept: "Electric Dept" };

  return { category: "other", dept: "General" };
};
