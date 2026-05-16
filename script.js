/**
 * =====================================================
 *  UNITUTOR — SISTEMA INTEGRADO DE TUTORÍAS
 *  script.js — Lógica principal de la aplicación
 *  Sin frameworks. Vanilla JS + localStorage.
 * =====================================================
 */

'use strict';

// ══════════════════════════════════════════════════
//  DATOS SIMULADOS (Seed Data)
// ══════════════════════════════════════════════════

/** Usuarios predefinidos del sistema */
const SEED_USERS = [
  {
    id: 'u1',
    name: 'Fabiana Rosales',
    email: 'estudiante@unisabaneta.edu.co',
    password: 'Unitutor2026',
    role: 'student',
    career: 'Ingeniería de Sistemas',
    semester: 6,
    avg: 4.2,
    rating: 4.5
  },
  {
    id: 'u2',
    name: 'Carlos Andrade López',
    email: 'tutor@unisabaneta.edu.co',
    password: 'Tutor2026',
    role: 'tutor',
    career: 'Ingeniería de Sistemas',
    semester: 9,
    avg: 4.7,
    rating: 4.8,
    ratingCount: 3,
    subjects: ['Cálculo Diferencial', 'Álgebra Lineal', 'Programación I'],
    modality: 'Ambas',
    availability: [
      { day: 'Viernes', modality: 'Ambas', start: '08:00', end: '12:00' },
      { day: 'Lunes', modality: 'Ambas', start: '08:00', end: '12:00' },
      { day: 'Martes', modality: 'Ambas', start: '08:00', end: '12:00' },
      { day: 'Miércoles', modality: 'Ambas', start: '08:00', end: '12:00' },
      { day: 'Jueves', modality: 'Ambas', start: '08:00', end: '12:00' }
    ],
    bio: 'Tutor con 3 años de experiencia. Especializado en matemáticas y programación.'
  }
];

/** Tutores disponibles para solicitud */
const SEED_TUTORS = [
  { id: 'u2', name: 'Carlos Andrade López',   subjects: 'Cálculo, Álgebra, Prog. I', rating: '⭐ 4.8' },
  { id: 't3', name: 'Valentina Torres Ruiz',  subjects: 'Bases de Datos, Estadística', rating: '⭐ 4.6' },
  { id: 't4', name: 'Miguel Ángel Reyes',     subjects: 'Física I, Química General',   rating: '⭐ 4.5' },
  { id: 't5', name: 'Daniela Ospina Castro',  subjects: 'Inglés Técnico, Cálculo',      rating: '⭐ 4.9' }
];

/** Tutorías simuladas para el estudiante */
const SEED_STUDENT_TUTORINGS = [
  { id: 'tut0', subject: 'Programación I', date: '2026-05-01', time: '09:00', tutor: 'Carlos Andrade López', tutorId: 'u2', modality: 'Virtual', status: 'completed' },
  { id: 'tut1', subject: 'Cálculo Diferencial', date: '2026-07-14', time: '10:00', tutor: 'Carlos Andrade',   modality: 'Virtual',    status: 'confirmed' },
  { id: 'tut2', subject: 'Álgebra Lineal',      date: '2026-07-16', time: '14:00', tutor: 'Carlos Andrade',   modality: 'Presencial', status: 'pending'   },
  { id: 'tut3', subject: 'Bases de Datos',      date: '2026-07-10', time: '09:00', tutor: 'Valentina Torres', modality: 'Virtual',    status: 'confirmed' }
];

/** Sesiones simuladas para el tutor */
const SEED_TUTOR_SESSIONS = [
  { id: 'ts1', student: 'Laura Martínez',  subject: 'Cálculo Diferencial', date: '2026-07-14', time: '10:00', modality: 'Virtual',    status: 'confirmed' },
  { id: 'ts2', student: 'Andrés Molina',   subject: 'Programación I',      date: '2026-07-15', time: '15:00', modality: 'Presencial', status: 'pending'   },
  { id: 'ts3', student: 'Camila Herrera',  subject: 'Álgebra Lineal',      date: '2026-07-17', time: '11:00', modality: 'Virtual',    status: 'pending'   }
];

/** Solicitudes pendientes para el tutor */
const SEED_REQUESTS = [
  { id: 'req-demo-occupied', student: 'Laura Martínez', studentId: 'demo-student', tutorId: 'u2', tutorName: 'Carlos Andrade López', tutor: 'Carlos Andrade López', subject: 'Cálculo Diferencial', date: '2026-05-08', time: '10:00', modality: 'Virtual', status: 'pending' },
  { id: 'req1', student: 'Andrés Molina',  subject: 'Programación I',  date: '2026-07-15', time: '15:00', modality: 'Presencial', status: 'pending' },
  { id: 'req2', student: 'Camila Herrera', subject: 'Álgebra Lineal',  date: '2026-07-17', time: '11:00', modality: 'Virtual',    status: 'pending' }
];

/** Notificaciones simuladas */
const SEED_NOTIFICATIONS = [
  { id: 'n1', type: 'confirmation', icon: '✅', color: 'notif-green',  title: 'Tutoría confirmada',      message: 'Tu tutoría de Cálculo Diferencial el 14 de julio fue confirmada por Carlos Andrade.',    time: 'Hace 10 min',  read: false },
  { id: 'n2', type: 'change',       icon: '🔄', color: 'notif-yellow', title: 'Cambio de horario',        message: 'La tutoría de Bases de Datos cambió de las 09:00 a las 10:30 el mismo día.',            time: 'Hace 2 horas', read: false },
  { id: 'n3', type: 'cancelled',    icon: '❌', color: 'notif-red',    title: 'Tutoría cancelada',        message: 'La tutoría de Física I programada para el 12 de julio fue cancelada.',                   time: 'Ayer',         read: false },
  { id: 'n4', type: 'reminder',     icon: '⏰', color: 'notif-blue',   title: 'Recordatorio',             message: 'Tienes una tutoría de Álgebra Lineal mañana a las 14:00. ¡No olvides prepararte!',      time: 'Ayer',         read: true  },
  { id: 'n5', type: 'info',         icon: '📢', color: 'notif-blue',   title: 'Nuevo tutor disponible',   message: 'Daniela Ospina se unió como tutora de Inglés Técnico y Cálculo con calificación 4.9.',  time: 'Hace 3 días',  read: true  }
];

/** Recordatorios para el dashboard del estudiante */
const SEED_REMINDERS = [
  { icon: '⚠️', text: '<strong>Mañana a las 10:00 AM</strong> tienes tutoría de Cálculo Diferencial con Carlos Andrade (Virtual).' },
  { icon: '📅', text: '<strong>Esta semana</strong> tienes 2 tutorías programadas. Revisa el calendario.' },
  { icon: '📝', text: 'Recuerda completar el <strong>formulario de evaluación</strong> de la tutoría de Bases de Datos.' }
];

// ══════════════════════════════════════════════════
//  ESTADO DE LA APLICACIÓN
// ══════════════════════════════════════════════════

let currentUser     = null;  // Usuario autenticado
let selectedTutorId = null;  // Tutor seleccionado en formulario
let selectedSlotKey = null;
let calendarDate    = new Date(); // Fecha activa en calendario
let selectedCalDay  = null;  // Día seleccionado en calendario
let pendingConfirm  = null;  // Callback del modal de confirmación
let tutorSlotCount  = 0;     // Contador de slots en sección disponibilidad
let applySlotCount  = 0;     // Contador de slots en postulación
let availabilityUnsubscribe = null;
let reviewsUnsubscribe = null;
let pendingCancelTutoring = null;  // Tutoría pendiente de cancelación {id, type: 'student'|'tutor'}

//  CAPA DE DATOS
//
//  La interfaz debe hablar con esta capa, no directamente con localStorage.
//  Cuando conectes Firebase, este es el punto que se reemplaza por llamadas a
//  Authentication y Firestore sin desordenar las pantallas.

const STORAGE_KEYS = {
  users: 'ut_users',
  session: 'ut_session',
  studentTutorings: 'ut_tutorings_student',
  tutorSessions: 'ut_sessions_tutor',
  requests: 'ut_requests',
  notifications: 'ut_notifications',
  reviews: 'ut_reviews',
  habeasConsents: 'ut_habeas_consents'
};

const DataStore = {
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  getArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  },

  setArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
    } catch {
      return null;
    }
  },

  setSession(user) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
};

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAcrN-JwWcYAj1nejJANJwoxeFkX7tlFc4',
  authDomain: 'unitutor-3fccf.firebaseapp.com',
  projectId: 'unitutor-3fccf',
  storageBucket: 'unitutor-3fccf.firebasestorage.app',
  messagingSenderId: '80135887039',
  appId: '1:80135887039:web:22b4d23b85f3fccea40e0a'
};

const VALID_EMAIL_DOMAIN = 'unisabaneta.edu.co';

function removeUndefinedFields(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  );
}

function buildFirestoreUserProfile(user) {
  const normalized = normalizeUser(user);
  return removeUndefinedFields({
    name: normalized.name,
    email: normalized.email,
    role: normalized.role,
    career: normalized.career,
    semester: normalized.semester,
    avg: normalized.avg,
    rating: normalized.rating,
    ratingCount: normalized.ratingCount,
    ratingTotal: normalized.ratingTotal,
    subjects: normalized.subjects,
    modality: normalized.modality,
    availability: normalized.availability,
    bio: normalized.bio,
    habeasDataAccepted: normalized.habeasDataAccepted,
    habeasDataAcceptedAt: normalized.habeasDataAcceptedAt,
    habeasDataVersion: normalized.habeasDataVersion
  });
}

function upsertLocalUser(user) {
  const normalized = normalizeUser(user);
  if (!normalized?.id) return null;
  const users = getLS(STORAGE_KEYS.users);
  const idx = users.findIndex(item => item.id === normalized.id || item.email === normalized.email);
  if (idx >= 0) users[idx] = { ...users[idx], ...normalized, id: normalized.id };
  else users.push(normalized);
  setLS(STORAGE_KEYS.users, users);
  return normalized;
}

function findUserByCredentials(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const users = getLS(STORAGE_KEYS.users);
  const user = users.find(item => (
    String(item.email || '').trim().toLowerCase() === cleanEmail &&
    item.password === password
  ));
  if (user) return normalizeUser(user);

  const seedUser = SEED_USERS.find(item => (
    String(item.email || '').trim().toLowerCase() === cleanEmail &&
    item.password === password
  ));
  return seedUser ? upsertLocalUser(seedUser) : null;
}

