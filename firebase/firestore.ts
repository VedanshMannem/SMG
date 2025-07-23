import { getFirestore } from "@firebase/firestore";
import app from "./clientApp";

const db = getFirestore(app);
export default db;