import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore'

// ─── Replace with your real Firebase project config ───────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'YOUR_APP_ID',
}
// ─────────────────────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const loginAnonymously = () => signInAnonymously(auth)

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  return cred
}

export const logout = () => signOut(auth)

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)

// ── Firestore — Community posts ───────────────────────────────────────────────
export const addPost = (data) =>
  addDoc(collection(db, 'posts'), { ...data, createdAt: serverTimestamp(), likes: 0 })

export const subscribeToPosts = (callback) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(posts)
  })
}

export const likePost = (postId) =>
  updateDoc(doc(db, 'posts', postId), { likes: increment(1) })

// ── Firestore — Equipment listings ──────────────────────────────────────────
export const addEquipment = (data) =>
  addDoc(collection(db, 'equipment'), { ...data, createdAt: serverTimestamp(), available: true })

export const getEquipment = async () => {
  const snap = await getDocs(collection(db, 'equipment'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ── Firestore — User farm profile ────────────────────────────────────────────
export const saveFarmProfile = (userId, data) =>
  updateDoc(doc(db, 'users', userId), { ...data, updatedAt: serverTimestamp() })
