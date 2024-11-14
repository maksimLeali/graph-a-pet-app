import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the URL from command-line arguments
const args = process.argv.slice(2);
const urlArg = args.find(arg => arg.startsWith('--url='));
const baseUrl = urlArg ? urlArg.split('=')[1] : process.env.VITE_BASE_URL_TRANSLATIONS;

if (!baseUrl) {
  console.error('Base URL is not defined. Please provide it as an argument or set it in the .env file.');
  process.exit(1);
}

console.log(`Using base URL: ${baseUrl}`);

// Define the URL of the endpoint
const endpointUrl = `${baseUrl}/translations/app`;

// Function to fetch data from the endpoint and save it to a JSON file
async function fetchAndSaveTranslations() {
  try {
    // Make the HTTP GET request
    const response = await fetch(endpointUrl);

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get the data from the response
    const { data } = await response.json();

    // Convert the data to JSON format
    const jsonData = JSON.stringify(data, null, 2);

    // Define the path where the JSON file will be saved
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'src', 'i18n', 'translations.json');

    // Write the JSON data to a file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('JSON file has been saved.');
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
// Call the function to fetch and save translations
fetchAndSaveTranslations();