const FirebaseService = {
  ready: false,
  app: null,
  auth: null,
  db: null,
  api: null,

  async init() {
    if (this.ready) return true;

    try {
      const sdkImports = Promise.all([
        import('https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js')
      ]);
      const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo agotado conectando Firebase')), 3000);
      });
      const [appModule, authModule, firestoreModule] = await Promise.race([sdkImports, timeout]);

      this.app = appModule.initializeApp(FIREBASE_CONFIG);
      this.auth = authModule.getAuth(this.app);
      this.db = firestoreModule.getFirestore(this.app);
      this.api = { ...authModule, ...firestoreModule };
      this.ready = true;
      return true;
    } catch (error) {
      console.error('No se pudo inicializar Firebase:', error);
      showToast('No se pudo conectar Firebase. Revisa internet o ejecuta la app en localhost.', 'error', 6000);
      return false;
    }
  },

  async signIn(email, password) {
    await this.init();
    const credential = await this.api.signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  },

  async signOut() {
    if (!this.ready) return;
    await this.api.signOut(this.auth);
  },

  async getUserProfile(uid) {
    const ref = this.api.doc(this.db, 'users', uid);
    const snap = await this.api.getDoc(ref);
    return snap.exists() ? { id: uid, ...snap.data() } : null;
  },

  async saveUserProfile(user) {
    if (!user?.id) throw new Error('No se puede guardar un perfil sin id de usuario.');
    const now = new Date().toISOString();
    const ref = this.api.doc(this.db, 'users', user.id);
    const snap = await this.api.getDoc(ref);
    const profile = buildFirestoreUserProfile(user);
    await this.api.setDoc(ref, {
      ...profile,
      createdAt: snap.exists() ? (snap.data().createdAt || now) : now,
      updatedAt: now
    }, { merge: true });
  },

  async saveHabeasConsent(user, source = 'login') {
    const now = new Date().toISOString();
    const consent = {
      userId: user.id,
      email: user.email,
      accepted: true,
      version: '2026-05',
      source,
      acceptedAt: now
    };
    await this.api.setDoc(this.api.doc(this.db, 'habeasDataConsents', user.id), consent, { merge: true });
    await this.api.setDoc(this.api.doc(this.db, 'users', user.id), {
      habeasDataAccepted: true,
      habeasDataAcceptedAt: now,
      habeasDataVersion: consent.version,
      updatedAt: now
    }, { merge: true });
    return consent;
  },

  async loadAppData(user) {
    const results = await Promise.allSettled([
      this.loadUsers(),
      this.loadStudentTutorings(user),
      this.loadTutorSessions(user),
      this.loadTutorRequests(user),
      this.loadNotifications(user),
      this.loadReviews()
    ]);
    results
      .filter(result => result.status === 'rejected')
      .forEach(result => console.warn('No se pudo cargar una parte de Firestore:', result.reason));
  },

  async loadUsers() {
    const snap = await this.api.getDocs(this.api.collection(this.db, 'users'));
    const users = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    if (users.length) setLS(STORAGE_KEYS.users, users);
  },

  async loadStudentTutorings(user) {
    const q = this.api.query(
      this.api.collection(this.db, 'tutoringRequests'),
      this.api.where('studentId', '==', user.id)
    );
    const snap = await this.api.getDocs(q);
    if (snap.empty) return;
    const tutorings = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        subject: data.subject,
        date: data.date,
        time: data.time,
        tutor: data.tutorName,
        tutorId: data.tutorId,
        modality: data.modality,
        status: data.status,
        reviewed: data.reviewed || false,
        notes: data.notes || '',
        rejectionReason: data.rejectionReason || '',
        responseReason: data.responseReason || ''
      };
    });
    setLS(STORAGE_KEYS.studentTutorings, tutorings);
  },

  async loadTutorSessions(user) {
    const q = this.api.query(
      this.api.collection(this.db, 'tutoringSessions'),
      this.api.where('tutorId', '==', user.id)
    );
    const snap = await this.api.getDocs(q);
    if (snap.empty) return;
    const sessions = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    setLS(STORAGE_KEYS.tutorSessions, sessions);
  },

  async loadTutorRequests(user) {
    const q = this.api.query(
      this.api.collection(this.db, 'tutoringRequests'),
      this.api.where('tutorId', '==', user.id)
    );
    const snap = await this.api.getDocs(q);
    if (snap.empty) return;
    const requests = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        student: data.studentName,
        studentId: data.studentId,
        subject: data.subject,
        date: data.date,
        time: data.time,
        modality: data.modality,
        status: data.status,
        tutorId: data.tutorId,
        tutorEmail: data.tutorEmail,
        tutorName: data.tutorName,
        notes: data.notes || '',
        rejectionReason: data.rejectionReason || '',
        responseReason: data.responseReason || ''
      };
    });
    setLS(STORAGE_KEYS.requests, requests);
  },

  async loadNotifications(user) {
    const q = this.api.query(
      this.api.collection(this.db, 'notifications'),
      this.api.where('userId', '==', user.id)
    );
    const snap = await this.api.getDocs(q);
    if (snap.empty) return;
    const notifications = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    notifications.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    setLS(STORAGE_KEYS.notifications, notifications);
  },

  async loadReviews() {
    const snap = await this.api.getDocs(this.api.collection(this.db, 'reviews'));
    const reviews = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    reviews.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    setLS(STORAGE_KEYS.reviews, reviews);
  },

  listenToAvailability({ tutorId, date, modality }, onChange) {
    if (!this.ready || !tutorId || !date) return () => {};

    let tutorProfile = null;
    let reserved = [];
    const emit = () => onChange(buildAvailabilityState(tutorProfile, reserved, date, modality));
    const tutorRef = this.api.doc(this.db, 'users', tutorId);
    const requestQuery = this.api.query(
      this.api.collection(this.db, 'tutoringRequests'),
      this.api.where('tutorId', '==', tutorId),
      this.api.where('date', '==', date)
    );

    const unsubProfile = this.api.onSnapshot(tutorRef, snap => {
      const seedTutor = SEED_USERS.find(user => user.id === tutorId) || null;
      tutorProfile = snap.exists() ? { ...(seedTutor || {}), id: snap.id, ...snap.data() } : seedTutor;
      emit();
    });
    const unsubRequests = this.api.onSnapshot(requestQuery, snap => {
      const localReserved = getLS(STORAGE_KEYS.requests).filter(req => (
        req.tutorId === tutorId &&
        req.date === date &&
        ['pending', 'confirmed', 'completed'].includes(req.status)
      ));
      reserved = snap.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .filter(item => ['pending', 'confirmed', 'completed'].includes(item.status))
        .concat(localReserved);
      emit();
    });

    return () => {
      unsubProfile();
      unsubRequests();
    };
  },

  async createTutoringRequest(request) {
    const now = new Date().toISOString();
    const slotId = makeSlotId(request.tutorId, request.date, request.time);

    return this.api.runTransaction(this.db, async transaction => {
      const slotRef = this.api.doc(this.db, 'availabilitySlots', slotId);
      const slotSnap = await transaction.get(slotRef);

      if (slotSnap.exists() && slotSnap.data().status === 'reserved') {
        throw new Error('Este horario ya fue reservado por otro estudiante.');
      }

      const requestRef = this.api.doc(this.api.collection(this.db, 'tutoringRequests'));
      transaction.set(requestRef, {
        ...request,
        slotId,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      });
      transaction.set(slotRef, {
        tutorId: request.tutorId,
        studentId: request.studentId,
        requestId: requestRef.id,
        date: request.date,
        time: request.time,
        modality: request.modality,
        status: 'reserved',
        updatedAt: now
      });
      return requestRef.id;
    });
  },

  async updateTutoringRequest(id, data) {
    const ref = this.api.doc(this.db, 'tutoringRequests', id);
    const updatedAt = new Date().toISOString();
    await this.api.updateDoc(ref, { ...data, updatedAt });
    if (data.status === 'cancelled') {
      const snap = await this.api.getDoc(ref);
      const request = snap.exists() ? snap.data() : null;
      if (request?.slotId) {
        await this.api.setDoc(this.api.doc(this.db, 'availabilitySlots', request.slotId), {
          status: 'cancelled',
          updatedAt
        }, { merge: true });
      }
    }
  },

  async createTutorSession(session) {
    const now = new Date().toISOString();
    const ref = await this.api.addDoc(this.api.collection(this.db, 'tutoringSessions'), {
      ...session,
      createdAt: now,
      updatedAt: now
    });
    return ref.id;
  },

  async createNotification(notification) {
    const ref = await this.api.addDoc(this.api.collection(this.db, 'notifications'), {
      ...notification,
      createdAt: new Date().toISOString()
    });
    return ref.id;
  },

  async markNotificationRead(id) {
    await this.api.updateDoc(this.api.doc(this.db, 'notifications', id), { read: true });
  },

  async markAllNotificationsRead(userId) {
    const q = this.api.query(
      this.api.collection(this.db, 'notifications'),
      this.api.where('userId', '==', userId)
    );
    const snap = await this.api.getDocs(q);
    await Promise.all(snap.docs.map(docSnap => (
      this.api.updateDoc(this.api.doc(this.db, 'notifications', docSnap.id), { read: true })
    )));
  },

  async createReview(review) {
    const now = new Date().toISOString();
    const reviewId = `${review.tutoringId}_${review.studentId}`;
    const reviewRef = this.api.doc(this.db, 'reviews', reviewId);
    const tutorRef = this.api.doc(this.db, 'users', review.tutorId);

    await this.api.runTransaction(this.db, async transaction => {
      const existing = await transaction.get(reviewRef);
      if (existing.exists()) throw new Error('Ya calificaste esta tutoría.');

      const tutorSnap = await transaction.get(tutorRef);
      const tutor = tutorSnap.exists() ? tutorSnap.data() : {};
      const ratingTotal = Number(tutor.ratingTotal || 0) + review.rating;
      const ratingCount = Number(tutor.ratingCount || 0) + 1;

      transaction.set(reviewRef, { ...review, createdAt: now });
      transaction.set(tutorRef, {
        ratingTotal,
        ratingCount,
        rating: Number((ratingTotal / ratingCount).toFixed(1)),
        updatedAt: now
      }, { merge: true });
    });
    return reviewId;
  },

  listenToTutorReviews(tutorId, onChange) {
    if (!this.ready || !tutorId) return () => {};
    const q = this.api.query(
      this.api.collection(this.db, 'reviews'),
      this.api.where('tutorId', '==', tutorId)
    );
    return this.api.onSnapshot(q, snap => {
      const reviews = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      reviews.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      onChange(reviews);
    });
  },

  async loadReportData() {
    const [usersSnap, requestsSnap, sessionsSnap] = await Promise.all([
      this.api.getDocs(this.api.collection(this.db, 'users')),
      this.api.getDocs(this.api.collection(this.db, 'tutoringRequests')),
      this.api.getDocs(this.api.collection(this.db, 'tutoringSessions'))
    ]);

    return {
      users: usersSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })),
      requests: requestsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })),
      sessions: sessionsSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
    };
  }
};

// ══════════════════════════════════════════════════
//  INICIALIZACIÓN
// ══════════════════════════════════════════════════

/**
 * Ejecuta al cargar el DOM.
 * Siembra datos de prueba y verifica sesión activa.
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    seedLocalStorage();
    setMinDate();
    buildSubjectCheckboxes();
    buildApplySlot();
    buildTutorSlot();
    buildTutorCards();
    buildCalendar();
    buildTutorRequestsList();
    setupNavListeners();
    setupAvailabilityFilters();
    setupRealtimeValidation();
    buildReportFilters();
    await checkSession();

FirebaseService.init()
      .then(async connected => {
        const wrapper = document.getElementById('app-wrapper');
        if (connected && isValidUser(currentUser) && wrapper.style.display === 'none') {
          await FirebaseService.loadAppData(currentUser);
          enterApp();
        }
      })
      .catch(error => console.warn('Firebase no bloqueo el inicio de la app:', error));
  } catch (error) {
    console.error('Error iniciando UniTutor:', error);
    DataStore.clearSession();
    document.getElementById('app-wrapper').style.display = 'none';
    goScreen('screen-login');
    showToast('Se limpió una sesión dañada. Intenta iniciar sesión de nuevo.', 'warning', 6000);
  }
});

/**
 * Inserta datos simulados en localStorage si no existen.
 */
function seedLocalStorage() {
  const shouldResetDemoData = localStorage.getItem('ut_demo_version') !== 'firebase-safe-v9';
  const savedUsers = getLS(STORAGE_KEYS.users);
  const mergedUsers = [...savedUsers];
  SEED_USERS.forEach(seedUser => {
    const seedEmail = String(seedUser.email || '').trim().toLowerCase();
    const idx = mergedUsers.findIndex(user => (
      user.id === seedUser.id ||
      String(user.email || '').trim().toLowerCase() === seedEmail
    ));
    if (idx === -1) {
      mergedUsers.push(seedUser);
    } else {
      mergedUsers[idx] = {
        ...seedUser,
        ...mergedUsers[idx],
        email: seedEmail,
        password: mergedUsers[idx].password || seedUser.password
      };
    }
  });
  DataStore.setArray(STORAGE_KEYS.users, mergedUsers);
  if (shouldResetDemoData || !DataStore.has(STORAGE_KEYS.studentTutorings)) {
    DataStore.setArray(STORAGE_KEYS.studentTutorings, SEED_STUDENT_TUTORINGS);
  }
  if (shouldResetDemoData || !DataStore.has(STORAGE_KEYS.tutorSessions)) {
    DataStore.setArray(STORAGE_KEYS.tutorSessions, SEED_TUTOR_SESSIONS);
  }
  if (shouldResetDemoData || !DataStore.has(STORAGE_KEYS.requests)) {
    DataStore.setArray(STORAGE_KEYS.requests, SEED_REQUESTS);
  }
  if (shouldResetDemoData || !DataStore.has(STORAGE_KEYS.notifications)) {
    DataStore.setArray(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS);
  }
  if (shouldResetDemoData || !DataStore.has(STORAGE_KEYS.reviews)) {
    DataStore.setArray(STORAGE_KEYS.reviews, []);
  }
  localStorage.setItem('ut_demo_version', 'firebase-safe-v9');
}

/** Comprueba si hay sesión guardada (recarga de página) */
async function checkSession() {
  const saved = DataStore.getSession();
  if (saved) {
    currentUser = normalizeUser(saved);
    if (!isValidUser(currentUser)) {
      currentUser = null;
      DataStore.clearSession();
      goScreen('screen-login');
      return;
    }
    if (FirebaseService.ready) {
      try {
        await FirebaseService.loadAppData(currentUser);
      } catch (error) {
        console.warn('No se pudieron sincronizar datos de Firebase:', error);
      }
    }
    enterApp();
  }
}

//  NAVEGACIÓN ENTRE PANTALLAS (auth vs app)

/**
 * Cambia la pantalla de autenticación visible.
 * @param {string} screenId - ID del elemento <section>
 */
function goScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

//  LOGIN

