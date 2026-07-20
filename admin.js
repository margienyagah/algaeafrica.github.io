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
    deleteDoc,
    doc,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// HTML Elements
// ==========================================

const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const applications = document.getElementById("applications");


// ==========================================
// Login
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("adminEmail").value;
        const password = document.getElementById("adminPassword").value;

        try {

            await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {

            alert("Login failed.\n\n" + error.message);

        }

    });

}


// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginForm.style.display = "none";
        dashboard.style.display = "block";

        loadApplications();

    } else {

        loginForm.style.display = "block";
        dashboard.style.display = "none";

    }

});


// ==========================================
// Load Pending Applications
// ==========================================

async function loadApplications() {

    applications.innerHTML = "<p>Loading applications...</p>";

    try {

        const q = query(

            collection(db, "members"),

            where("approved", "==", false),

            orderBy("created", "desc")

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            applications.innerHTML = `

                <div class="card">

                    <h3>No Pending Applications</h3>

                    <p>All membership requests have been processed.</p>

                </div>

            `;

            return;

        }

        applications.innerHTML = "";

        snapshot.forEach((memberDoc) => {

            const member = memberDoc.data();

            const created = member.created?.toDate
                ? member.created.toDate().toLocaleDateString()
                : "Unknown";

            applications.innerHTML += `

                <div class="member-card">

                    <h3>${member.name}</h3>

                    <p><strong>Email:</strong> ${member.email}</p>

                    <p><strong>Institution:</strong> ${member.institution}</p>

                    <p><strong>Country:</strong> ${member.country}</p>

                    <p><strong>City:</strong> ${member.city || "-"}</p>

                    <p><strong>Position:</strong> ${member.position || "-"}</p>

                    <p><strong>Specialization:</strong> ${member.specialization}</p>

                    <p><strong>Membership:</strong> ${member.membership}</p>

                    <p><strong>Submitted:</strong> ${created}</p>

                    <div class="admin-buttons">

                        <button
                            class="approve-btn"
                            onclick="approveMember('${memberDoc.id}')">

                            ✅ Approve

                        </button>

                        <button
                            class="reject-btn"
                            onclick="rejectMember('${memberDoc.id}')">

                            ❌ Reject

                        </button>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

        applications.innerHTML = "<p>Unable to load applications.</p>";

    }

}


// ==========================================
// Approve Member
// ==========================================

window.approveMember = async function(id) {

    try {

        await updateDoc(doc(db, "members", id), {

            approved: true,
            status: "Approved"

        });

        alert("Member approved successfully.");

        loadApplications();

    }

    catch(error){

        console.error(error);

        alert("Approval failed.");

    }

};


// ==========================================
// Reject Member
// ==========================================

window.rejectMember = async function(id) {

    const confirmReject = confirm(

        "Reject this application?\n\nThis will permanently remove it."

    );

    if(!confirmReject) return;

    try{

        await deleteDoc(doc(db,"members",id));

        alert("Application rejected.");

        loadApplications();

    }

    catch(error){

        console.error(error);

        alert("Unable to reject application.");

    }

};


// ==========================================
// Logout
// ==========================================

window.logoutAdmin = async function(){

    await signOut(auth);

};
