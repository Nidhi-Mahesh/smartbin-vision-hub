import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCodkQ54z31P2HGdF5kxB2L__NOrzIuT8Y",
  databaseURL: "https://smartbin-b7000-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 