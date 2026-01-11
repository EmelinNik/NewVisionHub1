import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// --- ИНСТРУКЦИЯ ---
// 1. Зайди в Project Settings в Firebase Console.
// 2. Скопируй объект firebaseConfig.
// 3. Вставь значения ниже.

const firebaseConfig = {
  apiKey: "ВСТАВЬ_СЮДА_API_KEY",           // Пример: "AIzaSyDOCAbC..."
  authDomain: "ВСТАВЬ_СЮДА_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://ВСТАВЬ_СЮДА_PROJECT_ID-default-rtdb.firebaseio.com", // Убедись, что ссылка верная (из раздела Realtime Database)
  projectId: "ВСТАВЬ_СЮДА_PROJECT_ID",
  storageBucket: "ВСТАВЬ_СЮДА_PROJECT_ID.appspot.com",
  messagingSenderId: "ВСТАВЬ_СЮДА_SENDER_ID",
  appId: "ВСТАВЬ_СЮДА_APP_ID"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };