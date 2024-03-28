import { initializeApp } from "firebase/app";

import { firebaseConfig } from "@/utils/config";

export const firebaseApp = initializeApp(firebaseConfig);
