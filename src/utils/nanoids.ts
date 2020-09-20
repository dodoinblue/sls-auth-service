import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz';
export const generateNanoId = customAlphabet(alphabet, 21);
export const generateLongNanoId = customAlphabet(alphabet, 48);
const numbers = '0123456789'
export const generateNumbers = customAlphabet(numbers, 6);