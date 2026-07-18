// ==========================================
// Algae Africa Network (AAN)
// admin.js
// Administrator Dashboard
// ==========================================

import { db, auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --------------------
// Elements
// --------------------

const loginForm = document.getElementById("loginForm");

const dashboard = document.getElementById("dashboard");

const applications = document.getElementById("applications");

// --------------------
// Login
// --------------------

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("adminEmail").value;

        const password = document.getElementById("adminPassword").value;

        try {

            await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {

            alert(error.message);

        }

    });

}

// --------------------
// Authentication
// --------------------

onAuthStateChanged(auth, async (user) => {

    if (user) {

        loginForm.style.display = "none";

        dashboard.style.display = "block";

        loadApplications();

    } else {

        loginForm.style.display = "block";

        dashboard.style.display = "none";

    }

});

// --------------------
// Load Pending Members
// --------------------

async function loadApplications() {

    applications.innerHTML = "Loading applications...";

    const q = query(

        collection(db, "members"),

        where("approved", "==", false)

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        applications.innerHTML = "<p>No pending applications.</p>";

        return;

    }

    applications.innerHTML = "";

    snapshot.forEach((documentData) => {

        const member = documentData.data();

        applications.innerHTML += `

        <div class="member-card">

            <h3>${member.name}</h3>

            <p><strong>${member.institution}</strong></p>

            <p>${member.country}</p>

            <p>${member.specialization}</p>

            <p>${member.membership}</p>

            <button
                class="approve-btn"
                onclick="approveMember('${documentData.id}')">

                Approve

            </button>

            <button
                class="reject-btn"
                onclick="rejectMember('${documentData.id}')">

                Reject

            </button>

        </div>

        `;

    });

}

// --------------------
// Approve Member
// --------------------

window.approveMember = async function(id) {

    await updateDoc(doc(db, "members", id), {

        approved: true,

        status: "Approved"

    });

    alert("Member approved successfully.");

    loadApplications();

};

// --------------------
// Reject Member
// --------------------

window.rejectMember = async function(id) {

    await updateDoc(doc(db, "members", id), {

        approved: false,

        status: "Rejected"

    });

    alert("Application rejected.");

    loadApplications();

};

// --------------------
// Logout (optional)
// --------------------

window.logoutAdmin = async function () {

    await signOut(auth);

};