/**
 * Maneja el intento de inicio de sesión.
 * Valida credenciales contra localStorage.
 */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass  = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');

  errorEl.style.display = 'none';

  const loginValid = validateFields(['login-email', 'login-pass', 'login-habeas']);
  if (!loginValid.ok) {
    showError(errorEl, loginValid.message || 'Revisa los campos marcados antes de continuar.');
    return;
  }

  let user = null;
  // Buscar primero en datos locales/semilla para que las cuentas demo sigan
  // entrando aunque Firebase Auth tenga una contraseña distinta.
  user = findUserByCredentials(email, pass);

  // Si se encuentra en localStorage, iniciar sesión inmediatamente
  if (user) {
    currentUser = user;
    DataStore.setSession(user);
    await persistHabeasConsent(user, 'login-local');
    enterApp();

    // Sincronización con Firebase en segundo plano (no bloqueante)
    FirebaseService.init()
      .then(async connected => {
        if (!connected) return;
        try {
          const firebaseUser = await FirebaseService.signIn(email, pass);
          const profile = await FirebaseService.getUserProfile(firebaseUser.uid);
          if (profile) {
            currentUser = normalizeUser({ ...user, ...profile, id: firebaseUser.uid });
            upsertLocalUser(currentUser);
            DataStore.setSession(currentUser);
            await persistHabeasConsent(currentUser, 'login-firebase');
            await FirebaseService.loadAppData(currentUser);
            enterApp();
          } else {
            currentUser = normalizeUser({ ...user, id: firebaseUser.uid, email: firebaseUser.email || email });
            upsertLocalUser(currentUser);
            DataStore.setSession(currentUser);
            await FirebaseService.saveUserProfile(currentUser);
            await persistHabeasConsent(currentUser, 'login-firebase-profile-created');
            await FirebaseService.loadAppData(currentUser);
            enterApp();
          }
        } catch (error) {
          console.warn('Login local OK; Firebase no sincronizó:', error);
        }
      });
    return;
  }

  // Si no está en localStorage, intentar con Firebase
  const firebaseReady = FirebaseService.ready || await FirebaseService.init();
  if (firebaseReady) {
    try {
      const firebaseUser = await FirebaseService.signIn(email, pass);
      const profile = await FirebaseService.getUserProfile(firebaseUser.uid);

      if (profile) {
        user = normalizeUser(profile);
      } else {
        // Si el perfil no existe en Firestore, crearlo en localStorage
        user = normalizeUser({
          id: firebaseUser.uid,
          name: firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          role: 'student',
          career: 'Sin registrar',
          semester: 1,
          avg: 0,
          rating: 0
        });
        // Guardar en localStorage para próximos inicios
        upsertLocalUser(user);
        await FirebaseService.saveUserProfile(user);
      }
    } catch (error) {
      console.error('Error en login con Firebase:', error);
      // Aún con error de Firebase, no mostrar error si ya tenemos usuario
    }
  }

  if (!user) {
    showError(errorEl, 'Correo o contraseña incorrectos. Intente de nuevo.');
    shakeElement(document.getElementById('login-btn'));
    return;
  }

  // Guardar sesión
  currentUser = user;
  upsertLocalUser(currentUser);
  DataStore.setSession(user);
  await persistHabeasConsent(user, 'login');
  enterApp();
}

/** Muestra un mensaje de error en el elemento dado */
function showError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

//  VALIDACIÓN REUTILIZABLE DE FORMULARIOS

const VALIDATION_RULES = {
  required(value, field) {
    return sanitizeInput(value) ? '' : `${field} es obligatorio.`;
  },
  requiredCheckbox(value, field, element) {
    return element.checked ? '' : `Debes aceptar ${field.toLowerCase()}.`;
  },
  institutionalEmail(value, field) {
    const clean = sanitizeInput(value).toLowerCase();
    if (!clean) return `${field} es obligatorio.`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return 'Ingresa un correo electrónico válido.';
    if (!clean.endsWith(`@${VALID_EMAIL_DOMAIN}`)) return `Debes usar un correo @${VALID_EMAIL_DOMAIN}.`;
    return '';
  },
  password(value, field) {
    if (!value) return `${field} es obligatoria.`;
    if (value.length < 8 || value.length > 32) return 'La contraseña debe tener entre 8 y 32 caracteres.';
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
      return 'La contraseña debe incluir mayúscula, minúscula y número.';
    }
    return '';
  },
  futureDate(value, field) {
    if (!value) return `${field} es obligatoria.`;
    const selected = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? '' : 'La fecha debe ser posterior a hoy.';
  },
  optionalText(value) {
    const clean = sanitizeInput(value);
    if (!clean) return '';
    if (clean.length > 360) return 'El texto supera la longitud permitida.';
    if (/[<>]/.test(clean)) return 'No uses caracteres HTML como < o >.';
    return '';
  },
  plainText(value, field) {
    const clean = sanitizeInput(value);
    if (!clean) return `${field} es obligatorio.`;
    if (clean.length < 3 || clean.length > 80) return `${field} debe tener entre 3 y 80 caracteres.`;
    if (/[<>$%{}[\]|\\]/.test(clean)) return `${field} contiene caracteres no permitidos.`;
    return '';
  },
  personName(value, field) {
    const clean = sanitizeInput(value);
    if (!clean) return `${field} es obligatorio.`;
    if (clean.length < 3 || clean.length > 80) return 'El nombre debe tener entre 3 y 80 caracteres.';
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/.test(clean)) return 'El nombre solo debe contener letras y separadores válidos.';
    return '';
  },
  semester(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 1 && number <= 12 ? '' : 'El semestre debe estar entre 1 y 12.';
  },
  average(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= 5 ? '' : 'El promedio debe estar entre 0.0 y 5.0.';
  }
};

function sanitizeInput(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function setupRealtimeValidation() {
  document.querySelectorAll('[data-validate]').forEach(field => {
    const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => validateField(field, false));
    field.addEventListener('blur', () => validateField(field, true));
  });
}

function validateFields(ids) {
  const errors = ids
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .map(field => validateField(field, true))
    .filter(Boolean);
  return { ok: errors.length === 0, message: errors[0] || '' };
}

function validateField(field, showMessage = true) {
  const ruleName = field.dataset.validate;
  const rule = VALIDATION_RULES[ruleName];
  if (!rule) return '';
  const label = field.dataset.label || field.name || field.id || 'Este campo';
  const error = rule(field.value, label, field);
  setFieldState(field, error, showMessage);
  return error;
}

function setFieldState(field, error, showMessage) {
  const group = field.closest('.form-group') || field.closest('.privacy-check') || field.parentElement;
  if (!group) return;

  group.classList.toggle('has-error', Boolean(error));
  group.classList.toggle('has-success', !error && Boolean(field.value || field.checked));

  let message = group.querySelector('.field-feedback');
  if (!message) {
    message = document.createElement('small');
    message.className = 'field-feedback';
    group.appendChild(message);
  }
  message.textContent = showMessage ? error : '';
}

async function persistHabeasConsent(user, source) {
  if (!user?.id || !document.getElementById('login-habeas')?.checked) return;
  const now = new Date().toISOString();
  const localConsents = getLS(STORAGE_KEYS.habeasConsents);
  const consent = {
    id: user.id,
    userId: user.id,
    email: user.email,
    accepted: true,
    version: '2026-05',
    source,
    acceptedAt: now
  };
  const existing = localConsents.findIndex(item => item.userId === user.id);
  if (existing >= 0) localConsents[existing] = consent;
  else localConsents.push(consent);
  setLS(STORAGE_KEYS.habeasConsents, localConsents);

  currentUser = { ...normalizeUser(user), habeasDataAccepted: true, habeasDataAcceptedAt: now };
  DataStore.setSession(currentUser);

  if (!FirebaseService.ready) return;
  try {
    await FirebaseService.saveHabeasConsent(currentUser, source);
  } catch (error) {
    console.warn('Consentimiento guardado localmente; Firebase no respondió:', error);
  }
}

function openHabeasModal() {
  document.getElementById('habeas-modal').style.display = 'flex';
}

function closeHabeasModal() {
  document.getElementById('habeas-modal').style.display = 'none';
}

function acceptHabeasFromModal() {
  const checkbox = document.getElementById('login-habeas');
  if (checkbox) {
    checkbox.checked = true;
    validateField(checkbox, true);
  }
  closeHabeasModal();
  showToast('Autorización de tratamiento de datos aceptada.', 'success');
}

/** Añade animación de "shake" a un elemento */
function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shakeX .4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

//  RECUPERACIÓN DE CONTRASEÑA

function handleRecovery() {
  const email = document.getElementById('recovery-email').value.trim();
  const success = document.getElementById('recovery-success');

  const recoveryValid = validateFields(['recovery-email']);
  if (!recoveryValid.ok) {
    showToast(recoveryValid.message, 'error');
    return;
  }
  success.style.display = 'block';
  showToast('📧 Enlace de recuperación enviado.', 'success');

  setTimeout(() => {
    success.style.display = 'none';
    document.getElementById('recovery-email').value = '';
    goScreen('screen-login');
  }, 3500);
}

//  ENTRAR A LA APP

/**
 * Muestra el panel principal según el rol del usuario.
 */
function enterApp() {
  currentUser = normalizeUser(currentUser);
  if (!isValidUser(currentUser)) {
    currentUser = null;
    DataStore.clearSession();
    document.getElementById('app-wrapper').style.display = 'none';
    goScreen('screen-login');
    showToast('La sesión no era válida. Inicia sesión otra vez.', 'warning', 6000);
    return;
  }

  // Ocultar pantallas de auth
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Mostrar el wrapper
  document.getElementById('app-wrapper').style.display = 'flex';

  // Configurar sidebar según rol
  const isStudent = currentUser.role === 'student';
  document.getElementById('nav-student').style.display = isStudent ? 'flex' : 'none';
  document.getElementById('nav-tutor').style.display   = isStudent ? 'none' : 'flex';

// Actualizar UI con datos del usuario
  updateUserUI();
  buildTutorCards();

  // Navegar al dashboard correspondiente (setTimeout para asegurar DOM actualizado)
  const home = isStudent ? 'dashboard-student' : 'dashboard-tutor';
  setTimeout(() => navigate(home), 0);

  // Notificaciones
  refreshNotifBadge();
}

/** Actualiza todos los elementos de UI que muestran datos del usuario */
function updateUserUI() {
  const initial = (currentUser.name || 'U').charAt(0).toUpperCase();
  const rolLabel = currentUser.role === 'student' ? 'Estudiante' : 'Tutor';
  const badgeClass = currentUser.role === 'student' ? 'badge badge-student' : 'badge badge-tutor';

  // Sidebar
  document.getElementById('sidebar-avatar').textContent = initial;
  document.getElementById('sidebar-name').textContent   = currentUser.name.split(' ')[0] + ' ' + (currentUser.name.split(' ')[1] || '');
  const roleEl = document.getElementById('sidebar-role');
  roleEl.textContent  = rolLabel;
  roleEl.className    = badgeClass;

  // Topbar
  document.getElementById('topbar-avatar').textContent = initial;

  // Bienvenida
  const firstName = currentUser.name.split(' ')[0];
  const nameEl1 = document.getElementById('student-welcome-name');
  const nameEl2 = document.getElementById('tutor-welcome-name');
  if (nameEl1) nameEl1.textContent = `Hola, ${firstName} 👋`;
  if (nameEl2) nameEl2.textContent = `Hola, ${firstName} 👋`;

  // Perfil
  populateProfile();
}

//  NAVEGACIÓN INTERNA (entre secciones)

/**
 * Navega a una sección del panel.
 * @param {string} sectionKey - Clave de la sección (e.g. 'dashboard-student')
 */
function navigate(sectionKey) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Mostrar sección objetivo
  const target = document.getElementById(`section-${sectionKey}`);
  if (target) target.classList.add('active');

  // Actualizar nav activo
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionKey);
  });

  // Actualizar título del topbar
const titles = {
    'dashboard-student':  'Dashboard',
    'dashboard-tutor':    'Dashboard',
    'request-tutoring':   'Solicitar tutoría',
    'apply-tutor':        'Postularse como tutor',
    'cancel-tutoring':    'Cancelar tutoría',
    'notifications':      'Notificaciones',
    'reports':            'Reportes',
    'profile':            'Mi perfil',
    'tutor-calendar':     'Calendario',
    'tutor-availability': 'Disponibilidad',
    'tutor-requests':     'Solicitudes',
    'tutor-cancel':        'Cancelar tutoría'
  };
  document.getElementById('topbar-title').textContent = titles[sectionKey] || 'UniTutor';

  // Acciones al entrar a secciones específicas
  if (sectionKey === 'dashboard-student')  renderStudentDashboard();
  if (sectionKey === 'dashboard-tutor')    renderTutorDashboard();
  if (sectionKey === 'notifications')      renderNotifications();
  if (sectionKey === 'reports')            renderReports();
if (sectionKey === 'cancel-tutoring')    renderCancelList();
  if (sectionKey === 'tutor-requests')     renderTutorRequests();
  if (sectionKey === 'tutor-cancel')       renderTutorCancelList();
  if (sectionKey === 'tutor-calendar')     buildCalendar();

  // Cerrar sidebar en móvil
  closeSidebar();

  // Scroll al top
  document.getElementById('main-content').scrollTo(0, 0);
}

