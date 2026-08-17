/**
 * Utility containing random test data generators for Playwright.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../test-data/credentials.json');

const jsonPath2 = path.join(__dirname, '../test-data/userData.json');
export const tatautility = {
  /**
   * Generates a random valid password restricted strictly to 8 characters.
   * Includes uppercase, lowercase, number, and special character.
   * @returns {string} 8-character password.
   */
  generatePassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + specialChars;

    // Guaranteed one character from each required set
    const required = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)]
    ];

    // Fill remaining 4 characters randomly from full set
    for (let i = 0; i < 4; i++) {
      required.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle characters to avoid predictable positions
    for (let i = required.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [required[i], required[j]] = [required[j], required[i]];
    }

    return required.join('');
  },

  /**
   * Generates a random email address (e.g. john.482@example.com).
   * @returns {string} Random email address.
   */
  generateEmail() {
    const names = [
      'john', 'jane', 'alex', 'emma', 'david',
      'sarah', 'michael', 'emily', 'daniel', 'olivia'
    ];
    const domains = ['example.com', 'test.com', 'mail.com', 'demo.org'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit number
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    return `${randomName}.${randomNumber}@${randomDomain}`;
  },

  getStoredCredentials() {
  const rawData = fs.readFileSync(jsonPath2, 'utf8');
  return JSON.parse(rawData);
},
saveCredentials(email, password) {
    if (!email || !password) {
      console.error('Failed to save credentials: email or password is empty!', { email, password });
      return;
    }

    const payload = { email, password };
    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
    console.log('Successfully saved credentials:', payload);
  }
};
