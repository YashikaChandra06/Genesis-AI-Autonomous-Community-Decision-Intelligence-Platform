import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  getDoc,
  Firestore,
  DocumentData
} from "firebase/firestore";

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "operator" | "member";
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  department: string;
  action: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "acknowledged" | "resolved";
  department: string;
  coordinates: [number, number];
  timestamp: string;
}

// ----------------------------------------------------
// Determine Mode: Real Firebase vs LocalStorage Mock
// ----------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const hasFirebaseKeys = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain
);

let firebaseApp;
let firebaseAuth: Auth | undefined;
let firestoreDb: Firestore | undefined;

if (hasFirebaseKeys) {
  try {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
  } catch (error) {
    console.error("Failed to initialize Firebase SDK, falling back to mock:", error);
  }
}

export const isMockMode = !hasFirebaseKeys || !firebaseAuth || !firestoreDb;

if (isMockMode) {
  console.warn("Genesis AI is running in SIMULATION MODE. All Auth & Database actions persist locally in browser storage.");
}

// ----------------------------------------------------
// Mock Data Seed Helpers (runs on startup)
// ----------------------------------------------------
const DEFAULT_USER: UserProfile = {
  uid: "mock-admin-uid",
  email: "admin@genesis.ai",
  displayName: "Alex Carter (Operator)",
  role: "admin",
  createdAt: new Date().toISOString()
};

const DEFAULT_ALERTS = [
  {
    id: "alert-1",
    title: "Flooding Hazard: Yamuna River Sector A",
    description: "Water levels exceeded threshold by 1.2m. Local drainage operating at maximum capacity.",
    severity: "critical",
    department: "infrastructure",
    action: "Deploy mobile barrier unit and divert Yamuna Expressway traffic.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    status: "active"
  },
  {
    id: "alert-2",
    title: "Grid Congestion: Substation 12B",
    description: "Grid load elevated to 94% due to high summer air-conditioning usage.",
    severity: "high",
    department: "energy",
    action: "Initiate load-balancing protocol and notify reserve stations.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    status: "active"
  },
  {
    id: "alert-3",
    title: "Hospital Capacity Warning",
    description: "AIIMS Delhi ICU occupancy reached 91%.",
    severity: "medium",
    department: "health",
    action: "Divert non-emergency ambulances to RML Hospital.",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
    status: "acknowledged"
  },
  {
    id: "alert-4",
    title: "AQI Spike: Connaught Place Outer Circle",
    description: "PM2.5 levels detected at 154 (Unhealthy) due to low wind dispersal.",
    severity: "medium",
    department: "health",
    action: "Issue air advisory warning for children and elderly in Connaught Place.",
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    status: "acknowledged"
  }
];

const DEFAULT_INCIDENTS = [
  {
    id: "inc-1",
    title: "Minor Road Collapse",
    description: "Water pipe burst caused minor sinkhole near Gol Dak Khana.",
    severity: "medium",
    status: "acknowledged",
    department: "traffic",
    coordinates: [28.6220, 77.2100] as [number, number],
    timestamp: new Date().toISOString()
  },
  {
    id: "inc-2",
    title: "Critical Power Failure",
    description: "High winds downed utility poles near Mandi House.",
    severity: "critical",
    status: "active",
    department: "infrastructure",
    coordinates: [28.6280, 77.2350] as [number, number],
    timestamp: new Date().toISOString()
  },
  {
    id: "inc-3",
    title: "Water Contamination Alert",
    description: "High turbidity detected in Yamuna outflow canal.",
    severity: "high",
    status: "active",
    department: "infrastructure",
    coordinates: [28.6150, 77.2500] as [number, number],
    timestamp: new Date().toISOString()
  }
];

// Initialize localStorage seed
const initMockDatabase = () => {
  if (typeof window === "undefined") return;
  
  // Force reset if existing seed uses San Francisco coordinates (longitude < 0)
  let forceReset = false;
  try {
    const existing = localStorage.getItem("genesis_incidents");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].coordinates && parsed[0].coordinates[1] < 0) {
        forceReset = true;
      }
    }
  } catch (e) {
    console.error("Migration error check failed:", e);
  }

  if (forceReset) {
    localStorage.removeItem("genesis_users");
    localStorage.removeItem("genesis_alerts");
    localStorage.removeItem("genesis_incidents");
  }

  if (!localStorage.getItem("genesis_users")) {
    localStorage.setItem("genesis_users", JSON.stringify({ [DEFAULT_USER.uid]: DEFAULT_USER }));
  }
  if (!localStorage.getItem("genesis_alerts")) {
    localStorage.setItem("genesis_alerts", JSON.stringify(DEFAULT_ALERTS));
  }
  if (!localStorage.getItem("genesis_incidents")) {
    localStorage.setItem("genesis_incidents", JSON.stringify(DEFAULT_INCIDENTS));
  }
};
initMockDatabase();