/** Configura los listeners de los ítems del sidebar */
function setupNavListeners() {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigate(item.dataset.section);
    });
  });
}

//  SIDEBAR MÓVIL

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

//  CERRAR SESIÓN

function handleLogout() {
  showConfirm(
    'Cerrar sesión',
    '¿Estás seguro de que deseas cerrar tu sesión?',
    async () => {
      await FirebaseService.signOut();
      if (availabilityUnsubscribe) availabilityUnsubscribe();
      if (reviewsUnsubscribe) reviewsUnsubscribe();
      availabilityUnsubscribe = null;
      reviewsUnsubscribe = null;
      currentUser = null;
      DataStore.clearSession();
      document.getElementById('app-wrapper').style.display = 'none';
      document.getElementById('login-email').value = '';
      document.getElementById('login-pass').value  = '';
      goScreen('screen-login');
      showToast('Sesión cerrada correctamente.', 'info');
    }
  );
}

//  DASHBOARD ESTUDIANTE

function renderStudentDashboard() {
  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  const tbody     = document.getElementById('upcoming-tbody-student');

  if (!tbody) return;

  // Filtrar futuras o confirmadas/pendientes
  const active = tutorings.filter(t => t.status !== 'cancelled');

  // Actualizar contadores
  const statActive  = active.filter(t => t.status === 'confirmed').length;
  const statPending = active.filter(t => t.status === 'pending').length;
  safeSet('stat-active',  statActive);
  safeSet('stat-pending', statPending);
  safeSet('stat-done',    tutorings.filter(t => t.status === 'confirmed').length + 8);

  // Construir tabla
  tbody.innerHTML = '';
  if (active.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No tienes tutorías próximas.</td></tr>';
    return;
  }

  active.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${t.subject}</strong></td>
      <td>${formatDate(t.date)}</td>
      <td>${t.time}</td>
      <td>${t.tutor}</td>
      <td><span class="badge" style="background:#f0f9ff;color:#0369a1;">${t.modality}</span></td>
      <td>
        ${badgeStatus(t.status)}${t.responseMessage ? `<div class="status-note">${t.responseMessage}</div>` : ''}
        ${isTutoringReviewable(t) ? `<div class="mt-8"><button class="btn btn-outline btn-sm" onclick="openReviewModal('${t.id}')">Calificar tutor</button></div>` : ''}
      </td>
    `;
    tbody.appendChild(row);
  });

  // Recordatorios
  renderStudentReviewPrompts(tutorings);
  buildReminders();
}

function renderStudentReviewPrompts(tutorings) {
  const card = document.getElementById('student-review-card');
  const list = document.getElementById('student-review-list');
  if (!card || !list) return;

  const reviewable = tutorings.filter(isTutoringReviewable);
  if (!reviewable.length) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';
  list.innerHTML = reviewable.map(t => `
    <div class="review-prompt-item">
      <div>
        <h4>${t.subject}</h4>
        <p>${t.tutor || 'Tutor'} · ${formatDate(t.date)} · ${t.time} · ${t.modality}</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openReviewModal('${t.id}')">Escribir reseña</button>
    </div>
  `).join('');
}

function buildReminders() {
  const el = document.getElementById('reminders-list');
  if (!el) return;
  el.innerHTML = SEED_REMINDERS.map(r => `
    <div class="reminder-item">
      <span class="reminder-icon">${r.icon}</span>
      <p class="reminder-text">${r.text}</p>
    </div>
  `).join('');
}

//  DASHBOARD TUTOR

function renderTutorDashboard() {
  const sessions = getLS(STORAGE_KEYS.tutorSessions);
  const tbody    = document.getElementById('tutor-sessions-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const visibleSessions = sessions.filter(s => s && s.subject && s.date && s.time);

  if (visibleSessions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No tienes sesiones programadas.</td></tr>';
  }

  visibleSessions.forEach(s => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${s.student || s.studentName || 'Estudiante'}</strong></td>
      <td>${s.subject}</td>
      <td>${formatDate(s.date)}</td>
      <td>${s.time}</td>
      <td><span class="badge" style="background:#f0f9ff;color:#0369a1;">${s.modality}</span></td>
      <td>${badgeStatus(s.status)}</td>
    `;
    tbody.appendChild(row);
  });

  // Actualizar contador solicitudes
  const requests = getLS(STORAGE_KEYS.requests)
    .filter(r => r.status === 'pending')
    .filter(r => !currentUser?.id || !r.tutorId || r.tutorId === currentUser.id || r.tutorEmail === currentUser.email);
  safeSet('stat-new-req', requests.length);
  safeSet('req-count', requests.length);
}

//  SOLICITAR TUTORÍA

/** Construye las tarjetas de tutores disponibles */
function buildTutorCards() {
  const container = document.getElementById('tutors-available-list');
  if (!container) return;

  const users = getLS(STORAGE_KEYS.users);
  const reviews = getLS(STORAGE_KEYS.reviews);
  const firebaseTutors = users
    .filter(u => u.role === 'tutor')
    .map(u => ({
      id: u.id,
      name: u.name,
      subjects: Array.isArray(u.subjects) ? u.subjects.join(', ') : 'Materias por definir',
      rating: u.rating ? `★ ${u.rating} (${u.ratingCount || 0})` : '★ Nuevo',
      recentReview: reviews.find(review => review.tutorId === u.id)?.comment
    }));
  const tutors = firebaseTutors.length ? firebaseTutors : SEED_TUTORS.map(tutor => ({ ...tutor, recentReview: '' }));

  container.innerHTML = tutors.map(t => `
    <div class="tutor-card" id="tc-${t.id}" onclick="selectTutor('${t.id}')">
      <div class="tutor-av">${t.name.charAt(0)}</div>
      <div class="tutor-info">
        <p class="tutor-name">${t.name}</p>
        <p class="tutor-subjects">${t.subjects}</p>
        <p class="tutor-rating">${t.rating}</p>
        ${t.recentReview ? `<p class="tutor-review">"${t.recentReview}"</p>` : ''}
      </div>
      <span class="tutor-check">✓</span>
    </div>
  `).join('');

  if (!selectedTutorId && tutors.length) {
    selectTutor(tutors[0].id);
  }
}

