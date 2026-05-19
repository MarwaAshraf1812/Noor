import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adkarDataPath = path.join(__dirname, 'adhkarData.json');
const adkarAPI = 'https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json';

let cachedAdhkarData = null;

export const loadAdhkarData = async () => {
  if (cachedAdhkarData) return cachedAdhkarData;
  
  try {
    const fileExists = await fs.access(adkarDataPath).then(() => true).catch(() => false);
    if (fileExists) {
      const fileContent = await fs.readFile(adkarDataPath, 'utf-8');
      if (fileContent.trim().length > 0) {
        cachedAdhkarData = JSON.parse(fileContent);
        return cachedAdhkarData;
      }
    }
  } catch (error) {
    console.error("Error reading local adhkarData.json:", error);
  }

  try {
    console.log("Adhkar data file empty or missing. Fetching from API...");
    const response = await axios.get(adkarAPI);
    if (response.data) {
      cachedAdhkarData = response.data;
      await fs.writeFile(adkarDataPath, JSON.stringify(cachedAdhkarData, null, 2), 'utf-8');
      console.log("✅ Adhkar data seeded successfully");
      return cachedAdhkarData;
    }
  } catch (error) {
    console.error("Error fetching Adhkar data from API:", error);
  }

  return cachedAdhkarData || {};
};

// Helper function to flatten the nested arrays in the Nawaf API (e.g., grouped Surahs inside Morning Azkar)
const flattenAdhkar = (items) => {
  if (!items) return [];
  const flatList = items.flat(Infinity);

  return flatList.filter(item => item && item.content && item.category !== 'stop');
};

export const getAdhkarByCategory = async (categoryName) => {
  const allData = await loadAdhkarData();
  const categoryData = allData[categoryName];
  return flattenAdhkar(categoryData);
};