// ----------------------------------------------------
// Unified Authentication Client Services
// ----------------------------------------------------
export const authService = {
  // Listen to auth state updates
  onAuthState: (callback: (user: UserProfile | null) => void) => {
    if (typeof window === "undefined") return () => {};

    if (!isMockMode) {
      return onAuthStateChanged(firebaseAuth!, async (fbUser) => {
        if (fbUser) {
          // Fetch additional profile fields from Firestore
          try {
            const userDoc = await getDoc(doc(firestoreDb as Firestore, "users", fbUser.uid));
            if (userDoc.exists()) {
              callback(userDoc.data() as UserProfile);
            } else {
              // Create default profile for Google logins
              const profile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || "",
                displayName: fbUser.displayName || "Community Member",
                role: "member",
                createdAt: new Date().toISOString()
              };
              await setDoc(doc(firestoreDb as Firestore, "users", fbUser.uid), profile);
              callback(profile);
            }
          } catch (e) {
            console.error("Firestore user profile fetch error:", e);
            // Fallback profile
            callback({
              uid: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || "User",
              role: "member",
              createdAt: new Date().toISOString()
            });
          }
        } else {
          callback(null);
        }
      });
    } else {
      // Mock Auth Listener
      const checkMockUser = () => {
        const loggedUid = sessionStorage.getItem("genesis_logged_uid");
        if (loggedUid) {
          const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
          callback(users[loggedUid] || null);
        } else {
          callback(null);
        }
      };
      
      // Initial check
      checkMockUser();
      
      // Dispatch listener via window events
      const handleAuthChange = () => checkMockUser();
      window.addEventListener("genesis-auth-changed", handleAuthChange);
      return () => window.removeEventListener("genesis-auth-changed", handleAuthChange);
    }
  },

  getCurrentUser: (): UserProfile | null => {
    if (typeof window === "undefined") return null;
    if (!isMockMode) {
      const fbUser = firebaseAuth!.currentUser;
      if (!fbUser) return null;
      // In SSR or synchronous call, we might not have the profile yet.
      return {
        uid: fbUser.uid,
        email: fbUser.email || "",
        displayName: fbUser.displayName || "User",
        role: "member",
        createdAt: new Date().toISOString()
      };
    } else {
      const loggedUid = sessionStorage.getItem("genesis_logged_uid");
      if (!loggedUid) return null;
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      return users[loggedUid] || null;
    }
  },

  signIn: async (email: string, password: string): Promise<UserProfile> => {
    if (!isMockMode) {
      const credentials = await signInWithEmailAndPassword(firebaseAuth!, email, password);
      const userDoc = await getDoc(doc(firestoreDb as Firestore, "users", credentials.user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return {
        uid: credentials.user.uid,
        email: credentials.user.email || "",
        displayName: credentials.user.displayName || "Member",
        role: "member",
        createdAt: new Date().toISOString()
      };
    } else {
      // Mock Sign In
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      const foundUser = Object.values(users).find(
        (u: unknown) => (u as UserProfile).email.toLowerCase() === email.toLowerCase()
      ) as UserProfile | undefined;

      if (!foundUser) {
        throw new Error("Invalid credentials or user not found. (Use admin@genesis.ai to test!)");
      }
      sessionStorage.setItem("genesis_logged_uid", foundUser.uid);
      window.dispatchEvent(new Event("genesis-auth-changed"));
      return foundUser;
    }
  },

  signUp: async (email: string, password: string, displayName: string, role: "admin" | "operator" | "member" = "member"): Promise<UserProfile> => {
    if (!isMockMode) {
      const credentials = await createUserWithEmailAndPassword(firebaseAuth!, email, password);
      const profile: UserProfile = {
        uid: credentials.user.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestoreDb as Firestore, "users", credentials.user.uid), profile);
      return profile;
    } else {
      // Mock Sign Up
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      const existing = Object.values(users).find((u: unknown) => (u as UserProfile).email === email);
      if (existing) {
        throw new Error("Email address already registered.");
      }
      
      const newUid = "mock-" + Math.random().toString(36).substring(2, 11);
      const profile: UserProfile = {
        uid: newUid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      };
      users[newUid] = profile;
      localStorage.setItem("genesis_users", JSON.stringify(users));
      sessionStorage.setItem("genesis_logged_uid", newUid);
      window.dispatchEvent(new Event("genesis-auth-changed"));
      return profile;
    }
  },

  signInWithGoogle: async (): Promise<UserProfile> => {
    if (!isMockMode) {
      const provider = new GoogleAuthProvider();
      const credentials = await signInWithPopup(firebaseAuth!, provider);
      const userDoc = await getDoc(doc(firestoreDb as Firestore, "users", credentials.user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      const profile: UserProfile = {
        uid: credentials.user.uid,
        email: credentials.user.email || "",
        displayName: credentials.user.displayName || "Google Operator",
        role: "operator",
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestoreDb as Firestore, "users", credentials.user.uid), profile);
      return profile;
    } else {
      // Mock Google Sign In
      const mockGoogleProfile: UserProfile = {
        uid: "mock-google-uid",
        email: "google.operator@genesis.ai",
        displayName: "Google Operator (Mock)",
        role: "operator",
        createdAt: new Date().toISOString()
      };
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      users[mockGoogleProfile.uid] = mockGoogleProfile;
      localStorage.setItem("genesis_users", JSON.stringify(users));
      sessionStorage.setItem("genesis_logged_uid", mockGoogleProfile.uid);
      window.dispatchEvent(new Event("genesis-auth-changed"));
      return mockGoogleProfile;
    }
  },

  signOut: async (): Promise<void> => {
    if (!isMockMode) {
      await signOut(firebaseAuth!);
    } else {
      sessionStorage.removeItem("genesis_logged_uid");
      window.dispatchEvent(new Event("genesis-auth-changed"));
    }
  }
};

// ----------------------------------------------------
// Unified Database Client Services (Firestore / LocalStorage)
// ----------------------------------------------------
export const dbService = {
  getItems: async <T>(collectionName: string): Promise<T[]> => {
    if (!isMockMode) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb as Firestore, collectionName));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      } catch (e) {
        console.error("Firestore getItems error, using mock fallback:", e);
      }
    }
    // Fallback Mock read
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(`genesis_${collectionName}`) || "[]");
    }
    return [];
  },

  addItem: async <T extends DocumentData>(collectionName: string, item: T): Promise<T & { id: string, timestamp: string }> => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 11),
      ...item,
      timestamp: item.timestamp || new Date().toISOString()
    };
    
    if (!isMockMode) {
      try {
        const docRef = await addDoc(collection(firestoreDb as Firestore, collectionName), item);
        return { id: docRef.id, ...item } as T & { id: string, timestamp: string };
      } catch (e) {
        console.error("Firestore addItem error, saving to mock storage:", e);
      }
    }

    if (typeof window !== "undefined") {
      const items = JSON.parse(localStorage.getItem(`genesis_${collectionName}`) || "[]");
      items.unshift(newItem);
      localStorage.setItem(`genesis_${collectionName}`, JSON.stringify(items));
      window.dispatchEvent(new Event(`genesis-db-${collectionName}-updated`));
    }
    return newItem;
  },

  updateItem: async <T>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
    if (!isMockMode) {
      try {
        const docRef = doc(firestoreDb as Firestore, collectionName, id);
        await updateDoc(docRef, data as { [x: string]: unknown });
        return;
      } catch (e) {
        console.error("Firestore updateItem error, editing mock storage:", e);
      }
    }

    if (typeof window !== "undefined") {
      const items = JSON.parse(localStorage.getItem(`genesis_${collectionName}`) || "[]");
      const index = items.findIndex((i: { id: string }) => i.id === id);
      if (index > -1) {
        items[index] = { ...items[index], ...data };
        localStorage.setItem(`genesis_${collectionName}`, JSON.stringify(items));
        window.dispatchEvent(new Event(`genesis-db-${collectionName}-updated`));
      }
    }
  },

  deleteItem: async (collectionName: string, id: string): Promise<void> => {
    if (!isMockMode) {
      try {
        const docRef = doc(firestoreDb as Firestore, collectionName, id);
        await deleteDoc(docRef);
        return;
      } catch (e) {
        console.error("Firestore deleteItem error, deleting from mock:", e);
      }
    }

    if (typeof window !== "undefined") {
      const items = JSON.parse(localStorage.getItem(`genesis_${collectionName}`) || "[]");
      const filtered = items.filter((i: { id: string }) => i.id !== id);
      localStorage.setItem(`genesis_${collectionName}`, JSON.stringify(filtered));
      window.dispatchEvent(new Event(`genesis-db-${collectionName}-updated`));
    }
  },

  // Event listener hook helper to subscribe to collection updates
  subscribeCollection: <T>(collectionName: string, callback: (data: T[]) => void) => {
    if (typeof window === "undefined") return () => {};
    
    const handler = async () => {
      const data = await dbService.getItems<T>(collectionName);
      callback(data);
    };

    window.addEventListener(`genesis-db-${collectionName}-updated`, handler);
    // Trigger initial fetch
    handler();

    return () => {
      window.removeEventListener(`genesis-db-${collectionName}-updated`, handler);
    };
  }
};