/** Marca el tutor seleccionado */
function selectTutor(id) {
  selectedTutorId = id;
  document.querySelectorAll('.tutor-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`tc-${id}`);
  if (card) card.classList.add('selected');
  refreshAvailabilitySlots();
}

function setupAvailabilityFilters() {
  const dateInput = document.getElementById('req-date');
  if (dateInput) dateInput.addEventListener('change', refreshAvailabilitySlots);
  document.querySelectorAll('input[name="req-modality"]').forEach(input => {
    input.addEventListener('change', refreshAvailabilitySlots);
  });
}

async function refreshAvailabilitySlots() {
  const date = document.getElementById('req-date')?.value;
  const modality = document.querySelector('input[name="req-modality"]:checked')?.value || 'Virtual';
  const statusEl = document.getElementById('req-slots-status');
  const grid = document.getElementById('req-time-slots');
  const timeInput = document.getElementById('req-time');

  selectedSlotKey = null;
  if (timeInput) timeInput.value = '';
  if (!grid || !statusEl) return;

  if (availabilityUnsubscribe) {
    availabilityUnsubscribe();
    availabilityUnsubscribe = null;
  }

  if (!selectedTutorId || !date) {
    statusEl.textContent = 'Selecciona tutor, fecha y modalidad para ver horarios.';
    grid.innerHTML = '';
    return;
  }

  statusEl.textContent = 'Consultando disponibilidad en tiempo real...';

  if (FirebaseService.ready) {
    availabilityUnsubscribe = FirebaseService.listenToAvailability(
      { tutorId: selectedTutorId, date, modality },
      state => renderAvailabilitySlots(state)
    );
    return;
  }

  const tutor = getLS(STORAGE_KEYS.users).find(user => user.id === selectedTutorId) || {};
  const reserved = getLS(STORAGE_KEYS.requests).filter(req => (
    req.tutorId === selectedTutorId &&
    req.date === date &&
    ['pending', 'confirmed', 'completed'].includes(req.status)
  ));
  renderAvailabilitySlots(buildAvailabilityState(tutor, reserved, date, modality));
}

function renderAvailabilitySlots(state) {
  const statusEl = document.getElementById('req-slots-status');
  const grid = document.getElementById('req-time-slots');
  if (!grid || !statusEl) return;

  if (!state.all.length) {
    statusEl.textContent = 'Este tutor no tiene disponibilidad para esa fecha y modalidad.';
    grid.innerHTML = '<p class="empty-state compact">No hay horarios disponibles.</p>';
    return;
  }

  const availableCount = state.all.filter(slot => slot.status === 'available').length;
  statusEl.textContent = `${availableCount} horario(s) disponibles. Los ocupados se actualizan automaticamente.`;
  grid.innerHTML = state.all.map(slot => `
    <button
      type="button"
      class="time-slot ${slot.status}"
      ${slot.status !== 'available' ? 'disabled' : ''}
      onclick="selectTimeSlot('${slot.key}', '${slot.time}')">
      <strong>${slot.time}</strong>
      <span>${slot.label}</span>
    </button>
  `).join('');
}

function selectTimeSlot(key, time) {
  selectedSlotKey = key;
  const timeInput = document.getElementById('req-time');
  if (timeInput) timeInput.value = time;
  document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
  const button = [...document.querySelectorAll('.time-slot')].find(slot => slot.getAttribute('onclick')?.includes(`'${key}'`));
  if (button) button.classList.add('selected');
}

/** Envía la solicitud de tutoría */
async function submitTutoringRequest() {
  const subject  = document.getElementById('req-subject').value;
  const date     = document.getElementById('req-date').value;
  const time     = document.getElementById('req-time').value;
  const modality = document.querySelector('input[name="req-modality"]:checked')?.value;
  const notes    = document.getElementById('req-notes').value.trim();

  const requestValid = validateFields(['req-subject', 'req-date', 'req-time', 'req-notes']);
  if (!requestValid.ok) { showToast(requestValid.message, 'error'); return; }
  if (!selectedTutorId) { showToast('Selecciona un tutor de la lista.', 'error'); return; }

  const selectedDate = new Date(date + 'T' + time);
  if (selectedDate <= new Date()) {
    showToast('La fecha debe ser futura.', 'error');
    return;
  }
  const duplicateLocal = getLS(STORAGE_KEYS.requests).some(req => (
    req.tutorId === selectedTutorId &&
    req.date === date &&
    req.time === time &&
    ['pending', 'confirmed', 'completed'].includes(req.status)
  ));
  if (duplicateLocal) {
    showToast('Ese horario ya aparece reservado. Elige otro disponible.', 'error');
    refreshAvailabilitySlots();
    return;
  }

  const users = getLS(STORAGE_KEYS.users);
  const tutor = users.find(t => t.id === selectedTutorId) || SEED_TUTORS.find(t => t.id === selectedTutorId);
  let firestoreId = null;

  if (FirebaseService.ready && currentUser) {
    try {
      firestoreId = await FirebaseService.createTutoringRequest({
        studentId: currentUser.id,
        studentName: currentUser.name,
        tutorId: selectedTutorId,
        tutorEmail: tutor?.email || 'tutor@unisabaneta.edu.co',
        tutorName: tutor ? tutor.name : 'Tutor seleccionado',
        subject,
        date,
        time,
        modality,
        notes
      });
    } catch (error) {
      console.warn('No se pudo reservar el horario en Firebase:', error);
      showToast(error.message || 'Ese horario ya no esta disponible. Elige otro.', 'error', 6000);
      refreshAvailabilitySlots();
      return;
    }
  }

  const requestId = firestoreId || 'req_' + Date.now();
  const newTutoring = {
    id: requestId,
    firebaseId: firestoreId,
    subject,
    date,
    time,
    tutor: tutor ? tutor.name : 'Tutor seleccionado',
    tutorId: selectedTutorId,
    modality,
    notes,
    status: 'pending'
  };

  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  tutorings.push(newTutoring);
  setLS(STORAGE_KEYS.studentTutorings, tutorings);

  const requests = getLS(STORAGE_KEYS.requests);
  requests.unshift({
    id: newTutoring.id,
    firebaseId: firestoreId,
    student: currentUser?.name || 'Estudiante',
    studentId: currentUser?.id || null,
    studentName: currentUser?.name || 'Estudiante',
    tutorId: selectedTutorId,
    tutorEmail: tutor?.email || 'tutor@unisabaneta.edu.co',
    tutorName: tutor ? tutor.name : 'Tutor seleccionado',
    tutor: tutor ? tutor.name : 'Tutor seleccionado',
    subject,
    date,
    time,
    modality,
    notes,
    status: 'pending'
  });
  setLS(STORAGE_KEYS.requests, requests);

  if (FirebaseService.ready && firestoreId && selectedTutorId) {
    FirebaseService.createNotification({
      userId: selectedTutorId,
      senderId: currentUser.id,
      requestId: firestoreId,
      type: 'info',
      icon: '📋',
      color: 'notif-blue',
      title: 'Nueva solicitud de tutoría',
      message: `${currentUser.name} solicitó ${subject}${notes ? `. Notas: ${notes}` : '.'}`,
      time: 'Ahora',
      read: false
    }).catch(error => console.warn('La solicitud fue creada, pero no se pudo notificar al tutor:', error));
  }

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  safeSet('req-count', pendingRequests || '');
  safeSet('stat-new-req', pendingRequests);

  addNotification('info', '📋', 'notif-blue', 'Solicitud enviada',
    `Tu solicitud de tutoría de ${subject} fue enviada. Espera la confirmación del tutor.`);

  document.getElementById('req-subject').value = '';
  document.getElementById('req-date').value    = '';
  document.getElementById('req-time').value    = '';
  document.getElementById('req-notes').value   = '';
  selectedTutorId = null;
  selectedSlotKey = null;
  document.querySelectorAll('.tutor-card').forEach(c => c.classList.remove('selected'));
  refreshAvailabilitySlots();

  showToast(`Solicitud de tutoría enviada a ${tutor ? tutor.name : 'Tutor seleccionado'}.`, 'success', 6000);
  setTimeout(() => navigate('dashboard-student'), 1800);
}
// --------------------------------------------------
//  POSTULARSE COMO TUTOR
// ══════════════════════════════════════════════════

const ALL_SUBJECTS = [
  'Cálculo Diferencial', 'Álgebra Lineal', 'Programación I',
  'Bases de Datos', 'Estadística', 'Física I',
  'Física II', 'Inglés Técnico', 'Cálculo Integral',
  'Estructuras de Datos', 'Redes de Computadores', 'Sistemas Operativos'
];

/** Construye el grid de checkboxes de materias */
function buildSubjectCheckboxes() {
  const el = document.getElementById('subject-checkboxes');
  if (!el) return;

  // Pre-seleccionar si el usuario es tutor
  const preSelected = currentUser?.subjects || [];

  el.innerHTML = ALL_SUBJECTS.map(s => `
    <label class="check-label">
      <input type="checkbox" value="${s}" ${preSelected.includes(s) ? 'checked' : ''} />
      ${s}
    </label>
  `).join('');
}

/** Agrega un slot de disponibilidad (postulación) */
function addSlot() {
  applySlotCount++;
  const container = document.getElementById('availability-slots');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'slot-row';
  row.id = `slot-${applySlotCount}`;
  row.innerHTML = `
    <select>
      <option>Lunes</option><option>Martes</option><option>Miércoles</option>
      <option>Jueves</option><option>Viernes</option><option>Sábado</option>
    </select>
    <select>
      <option>Virtual</option><option>Presencial</option><option>Mixta</option><option>Ambas</option>
    </select>
    <input type="time" value="08:00" />
    <input type="time" value="10:00" />
    <button class="slot-remove" onclick="removeSlot('slot-${applySlotCount}')" title="Eliminar">✕</button>
  `;
  container.appendChild(row);
}

/** Agrega slot inicial en la postulación */
function buildApplySlot() {
  const container = document.getElementById('availability-slots');
  if (container && container.children.length === 0) addSlot();
}

/** Elimina un slot por ID */
function removeSlot(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/** Guarda la postulación como tutor */
async function saveApplication() {
  const subjects = [...document.querySelectorAll('#subject-checkboxes input:checked')].map(c => c.value);
  const bio      = document.getElementById('tutor-bio').value.trim();
  const modality = document.querySelector('input[name="tutor-modality"]:checked')?.value;
  const bioValid = validateFields(['tutor-bio']);
  const availability = readAvailabilityRows('#availability-slots .slot-row');

  if (subjects.length === 0) {
    showToast('Selecciona al menos una materia.', 'error');
    return;
  }
  if (!availability.ok) {
    showToast(availability.message, 'error');
    return;
  }
  if (!bioValid.ok) {
    showToast(bioValid.message, 'error');
    return;
  }

  currentUser = upsertLocalUser({
    ...currentUser,
    subjects,
    bio,
    modality,
    availability: availability.slots,
    role: 'tutor'
  });
  DataStore.setSession(currentUser);

  if (FirebaseService.ready && currentUser) {
    try {
      await FirebaseService.saveUserProfile(currentUser);
      await FirebaseService.loadUsers();
      buildTutorCards();
    } catch (error) {
      console.error('No se pudo guardar la postulación en Firebase:', error);
      showToast('La postulación se guardó localmente, pero no llegó a Firebase.', 'warning');
      return;
    }
  }

  showToast('🎓 ¡Postulación guardada correctamente!', 'success');
}

function readAvailabilityRows(selector) {
  const rows = [...document.querySelectorAll(selector)];
  if (!rows.length) {
    return { ok: false, message: 'Agrega al menos un horario de disponibilidad.', slots: [] };
  }
  const slots = rows.map(row => {
    const selects = row.querySelectorAll('select');
    const inputs = row.querySelectorAll('input[type="time"]');
    return {
      day: selects[0]?.value || '',
      modality: selects[1]?.value || 'Ambas',
      start: inputs[0]?.value || '',
      end: inputs[1]?.value || ''
    };
  });
  const invalid = slots.some(slot => !slot.day || !slot.start || !slot.end || slot.start >= slot.end);
  return {
    ok: !invalid,
    message: invalid ? 'Revisa que cada disponibilidad tenga día y hora inicial menor que la final.' : '',
    slots: slots.filter(slot => slot.day && slot.start && slot.end && slot.start < slot.end)
  };
}

// ══════════════════════════════════════════════════
//  CANCELAR TUTORÍA
// ══════════════════════════════════════════════════

function renderCancelList() {
  const container = document.getElementById('cancel-list');
  if (!container) return;

  const tutorings = getLS(STORAGE_KEYS.studentTutorings).filter(t => t.status !== 'cancelled');

  if (tutorings.length === 0) {
    container.innerHTML = '<p class="empty-state">No tienes tutorías activas para cancelar.</p>';
    return;
  }

  container.innerHTML = tutorings.map(t => `
    <div class="cancel-item" id="ci-${t.id}">
      <div class="cancel-info">
        <h4>${t.subject}</h4>
        <p>📅 ${formatDate(t.date)} · ⏰ ${t.time} · 👨‍🏫 ${t.tutor} · 🖥 ${t.modality}</p>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center;">
        ${badgeStatus(t.status)}
        <button class="btn btn-danger btn-sm" onclick="confirmCancel('${t.id}')">Cancelar</button>
      </div>
    </div>
  `).join('');
}

/** Solicita confirmación y cancela la tutoría (estudiante) */
function confirmCancel(id) {
  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  const tut = tutorings.find(t => t.id === id);
  if (!tut) return;

  pendingCancelTutoring = { id: id, type: 'student', tutoring: tut };
  openCancelReasonModal('student');
}

/** Solicita confirmación y cancela la tutoría (tutor) */
function confirmCancelTutor(id) {
  const sessions = getLS(STORAGE_KEYS.tutorSessions);
  const tut = sessions.find(s => s.id === id);
  if (!tut) return;

  pendingCancelTutoring = { id: id, type: 'tutor', tutoring: tut };
  openCancelReasonModal('tutor');
}

/** Abre el modal para ingresa el motivo de cancelación */
function openCancelReasonModal(cancelType) {
  const modal = document.getElementById('cancel-reason-modal');
  const reasonInput = document.getElementById('cancel-reason');
  const feedback = reasonInput?.closest('.form-group')?.querySelector('.field-feedback');

  if (reasonInput) reasonInput.value = '';
  if (feedback) feedback.textContent = '';
  if (reasonInput) reasonInput.closest('.form-group')?.classList.remove('has-error', 'has-success');

  modal.style.display = 'flex';
  if (reasonInput) {
    setTimeout(() => reasonInput.focus(), 100);
  }
}

/** Cierra el modal de motivo de cancelación */
function closeCancelReasonModal() {
  document.getElementById('cancel-reason-modal').style.display = 'none';
  pendingCancelTutoring = null;
}

/** Procesa la cancelación con el motivo */
async function submitCancelWithReason() {
  const reasonInput = document.getElementById('cancel-reason');
  const reason = reasonInput?.value?.trim() || '';

  if (!reason) {
    showToast('Debes escribir el motivo de la cancelación.', 'error');
    if (reasonInput) {
      const group = reasonInput.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        const feedback = group.querySelector('.field-feedback');
        if (feedback) feedback.textContent = 'El motivo de cancelación es obligatorio.';
      }
    }
    return;
  }

  if (!pendingCancelTutoring) {
    closeCancelReasonModal();
    return;
  }

  const { id, type, tutoring } = pendingCancelTutoring;
  closeCancelReasonModal();

  if (type === 'student') {
    await performStudentCancellation(id, tutoring, reason);
  } else {
    await performTutorCancellation(id, tutoring, reason);
  }
}

/** Realiza la cancelación desde el lado del estudiante */
async function performStudentCancellation(id, tutoring, reason) {
  const all = getLS(STORAGE_KEYS.studentTutorings);
  const idx = all.findIndex(t => t.id === id);
  if (idx !== -1) {
    all[idx].status = 'cancelled';
    all[idx].cancelReason = reason;
    all[idx].cancelledAt = new Date().toISOString();
    setLS(STORAGE_KEYS.studentTutorings, all);
  }
  if (FirebaseService.ready) {
    try {
      await FirebaseService.updateTutoringRequest(id, { status: 'cancelled', cancelReason: reason });
    } catch (error) {
      console.error('No se pudo cancelar en Firebase:', error);
      showToast('La tutoría se canceló localmente, pero no llegó a Firebase.', 'warning');
    }
  }
  addNotification('cancelled', '❌', 'notif-red', 'Tutoría cancelada',
    `Cancelaste la tutoría de ${tutoring.subject} del ${formatDate(tutoring.date)}. Motivo: ${reason}`);
  showToast('Tutoría cancelada correctamente.', 'success');
  renderCancelList();
}

/** Realiza la cancelación desde el lado del tutor */
async function performTutorCancellation(id, tutoring, reason) {
  const all = getLS(STORAGE_KEYS.tutorSessions);
  const idx = all.findIndex(s => s.id === id);
  if (idx !== -1) {
    all[idx].status = 'cancelled';
    all[idx].cancelReason = reason;
    all[idx].cancelledAt = new Date().toISOString();
    setLS(STORAGE_KEYS.tutorSessions, all);
  }
  if (FirebaseService.ready) {
    try {
      await FirebaseService.updateTutoringRequest(id, { status: 'cancelled', cancelReason: reason, cancelledByTutor: true });
    } catch (error) {
      console.error('No se pudo cancelar en Firebase:', error);
      showToast('La tutoría se canceló localmente, pero no llegó a Firebase.', 'warning');
    }
  }
  addNotification('cancelled', '❌', 'notif-red', 'Tutoría cancelada',
    `Cancelaste la tutoría de ${tutoring.subject} del ${formatDate(tutoring.date)} con ${tutoring.student || tutoring.studentName}. Motivo: ${reason}`);
  showToast('Tutoría cancelada correctamente.', 'success');
  renderTutorCancelList();
}

/** Renderiza la lista de cancelaciones del tutor */
function renderTutorCancelList() {
  const container = document.getElementById('tutor-cancel-list');
  if (!container) return;

  const sessions = getLS(STORAGE_KEYS.tutorSessions).filter(s => s.status !== 'cancelled');

  if (sessions.length === 0) {
    container.innerHTML = '<p class="empty-state">No tienes tutorías programadas para cancelar.</p>';
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="cancel-item" id="tci-${s.id}">
      <div class="cancel-info">
        <h4>${s.subject}</h4>
        <p>📅 ${formatDate(s.date)} · ⏰ ${s.time} · 👨‍🎓 ${s.student || s.studentName || 'Estudiante'} · 🖥 ${s.modality}</p>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center;">
        ${badgeStatus(s.status)}
        <button class="btn btn-danger btn-sm" onclick="confirmCancelTutor('${s.id}')">Cancelar</button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════
//  NOTIFICACIONES
// ══════════════════════════════════════════════════

function renderNotifications() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  const notifs = getVisibleNotifications();

  if (notifs.length === 0) {
    container.innerHTML = '<p class="empty-state">No tienes notificaciones.</p>';
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="readNotif('${n.id}')">
      <div class="notif-icon-wrap ${n.color}">${n.icon}</div>
      <div class="notif-text">
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.message)}</p>
      </div>
      <span class="notif-time">${n.time}</span>
      ${!n.read ? '<div class="unread-dot"></div>' : ''}
    </div>
  `).join('');

  refreshNotifBadge();
}

/** Marca una notificación como leída */
async function readNotif(id) {
  const notifs = getLS(STORAGE_KEYS.notifications);
  const idx = notifs.findIndex(n => n.id === id);
  if (idx !== -1 && !notifs[idx].read) {
    notifs[idx].read = true;
    setLS(STORAGE_KEYS.notifications, notifs);
    if (FirebaseService.ready) {
      try {
        await FirebaseService.markNotificationRead(id);
      } catch (error) {
        console.error('No se pudo marcar la notificación en Firebase:', error);
      }
    }
    renderNotifications();
  }
}

/** Marca todas las notificaciones como leídas */
async function markAllRead() {
  const notifs = getLS(STORAGE_KEYS.notifications).map(n => (
    isNotificationVisibleForCurrentUser(n) ? { ...n, read: true } : n
  ));
  setLS(STORAGE_KEYS.notifications, notifs);
  if (FirebaseService.ready && currentUser) {
    try {
      await FirebaseService.markAllNotificationsRead(currentUser.id);
    } catch (error) {
      console.error('No se pudieron marcar todas en Firebase:', error);
    }
  }
  renderNotifications();
  showToast('Todas las notificaciones marcadas como leídas.', 'info');
}

/** Actualiza el badge/dot de notificaciones */
function refreshNotifBadge() {
  const unread = getVisibleNotifications().filter(n => !n.read).length;
  const countEl = document.getElementById('notif-count');
  const dotEl   = document.getElementById('notif-dot');
  if (countEl) countEl.textContent = unread > 0 ? unread : '';
  if (dotEl)   dotEl.classList.toggle('show', unread > 0);
}

function getVisibleNotifications() {
  return getLS(STORAGE_KEYS.notifications).filter(isNotificationVisibleForCurrentUser);
}

function isNotificationVisibleForCurrentUser(notification) {
  return !notification.userId || !currentUser?.id || notification.userId === currentUser.id;
}

/** Agrega una nueva notificación al sistema */
function addNotification(type, icon, color, title, message) {
  const notifs = getLS(STORAGE_KEYS.notifications);
  const notification = {
    id: 'n_' + Date.now(),
    type, icon, color, title, message,
    time: 'Ahora',
    read: false,
    userId: currentUser?.id || null
  };
  notifs.unshift(notification);
  setLS(STORAGE_KEYS.notifications, notifs);
  refreshNotifBadge();

  if (FirebaseService.ready && currentUser) {
    FirebaseService.createNotification(notification)
      .catch(error => console.error('No se pudo crear la notificación en Firebase:', error));
  }
}

function openReviewModal(tutoringId) {
  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  const tutoring = tutorings.find(item => item.id === tutoringId || item.firebaseId === tutoringId);
  if (!isTutoringReviewable(tutoring)) {
    showToast('Solo puedes reseñar tutorías completadas.', 'error');
    return;
  }

  showConfirm(
    'Calificar tutor',
    `
      <div class="review-form">
        <label>Puntuación</label>
        <div class="star-input" id="review-stars">
          ${[1, 2, 3, 4, 5].map(value => `<button type="button" onclick="setReviewRating(${value})" data-rating="${value}">★</button>`).join('')}
        </div>
        <label for="review-comment">Comentario</label>
        <textarea id="review-comment" rows="4" placeholder="Cuéntanos cómo fue la tutoría..."></textarea>
      </div>
    `,
    () => submitReview(tutoringId)
  );
  setReviewRating(5);
}

function setReviewRating(value) {
  const modal = document.getElementById('confirm-modal');
  modal.dataset.rating = String(value);
  modal.querySelectorAll('.star-input button').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.rating) <= value);
  });
}

async function submitReview(tutoringId) {
  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  const idx = tutorings.findIndex(item => item.id === tutoringId || item.firebaseId === tutoringId);
  const tutoring = tutorings[idx];
  const rating = Number(document.getElementById('confirm-modal').dataset.rating || 0);
  const comment = document.getElementById('review-comment')?.value.trim() || '';

  if (!isTutoringReviewable(tutoring)) {
    showToast('Esta tutoría no está habilitada para reseña.', 'error');
    return;
  }
  if (rating < 1 || rating > 5) {
    showToast('Selecciona una calificación de 1 a 5 estrellas.', 'error');
    return;
  }
  if (comment.length < 8) {
    showToast('Escribe un comentario un poco más descriptivo.', 'error');
    return;
  }

  const review = {
    tutoringId: tutoring.firebaseId || tutoring.id,
    studentId: currentUser?.id,
    studentName: currentUser?.name || 'Estudiante',
    tutorId: tutoring.tutorId || selectedTutorId || findTutorIdByName(tutoring.tutor),
    tutorName: tutoring.tutor,
    subject: tutoring.subject,
    rating,
    comment
  };

  try {
    if (FirebaseService.ready) {
      await FirebaseService.createReview(review);
      await FirebaseService.updateTutoringRequest(review.tutoringId, { reviewed: true });
    } else {
      const reviews = getLS(STORAGE_KEYS.reviews);
      if (reviews.some(item => item.tutoringId === review.tutoringId && item.studentId === review.studentId)) {
        throw new Error('Ya calificaste esta tutoría.');
      }
      reviews.unshift({ ...review, id: `${review.tutoringId}_${review.studentId}`, createdAt: new Date().toISOString() });
      setLS(STORAGE_KEYS.reviews, reviews);
      updateLocalTutorRating(review.tutorId, rating);
    }

    tutorings[idx].reviewed = true;
    setLS(STORAGE_KEYS.studentTutorings, tutorings);
    showToast('Gracias, tu reseña fue publicada.', 'success');
    renderStudentDashboard();
  } catch (error) {
    console.error('No se pudo guardar la reseña:', error);
    showToast(error.message || 'No se pudo guardar la reseña.', 'error');
  }
}

function findTutorIdByName(name) {
  return getLS(STORAGE_KEYS.users).find(user => user.name === name)?.id || SEED_TUTORS.find(tutor => tutor.name === name)?.id || null;
}

function updateLocalTutorRating(tutorId, rating) {
  const users = getLS(STORAGE_KEYS.users);
  const idx = users.findIndex(user => user.id === tutorId);
  if (idx === -1) return;
  const total = Number(users[idx].ratingTotal || users[idx].rating || 0) + rating;
  const count = Number(users[idx].ratingCount || (users[idx].rating ? 1 : 0)) + 1;
  users[idx].ratingTotal = total;
  users[idx].ratingCount = count;
  users[idx].rating = Number((total / count).toFixed(1));
  setLS(STORAGE_KEYS.users, users);
}

// ══════════════════════════════════════════════════
//  PERFIL
// ══════════════════════════════════════════════════

function populateProfile() {
  currentUser = normalizeUser(currentUser);
  if (!currentUser) return;

  safeSet('pf-name',     currentUser.name);
  safeSet('pf-email',    currentUser.email);
  safeSet('pf-career',   currentUser.career);
  safeSet('pf-semester', currentUser.semester ? `Semestre ${currentUser.semester}` : '—');
  safeSet('pf-avg',      currentUser.avg ? currentUser.avg.toFixed(1) : '—');
  safeSet('pf-rating',   currentUser.rating ? `${currentUser.rating} ⭐` : 'No calificado');

  const initial = (currentUser.name || 'U').charAt(0).toUpperCase();
  safeSet('profile-avatar-big', initial);
  safeSet('profile-fullname', currentUser.name);
  safeSet('profile-email-display', currentUser.email);

  const roleBadge = document.getElementById('profile-role-badge');
  if (roleBadge) {
    const isStudent = currentUser.role === 'student';
    roleBadge.textContent = isStudent ? 'Estudiante' : 'Tutor';
    roleBadge.className   = `badge ${isStudent ? 'badge-student' : 'badge-tutor'} profile-role-badge`;
  }

  // Estrellas de calificación
  const starsEl = document.getElementById('profile-stars');
  if (starsEl && currentUser.rating) {
    const full  = Math.floor(currentUser.rating);
    const half  = currentUser.rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    starsEl.textContent = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  } else if (starsEl) {
    starsEl.textContent = '';
  }
  loadProfileReviews();

  // Prellenar campos de edición
  const nameInput    = document.getElementById('edit-name');
  const careerInput  = document.getElementById('edit-career');
  const semInput     = document.getElementById('edit-semester');
  const avgInput     = document.getElementById('edit-avg');
  if (nameInput)   nameInput.value   = currentUser.name;
  if (careerInput) careerInput.value = currentUser.career;
  if (semInput)    semInput.value    = currentUser.semester;
  if (avgInput)    avgInput.value    = currentUser.avg;
}

function loadProfileReviews() {
  const card = document.getElementById('profile-reviews-card');
  if (!card || !currentUser) return;

  if (currentUser.role !== 'tutor') {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';
  if (reviewsUnsubscribe) {
    reviewsUnsubscribe();
    reviewsUnsubscribe = null;
  }

  if (FirebaseService.ready) {
    reviewsUnsubscribe = FirebaseService.listenToTutorReviews(currentUser.id, renderProfileReviews);
    return;
  }

  renderProfileReviews(getLS(STORAGE_KEYS.reviews).filter(review => review.tutorId === currentUser.id));
}

function renderProfileReviews(reviews) {
  const list = document.getElementById('profile-reviews-list');
  if (!list) return;

  if (!reviews.length) {
    list.innerHTML = '<p class="empty-state">Aún no tienes reseñas publicadas.</p>';
    return;
  }

  const avg = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length;
  safeSet('pf-rating', `${avg.toFixed(1)} ★ (${reviews.length} reseña${reviews.length === 1 ? '' : 's'})`);
  list.innerHTML = reviews.slice(0, 5).map(review => `
    <article class="review-item">
      <div class="review-head">
        <strong>${review.studentName || 'Estudiante'}</strong>
        <span class="review-stars">${renderStars(review.rating)}</span>
      </div>
      <p>${review.comment}</p>
      <small>${review.subject || 'Tutoría'} · ${review.createdAt ? formatDate(review.createdAt.slice(0, 10)) : 'Reciente'}</small>
    </article>
  `).join('');
}

/** Alterna entre vista y edición del perfil */
function toggleEditProfile() {
  const view = document.getElementById('profile-fields-view');
  const edit = document.getElementById('profile-fields-edit');
  const btn  = document.getElementById('edit-profile-btn');
  const isEditing = edit.style.display !== 'none';

  view.style.display = isEditing ? 'block' : 'none';
  edit.style.display = isEditing ? 'none' : 'block';
  btn.textContent    = isEditing ? '✏️ Editar' : '✕ Cancelar';
}

/** Guarda los cambios del perfil */
async function saveProfile() {
  const name     = document.getElementById('edit-name').value.trim();
  const career   = document.getElementById('edit-career').value.trim();
  const semester = parseInt(document.getElementById('edit-semester').value);
  const avg      = parseFloat(document.getElementById('edit-avg').value);
  const profileValid = validateFields(['edit-name', 'edit-career', 'edit-semester', 'edit-avg']);

  if (!profileValid.ok) {
    showToast(profileValid.message, 'error');
    return;
  }

  currentUser = upsertLocalUser({ ...currentUser, name, career, semester, avg });
  DataStore.setSession(currentUser);

  if (FirebaseService.ready && currentUser) {
    try {
      await FirebaseService.saveUserProfile(currentUser);
    } catch (error) {
      console.error('No se pudo actualizar el perfil en Firebase:', error);
      showToast('El perfil se actualizó localmente, pero no llegó a Firebase.', 'warning');
      return;
    }
  }

  populateProfile();
  toggleEditProfile();
  updateUserUI();
  showToast('✅ Perfil actualizado correctamente.', 'success');
}

//  REPORTES

function buildReportFilters() {
  const subjectFilter = document.getElementById('report-subject-filter');
  if (!subjectFilter) return;
  const selected = subjectFilter.value;
  const subjects = [...new Set([
    ...ALL_SUBJECTS,
    ...getAllTutoringsForReport().map(item => item.subject).filter(Boolean)
  ])].sort();
  subjectFilter.innerHTML = '<option value="">Todas</option>' + subjects
    .map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
    .join('');
  subjectFilter.value = subjects.includes(selected) ? selected : '';
}

async function syncReportsFromFirebase() {
  if (!FirebaseService.ready) {
    const connected = await FirebaseService.init();
    if (!connected) {
      renderReports();
      return;
    }
  }

  try {
    const reportData = await FirebaseService.loadReportData();
    if (reportData.users.length) setLS(STORAGE_KEYS.users, reportData.users.map(normalizeUser).filter(Boolean));
    if (reportData.requests.length) setLS(STORAGE_KEYS.requests, reportData.requests.map(mapFirebaseRequestForLocal));
    if (reportData.sessions.length) setLS(STORAGE_KEYS.tutorSessions, reportData.sessions);
    buildReportFilters();
    renderReports();
    showToast('Reportes actualizados desde Firebase.', 'success');
  } catch (error) {
    console.warn('No se pudieron leer reportes desde Firebase:', error);
    renderReports();
    showToast('Se muestran reportes locales. Revisa reglas de Firestore para lectura global.', 'warning', 6000);
  }
}

function mapFirebaseRequestForLocal(item) {
  return {
    id: item.id,
    firebaseId: item.id,
    student: item.studentName || item.student || 'Estudiante',
    studentId: item.studentId || null,
    tutorId: item.tutorId || null,
    tutorEmail: item.tutorEmail || '',
    tutorName: item.tutorName || item.tutor || 'Tutor',
    tutor: item.tutorName || item.tutor || 'Tutor',
    subject: item.subject,
    date: item.date,
    time: item.time,
    modality: item.modality,
    status: item.status || 'pending',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

function renderReports() {
  buildReportFilters();
  renderTutoringReport();
  renderUsersReport();
}

function getAllTutoringsForReport() {
  const studentTutorings = getLS(STORAGE_KEYS.studentTutorings);
  const requests = getLS(STORAGE_KEYS.requests).map(req => ({
    id: req.id,
    subject: req.subject,
    date: req.date,
    time: req.time,
    tutor: req.tutorName || req.tutor,
    tutorId: req.tutorId,
    modality: req.modality,
    status: req.status,
    createdAt: req.createdAt
  }));
  const sessions = getLS(STORAGE_KEYS.tutorSessions).map(session => ({
    id: session.id,
    subject: session.subject,
    date: session.date,
    time: session.time,
    tutor: session.tutorName || currentUser?.name || 'Tutor',
    tutorId: session.tutorId,
    modality: session.modality,
    status: session.status,
    createdAt: session.createdAt
  }));

  const seen = new Set();
  return [...studentTutorings, ...requests, ...sessions]
    .filter(item => item && item.subject && item.date)
    .filter(item => {
      const key = `${item.subject}|${item.date}|${item.time}|${item.tutorId || item.tutor || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function renderTutoringReport() {
  const subjectFilter = document.getElementById('report-subject-filter')?.value || '';
  const tutorings = getAllTutoringsForReport()
    .filter(item => !subjectFilter || item.subject === subjectFilter)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  const users = getLS(STORAGE_KEYS.users);
  const studentsCount = users.filter(user => user.role === 'student').length;
  const subjectCounts = countBy(tutorings, 'subject');
  const tutorCounts = countBy(tutorings, item => item.tutor || item.tutorName || 'Sin tutor');
  const mostSubject = getTopEntry(subjectCounts);
  const mostTutor = getTopEntry(tutorCounts);

  renderMetricCards('tutoring-report-cards', [
    { label: 'Tutorías registradas', value: tutorings.length, tone: 'blue' },
    { label: 'Tutor más solicitado', value: mostTutor.label, detail: `${mostTutor.count} solicitud(es)`, tone: 'green' },
    { label: 'Estudiantes registrados', value: studentsCount, tone: 'orange' },
    { label: 'Materia frecuente', value: mostSubject.label, detail: `${mostSubject.count} vez/veces`, tone: 'purple' }
  ]);

  renderBarChart('subjects-chart', subjectCounts);
  const tbody = document.getElementById('tutoring-report-tbody');
  if (!tbody) return;
  tbody.innerHTML = tutorings.length
    ? tutorings.map(item => `
      <tr>
        <td>${escapeHtml(item.subject)}</td>
        <td>${formatDate(item.date)}</td>
        <td>${escapeHtml(item.time || '—')}</td>
        <td>${escapeHtml(item.tutor || item.tutorName || 'Sin asignar')}</td>
        <td>${escapeHtml(item.modality || '—')}</td>
        <td>${badgeStatus(item.status || 'pending')}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="6" class="empty-cell">No hay tutorías para el filtro seleccionado.</td></tr>';
}

function renderUsersReport() {
  const roleFilter = document.getElementById('report-role-filter')?.value || '';
  const users = getLS(STORAGE_KEYS.users)
    .map(normalizeUser)
    .filter(Boolean)
    .filter(user => !roleFilter || user.role === roleFilter)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  const allUsers = getLS(STORAGE_KEYS.users).map(normalizeUser).filter(Boolean);
  const roleCounts = countBy(allUsers, item => item.role === 'tutor' ? 'Tutores' : 'Estudiantes');
  const tutorsCount = allUsers.filter(user => user.role === 'tutor').length;
  const studentsCount = allUsers.filter(user => user.role === 'student').length;
  const recentActivity = getRecentActivityCount();

  renderMetricCards('users-report-cards', [
    { label: 'Usuarios registrados', value: allUsers.length, tone: 'blue' },
    { label: 'Tutores', value: tutorsCount, tone: 'green' },
    { label: 'Estudiantes', value: studentsCount, tone: 'orange' },
    { label: 'Actividad reciente', value: recentActivity, detail: 'últimos 30 días', tone: 'purple' }
  ]);

  renderBarChart('roles-chart', roleCounts);
  const tbody = document.getElementById('users-report-tbody');
  if (!tbody) return;
  tbody.innerHTML = users.length
    ? users.map(user => `
      <tr>
        <td>${escapeHtml(user.name)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${user.role === 'tutor' ? 'Tutor' : 'Estudiante'}</td>
        <td>${escapeHtml(user.career || 'Sin registrar')}</td>
        <td>${escapeHtml(user.semester || '—')}</td>
        <td>${escapeHtml(getUserActivityLabel(user))}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="6" class="empty-cell">No hay usuarios para el filtro seleccionado.</td></tr>';
}

function renderMetricCards(containerId, metrics) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = metrics.map(metric => `
    <article class="report-card ${metric.tone}">
      <span>${escapeHtml(metric.label)}</span>
      <strong>${escapeHtml(metric.value ?? '—')}</strong>
      ${metric.detail ? `<small>${escapeHtml(metric.detail)}</small>` : ''}
    </article>
  `).join('');
}

function renderBarChart(containerId, counts) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(1, ...entries.map(([, count]) => count));
  container.innerHTML = entries.length
    ? entries.map(([label, count]) => `
      <div class="bar-row">
        <span>${escapeHtml(label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, (count / max) * 100)}%"></div></div>
        <strong>${count}</strong>
      </div>
    `).join('')
    : '<p class="empty-state compact">No hay datos suficientes para graficar.</p>';
}

function countBy(items, keyOrGetter) {
  return items.reduce((acc, item) => {
    const key = typeof keyOrGetter === 'function' ? keyOrGetter(item) : item[keyOrGetter];
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function getTopEntry(counts) {
  const [label, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
  return { label, count };
}

function getRecentActivityCount() {
  const limit = new Date();
  limit.setDate(limit.getDate() - 30);
  return [
    ...getLS(STORAGE_KEYS.requests),
    ...getLS(STORAGE_KEYS.notifications),
    ...getLS(STORAGE_KEYS.reviews)
  ].filter(item => item.createdAt && new Date(item.createdAt) >= limit).length;
}

function getUserActivityLabel(user) {
  const related = [
    ...getLS(STORAGE_KEYS.requests).filter(item => item.studentId === user.id || item.tutorId === user.id),
    ...getLS(STORAGE_KEYS.notifications).filter(item => item.userId === user.id)
  ].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  return related[0]?.createdAt ? formatDate(related[0].createdAt.slice(0, 10)) : 'Sin actividad reciente';
}

function exportReportCSV(type) {
  const rows = type === 'users'
    ? getLS(STORAGE_KEYS.users).map(normalizeUser).filter(Boolean).map(user => ({
      nombre: user.name,
      correo: user.email,
      rol: user.role,
      carrera: user.career,
      semestre: user.semester,
      promedio: user.avg
    }))
    : getAllTutoringsForReport().map(item => ({
      materia: item.subject,
      fecha: item.date,
      hora: item.time,
      tutor: item.tutor || item.tutorName,
      modalidad: item.modality,
      estado: item.status
    }));

  if (!rows.length) {
    showToast('No hay datos para exportar.', 'warning');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(header => csvEscape(row[header])).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `unitutor_reporte_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

//  CALENDARIO (TUTOR)

function buildCalendar() {
  const widget = document.getElementById('calendar-widget');
  if (!widget) return;

  const year  = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const today = new Date();

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dayNames   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  // Días con sesión (simulado)
  const sessions = getLS(STORAGE_KEYS.tutorSessions);
  const datesWithSession = sessions.map(s => s.date);

  // Primer día del mes
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = `
    <div class="cal-header">
      <button class="cal-nav" onclick="changeCalMonth(-1)">‹</button>
      <h4>${monthNames[month]} ${year}</h4>
      <button class="cal-nav" onclick="changeCalMonth(1)">›</button>
    </div>
    <div class="cal-grid">
  `;

  // Nombres de días
  dayNames.forEach(d => { html += `<div class="cal-day-name">${d}</div>`; });

  // Celdas vacías iniciales
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday    = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
    const isSelected = selectedCalDay === dateStr;
    const hasEvent   = datesWithSession.includes(dateStr);

    let cls = 'cal-day';
    if (isToday)    cls += ' today';
    if (isSelected) cls += ' selected';
    if (hasEvent)   cls += ' has-event';

    html += `<div class="${cls}" onclick="selectCalDay('${dateStr}')">${d}</div>`;
  }

  html += `</div>`;
  widget.innerHTML = html;
}

function changeCalMonth(dir) {
  calendarDate.setMonth(calendarDate.getMonth() + dir);
  buildCalendar();
}

function selectCalDay(dateStr) {
  selectedCalDay = dateStr;
  buildCalendar();

  // Mostrar sesiones del día
  const sessions = getLS(STORAGE_KEYS.tutorSessions).filter(s => s.date === dateStr);
  const container = document.getElementById('calendar-day-sessions');
  if (!container) return;

  if (sessions.length === 0) {
    container.innerHTML = `<p class="empty-state">No tienes sesiones el ${formatDate(dateStr)}.</p>`;
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="session-day-item">
      <h4>${s.subject} — ${s.time}</h4>
      <p>👤 ${s.student} · 🖥 ${s.modality} · ${badgeStatus(s.status)}</p>
    </div>
  `).join('');
}

//  DISPONIBILIDAD TUTOR

function buildTutorSlot() {
  const container = document.getElementById('tutor-slots-container');
  if (container && container.children.length === 0) addTutorSlot();
}

function addTutorSlot() {
  tutorSlotCount++;
  const container = document.getElementById('tutor-slots-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'slot-row';
  row.id = `tslot-${tutorSlotCount}`;
  row.innerHTML = `
    <select>
      <option>Lunes</option><option>Martes</option><option>Miércoles</option>
      <option>Jueves</option><option>Viernes</option><option>Sábado</option>
    </select>
    <select>
      <option>Virtual</option><option>Presencial</option><option>Mixta</option><option>Ambas</option>
    </select>
    <input type="time" value="08:00" />
    <input type="time" value="10:00" />
    <button class="slot-remove" onclick="removeTutorSlot('tslot-${tutorSlotCount}')" title="Eliminar">✕</button>
  `;
  container.appendChild(row);
}

function removeTutorSlot(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

async function saveTutorAvailability() {
  const availabilityResult = readAvailabilityRows('#tutor-slots-container .slot-row');
  if (!availabilityResult.ok) {
    showToast(availabilityResult.message, 'error');
    return;
  }
  const availability = availabilityResult.slots;

  currentUser = upsertLocalUser({ ...currentUser, availability });
  DataStore.setSession(currentUser);

  if (FirebaseService.ready && currentUser) {
    try {
      await FirebaseService.saveUserProfile(currentUser);
    } catch (error) {
      console.error('No se pudo guardar la disponibilidad en Firebase:', error);
      showToast('La disponibilidad se guardó localmente, pero no llegó a Firebase.', 'warning');
      return;
    }
  }

  showToast('✅ Disponibilidad guardada correctamente.', 'success');
}

//  SOLICITUDES (TUTOR)

function renderTutorRequests() {
  const container = document.getElementById('tutor-requests-list');
  if (!container) return;

  const requests = getLS(STORAGE_KEYS.requests)
    .filter(r => r && r.subject && r.date && r.time)
    .filter(r => !currentUser?.id || !r.tutorId || r.tutorId === currentUser.id || r.tutorEmail === currentUser.email);

  if (requests.length === 0) {
    container.innerHTML = '<p class="empty-state">No tienes solicitudes pendientes.</p>';
    return;
  }

  container.innerHTML = requests.map(r => `
    <div class="request-item" id="ri-${r.id}">
      <div class="request-avatar">${(r.student || r.studentName || 'E').charAt(0)}</div>
      <div class="request-info">
        <h4>${r.student || r.studentName || 'Estudiante'}</h4>
        <p>📚 ${r.subject} · 📅 ${formatDate(r.date)} · ⏰ ${r.time} · 🖥 ${r.modality}</p>
        ${r.notes ? `<p class="request-notes"><strong>Notas:</strong> ${escapeHtml(r.notes)}</p>` : ''}
      </div>
      ${badgeStatus(r.status)}
      ${r.status === 'pending' ? `
        <div class="request-actions">
          <button class="btn btn-success btn-sm" onclick="respondRequest('${r.id}', 'confirmed')">✓ Aceptar</button>
          <button class="btn btn-danger btn-sm"  onclick="openRejectRequestModal('${r.id}')">✕ Rechazar</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function buildTutorRequestsList() {
  // Se llama al navegar; aquí solo aseguramos que existe
}

function openRejectRequestModal(id) {
  const requests = getLS(STORAGE_KEYS.requests);
  const request = requests.find(r => r.id === id);
  if (!request) return;

  showConfirm(
    'Rechazar solicitud',
    `
      <div class="review-form">
        <p class="modal-helper">Ingresa el motivo para rechazar la tutoría de <strong>${escapeHtml(request.subject)}</strong>. El estudiante recibirá esta respuesta.</p>
        <label for="reject-reason">Motivo del rechazo *</label>
        <textarea id="reject-reason" rows="4" placeholder="Ejemplo: No tengo disponibilidad en ese horario."></textarea>
        <small class="field-error" id="reject-reason-error" style="display:none;">El motivo es obligatorio.</small>
      </div>
    `,
    () => submitRejectRequest(id)
  );
  setTimeout(() => {
    const reasonEl = document.getElementById('reject-reason');
    const errorEl = document.getElementById('reject-reason-error');
    reasonEl?.focus();
    reasonEl?.addEventListener('input', () => {
      if (reasonEl.value.trim() && errorEl) errorEl.style.display = 'none';
    });
  }, 0);
}

async function submitRejectRequest(id) {
  const reasonEl = document.getElementById('reject-reason');
  const errorEl = document.getElementById('reject-reason-error');
  const reason = reasonEl?.value.trim() || '';

  if (!reason) {
    if (errorEl) errorEl.style.display = 'block';
    reasonEl?.focus();
    showToast('Debes ingresar el motivo del rechazo.', 'error');
    return false;
  }

  if (errorEl) errorEl.style.display = 'none';
  await respondRequest(id, 'cancelled', reason);
  return true;
}

/** Acepta o rechaza una solicitud */
async function respondRequest(id, newStatus, responseReason = '') {
  const requests = getLS(STORAGE_KEYS.requests);
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return;

  const req = requests[idx];
  requests[idx].status = newStatus;
  if (newStatus === 'cancelled') {
    requests[idx].rejectionReason = responseReason;
    requests[idx].responseReason = responseReason;
    requests[idx].respondedAt = new Date().toISOString();
  }
  setLS(STORAGE_KEYS.requests, requests);
  const updatedReq = requests[idx];
  updateStudentTutoringStatus(updatedReq, newStatus, responseReason);
  addStudentResponseNotification(updatedReq, newStatus, responseReason);

  if (FirebaseService.ready) {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'cancelled') {
        updateData.rejectionReason = responseReason;
        updateData.responseReason = responseReason;
        updateData.respondedAt = new Date().toISOString();
      }
      await FirebaseService.updateTutoringRequest(req.firebaseId || id, updateData);
    } catch (error) {
      console.error('No se pudo actualizar la solicitud en Firebase:', error);
      showToast('La solicitud se actualizó localmente. Firebase se sincronizará cuando sea posible.', 'warning');
    }
  }

  const label = newStatus === 'confirmed' ? 'aceptada' : 'negada';
  showToast(`Solicitud de ${req.student || req.studentName || 'Estudiante'} ${label}.`, newStatus === 'confirmed' ? 'success' : 'info');

  // Actualizar badge
  const pending = requests.filter(r => r.status === 'pending').length;
  safeSet('req-count', pending || '');
  safeSet('stat-new-req', pending);

  renderTutorRequests();

  // Si acepta, agregar a sesiones
  if (newStatus === 'confirmed') {
    const sessions = getLS(STORAGE_KEYS.tutorSessions);
    const newSession = {
      id: 'ts_' + Date.now(),
      requestId: id,
      student: req.student,
      studentId: req.studentId,
      tutorId: currentUser?.id,
      subject: req.subject,
      date: req.date,
      time: req.time,
      modality: req.modality,
      status: 'confirmed'
    };
    if (FirebaseService.ready) {
      try {
        newSession.id = await FirebaseService.createTutorSession(newSession);
      } catch (error) {
        console.error('No se pudo crear la sesión en Firebase:', error);
      }
    }
    sessions.push(newSession);
    setLS(STORAGE_KEYS.tutorSessions, sessions);
  }
}

// ══════════════════════════════════════════════════
//  MODAL DE CONFIRMACIÓN
// ══════════════════════════════════════════════════

function updateStudentTutoringStatus(request, newStatus, responseReason = '') {
  const tutorings = getLS(STORAGE_KEYS.studentTutorings);
  const idx = tutorings.findIndex(t => (
    t.id === request.id ||
    t.firebaseId === request.firebaseId ||
    (
      t.subject === request.subject &&
      t.date === request.date &&
      t.time === request.time &&
      (!request.tutor || t.tutor === request.tutor || t.tutor === request.tutorName)
    )
  ));

  if (idx !== -1) {
    tutorings[idx].status = newStatus;
    tutorings[idx].responseMessage = newStatus === 'confirmed'
      ? 'Te aceptaron la tutoría'
      : 'Te negaron la tutoría';
    if (newStatus === 'cancelled') {
      tutorings[idx].rejectionReason = responseReason;
      tutorings[idx].responseReason = responseReason;
    }
    setLS(STORAGE_KEYS.studentTutorings, tutorings);
  }
}

function addStudentResponseNotification(request, newStatus, responseReason = '') {
  const accepted = newStatus === 'confirmed';
  const tutorName = currentUser?.name || request.tutor || request.tutorName || 'Tu tutor';
  const subject = request.subject || 'tu tutoría';
  const dateText = request.date ? formatDate(request.date) : 'la fecha programada';
  const rejectionDetail = responseReason ? ` Motivo: ${responseReason}` : '';

  const notifications = getLS(STORAGE_KEYS.notifications);
  const notification = {
    id: 'n_' + Date.now(),
    type: accepted ? 'confirmation' : 'cancelled',
    icon: accepted ? '✅' : '❌',
    color: accepted ? 'notif-green' : 'notif-red',
    title: accepted ? 'Te aceptaron la tutoría' : 'Te negaron la tutoría',
    message: accepted
      ? `${tutorName} aceptó tu tutoría de ${subject} para el ${dateText} a las ${request.time}.`
      : `${tutorName} negó tu tutoría de ${subject} para el ${dateText} a las ${request.time}.${rejectionDetail}`,
    time: 'Ahora',
    read: false,
    userId: request.studentId || null,
    senderId: currentUser?.id || null,
    requestId: request.firebaseId || request.id
  };
  notifications.unshift(notification);
  setLS(STORAGE_KEYS.notifications, notifications);
  refreshNotifBadge();

  if (FirebaseService.ready && notification.userId) {
    FirebaseService.createNotification(notification)
      .catch(error => console.error('No se pudo crear la notificación de respuesta en Firebase:', error));
  }
}

function showConfirm(title, body, onConfirm) {
  document.getElementById('modal-title').textContent  = title;
  document.getElementById('modal-body').innerHTML     = body;
  document.getElementById('confirm-modal').style.display = 'flex';
  pendingConfirm = onConfirm;
}

document.getElementById('modal-confirm-btn').addEventListener('click', async () => {
  if (typeof pendingConfirm === 'function') {
    const shouldClose = await pendingConfirm();
    if (shouldClose === false) return;
  }
  document.getElementById('confirm-modal').style.display = 'none';
  pendingConfirm = null;
});

document.getElementById('modal-cancel-btn').addEventListener('click', () => {
  document.getElementById('confirm-modal').style.display = 'none';
  pendingConfirm = null;
});

// ══════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════

let toastTimer = null;

/**
 * Muestra un mensaje toast.
 * @param {string} msg     - Texto del mensaje
 * @param {string} type    - 'success' | 'error' | 'info' | 'warning'
 * @param {number} duration- Duración en ms (default 3500)
 */
function showToast(msg, type = 'info', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = `toast toast-${type} show`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ══════════════════════════════════════════════════
//  UTILIDADES
// ══════════════════════════════════════════════════

/** Obtiene un array del localStorage por clave */
function getLS(key) {
  return DataStore.getArray(key);
}

/** Guarda un array en la capa de datos activa */
function setLS(key, value) {
  DataStore.setArray(key, value);
}

/** Establece el texto de un elemento por ID (seguro) */
function safeSet(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function isValidUser(user) {
  return Boolean(user && user.email && user.name && (user.role === 'student' || user.role === 'tutor'));
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;

  const seedMatch = SEED_USERS.find(seed => seed.email === user.email || seed.id === user.id);
  const merged = { ...(seedMatch || {}), ...user };

  if (!merged.name && merged.email) merged.name = merged.email.split('@')[0];
  if (!merged.role) merged.role = 'student';
  if (!merged.career) merged.career = 'Sin registrar';
  if (!merged.semester) merged.semester = 1;
  if (merged.avg === undefined || merged.avg === null) merged.avg = 0;
  if (merged.rating === undefined || merged.rating === null) merged.rating = 0;

  return merged;
}

/** Formatea una fecha ISO como texto legible */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${months[parseInt(m)-1]}. ${y}`;
}

/** Devuelve el HTML del badge de estado */
function badgeStatus(status) {
  const map = {
    confirmed: '<span class="badge badge-confirmed">Confirmada</span>',
    pending:   '<span class="badge badge-pending">Pendiente</span>',
    cancelled: '<span class="badge badge-cancelled">Cancelada</span>',
    completed: '<span class="badge badge-confirmed">Completada</span>'
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

function makeSlotId(tutorId, date, time) {
  return `${tutorId}_${date}_${time}`.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function buildAvailabilityState(tutor, reserved, date, modality) {
  const seedTutor = SEED_USERS.find(user => user.id === (tutor?.id || selectedTutorId));
  const weekly = Array.isArray(tutor?.availability) && tutor.availability.length
    ? tutor.availability
    : (seedTutor?.availability || []);
  const dateObj = new Date(`${date}T00:00:00`);
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const day = dayNames[dateObj.getDay()];
  const offered = weekly.filter(slot => slot.day === day && modalityMatches(slot.modality || tutor?.modality, modality));
  const occupiedTimes = new Set(reserved.map(item => item.time));
  const offeredTimes = new Set(offered.flatMap(slot => expandSlotTimes(slot.start, slot.end)));
  const visibleTimes = new Set([...expandSlotTimes('08:00', '18:00'), ...offeredTimes, ...occupiedTimes]);
  const all = [...visibleTimes].sort().map(time => {
    const occupied = occupiedTimes.has(time);
    const available = offeredTimes.has(time) && !occupied;
    return {
      key: makeSlotId(tutor?.id || selectedTutorId, date, time),
      time,
      status: occupied ? 'occupied' : (available ? 'available' : 'unavailable'),
      label: occupied ? 'Ocupado' : (available ? 'Disponible' : 'No disponible')
    };
  });

  return { all };
}

function modalityMatches(offered, requested) {
  if (!offered || offered === 'Ambas' || offered === 'Mixta') return true;
  return offered === requested;
}

function expandSlotTimes(start, end) {
  if (!start || !end || start >= end) return [];
  const times = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let cursor = startH * 60 + startM;
  const limit = endH * 60 + endM;
  while (cursor < limit) {
    const hh = String(Math.floor(cursor / 60)).padStart(2, '0');
    const mm = String(cursor % 60).padStart(2, '0');
    times.push(`${hh}:${mm}`);
    cursor += 60;
  }
  return times;
}

function isTutoringReviewable(tutoring) {
  if (!tutoring || tutoring.reviewed) return false;
  if (tutoring.status === 'completed') return true;
  if (tutoring.status !== 'confirmed' || !tutoring.date || !tutoring.time) return false;
  return new Date(`${tutoring.date}T${tutoring.time}`) < new Date();
}

function renderStars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating || 0)));
  return Array.from({ length: 5 }, (_, idx) => `<span class="${idx < value ? 'filled' : ''}">★</span>`).join('');
}

/** Establece la fecha mínima del campo de fecha en solicitar tutoría */
function setMinDate() {
  const dateInput = document.getElementById('req-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    if (!dateInput.value) dateInput.value = dateInput.min;
  }
}

/** Alterna la visibilidad de la contraseña */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? 'Ocultar' : 'Ver';
}

// ── Permitir Enter en el formulario de login ──
document.addEventListener('keydown', e => {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  if (e.key === 'Enter') {
    if (active.id === 'screen-login')    handleLogin();
    if (active.id === 'screen-recovery') handleRecovery();
  }
});

// ── Cerrar modal con Escape ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('confirm-modal').style.display = 'none';
    pendingConfirm = null;
    closeSidebar();
  }
});

// ── Animación de shake para login ──
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeX {
    0%,100%{transform:translateX(0)}
    20%,60%{transform:translateX(-6px)}
    40%,80%{transform:translateX(6px)}
  }
`;
document.head.appendChild(shakeStyle);
