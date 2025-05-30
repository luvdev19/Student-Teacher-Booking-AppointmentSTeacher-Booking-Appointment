import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBq46naDEGOMX_8psHUCyE14eZKFiOi5k",
  authDomain: "student-3ff50.firebaseapp.com",
  projectId: "student-3ff50",
  storageBucket: "student-3ff50.firebasestorage.app",
  messagingSenderId: "117896468121",
  appId: "1:117896468121:web:25885acc15551edfe54a08"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function addOrUpdateTeacher() {
  const id = document.getElementById("teacherId").value;
  const name = document.getElementById("teacherName").value;
  const dept = document.getElementById("teacherDept").value;
  const subject = document.getElementById("teacherSubject").value;
  const email = document.getElementById("teacherEmail").value;

  if (id) {
    await setDoc(doc(db, "teachers", id), { name, dept, subject, email });
  } else {
    await addDoc(collection(db, "teachers"), { name, dept, subject, email });
  }

  clearForm();
  loadTeachers();
}

function clearForm() {
  document.getElementById("teacherId").value = "";
  document.getElementById("teacherName").value = "";
  document.getElementById("teacherDept").value = "";
  document.getElementById("teacherSubject").value = "";
  document.getElementById("teacherEmail").value = "";
}

async function loadTeachers() {
  const snapshot = await getDocs(collection(db, "teachers"));
  const table = document.querySelector("#teacherTable tbody");
  table.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.dept}</td>
      <td>${data.subject}</td>
      <td>${data.email}</td>
      <td>
        <button onclick="editTeacher('${docSnap.id}', '${data.name}', '${data.dept}', '${data.subject}', '${data.email}')">Edit</button>
        <button onclick="deleteTeacher('${docSnap.id}')">Delete</button>
      </td>`;
    table.appendChild(row);
  });
}

window.editTeacher = (id, name, dept, subject, email) => {
  document.getElementById("teacherId").value = id;
  document.getElementById("teacherName").value = name;
  document.getElementById("teacherDept").value = dept;
  document.getElementById("teacherSubject").value = subject;
  document.getElementById("teacherEmail").value = email;
};

window.deleteTeacher = async (id) => {
  await deleteDoc(doc(db, "teachers", id));
  loadTeachers();
};

async function loadPendingStudents() {
  const snapshot = await getDocs(collection(db, "users"));
  const table = document.querySelector("#studentTable tbody");
  table.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.role === "student" && data.approved !== true) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.email}</td>
        <td><button onclick="approveStudent('${docSnap.id}')">Approve</button></td>`;
      table.appendChild(row);
    }
  });
}

window.approveStudent = async (id) => {
  await updateDoc(doc(db, "users", id), { approved: true });
  loadPendingStudents();
};

loadTeachers();
loadPendingStudents();
