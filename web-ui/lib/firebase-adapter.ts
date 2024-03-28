import { de } from "date-fns/locale";
import { firebaseApp } from "./firebase";
import {
  getFirestore,
  or,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  increment,
} from "firebase/firestore";

type Query = {
  field: string;
  operator:
    | "<"
    | "<="
    | "=="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "array-contains-any";
  value: string | number | boolean | string[] | number[] | boolean[];
};

type GetRequest = {
  collectionPath: string;
  id?: string;
  queryArray?: Query[];
  queryType?: "and" | "or";
};

type SetRequest = {
  collectionPath: string;
  id: string;
  data: any;
};

type PatchRequest = {
  collectionPath: string;
  id: string;
  data: any;
};

type DeleteRequest = {
  collectionPath: string;
  id: string;
};

type IncrementRequest = {
  collectionPath: string;
  id: string;
  field: string;
  value: number;
};

type ArrayUpdateRequest = {
  collectionPath: string;
  id: string;
  field: string;
  value: any;
  type: "add" | "remove";
};

class FirebaseAdapter {
  db: Firestore;

  constructor() {
    this.db = getFirestore(firebaseApp);
  }

  getFirestore() {
    return this.db;
  }

  async get(request?: GetRequest): Promise<any> {
    if (!request) {
      throw new Error("Request is required");
    }

    try {
      const { collectionPath, id, queryArray, queryType } = request;
      const collectionRef = collection(this.db, collectionPath);

      if (id) {
        const docSnap = await getDoc(doc(collectionRef, id));
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          throw new Error("Document does not exist");
        }
      }

      if (queryArray) {
        if (queryType === "or") {
          const queries = queryArray.map((query) =>
            where(query.field, query.operator, query.value),
          );
          const docs = await getDocs(query(collectionRef, or(...queries)));

          if (docs.empty) {
            return null;
          }

          return docs.docs.map((doc) => doc.data());
        } else {
          const queries = queryArray.map((query) =>
            where(query.field, query.operator, query.value),
          );
          const docs = await getDocs(query(collectionRef, ...queries));

          if (docs.empty) {
            return null;
          }

          return docs.docs.map((doc) => doc.data());
        }
      }

      // Return all documents in collection
      const querySnap = await getDocs(collectionRef);
      if (querySnap.empty) {
        return null;
      }

      return querySnap.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async set(request: SetRequest) {
    if (!request) {
      throw new Error("Request is required");
    }

    try {
      const { collectionPath, id, data } = request;
      const collectionRef = collection(this.db, collectionPath);

      await setDoc(doc(collectionRef, id), data);

      return "Success";
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async patch(request: PatchRequest) {
    if (!request) {
      throw new Error("Request is required");
    }

    try {
      const { collectionPath, id, data } = request;
      const collectionRef = collection(this.db, collectionPath);

      await setDoc(doc(collectionRef, id), data, { merge: true });

      return "Success";
    } catch (error) {
      throw new Error(String(error));
    }
  }

  // Detele function, similar to get
  async delete(request?: DeleteRequest) {
    if (!request) {
      throw new Error("Request is required");
    }

    try {
      const { collectionPath, id } = request;
      const collectionRef = collection(this.db, collectionPath);

      if (id) {
        await deleteDoc(doc(collectionRef, id));
        return "Success";
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async increment(request: IncrementRequest) {
    if (!request) {
      throw new Error("Request is required");
    }

    try {
      const { collectionPath, id, field, value } = request;
      const collectionRef = collection(this.db, collectionPath);

      await updateDoc(doc(collectionRef, id), { [field]: increment(value) });

      return "Success";
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async arrayUpdate(request: ArrayUpdateRequest) {
    if (!request) {
      throw new Error("Request is required");
    }

    console.log("arrayUpdate", request);

    try {
      const { collectionPath, id, field, value, type } = request;
      const collectionRef = collection(this.db, collectionPath);

      if (type === "add") {
        await updateDoc(doc(collectionRef, id), { [field]: arrayUnion(value) });
      } else {
        await updateDoc(doc(collectionRef, id), {
          [field]: arrayRemove(value),
        });
      }

      return "Success";
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

export const firebaseAdapter = new FirebaseAdapter();
