import Papa from "papaparse";

export const parseCSV = async <T>(url: string): Promise<T[]> => {
  const response = await fetch(url);
  const text = await response.text();
  const result = Papa.parse<T>(text, { header: true });
  return result.data;
};

