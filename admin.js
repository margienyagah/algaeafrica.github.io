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
    getDoc,
    updateDoc,
    setDoc,
    deleteDoc,
    doc,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


console.log("AAN ADMIN.JS LOADED SUCCESSFULLY");


// ==========================================
// HTML Elements
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const dashboard =
    document.getElementById("dashboard");

const applications =
    document.getElementById("applications");


// ==========================================
// Login
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document
                .getElementById("adminEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("adminPassword")
                .value;

        try {

            console.log("Attempting administrator login...");

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log(
                "Administrator login successful."
            );

        }

        catch (error) {

            console.error(
                "Login failed:",
                error
            );

            alert(
                "Login failed.\n\n" +
                error.message
            );

        }

    });

}


// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, (user) => {

    console.log(
        "Authentication state changed:",
        user ? user.email : "No user"
    );

    if (user) {

        loginForm.style.display = "none";

        dashboard.style.display = "block";

        loadApplications();

    }

    else {

        loginForm.style.display = "block";

        dashboard.style.display = "none";

    }

});


// ==========================================
// Load Pending Applications
// ==========================================

async function loadApplications() {

    applications.innerHTML =
        "<p>Loading applications...</p>";

    try {

        console.log(
            "Loading pending membership applications..."
        );

        const q = query(

            collection(db, "members"),

            where(
                "approved",
                "==",
                false
            ),

            orderBy(
                "created",
                "desc"
            )

        );

        const snapshot =
            await getDocs(q);

        console.log(
            "Pending applications found:",
            snapshot.size
        );


        if (snapshot.empty) {

            applications.innerHTML = `

                <div class="card">

                    <h3>
                        No Pending Applications
                    </h3>

                    <p>
                        All membership requests
                        have been processed.
                    </p>

                </div>

            `;

            return;

        }


        applications.innerHTML = "";


        snapshot.forEach((memberDoc) => {

            const member =
                memberDoc.data();

            const created =
                member.created?.toDate
                    ? member.created
                        .toDate()
                        .toLocaleDateString()
                    : "Unknown";


            applications.innerHTML += `

                <div class="member-card">

                    <h3>
                        ${member.name || "-"}
                    </h3>

                    <p>
                        <strong>Email:</strong>
                        ${member.email || "-"}
                    </p>

                    <p>
                        <strong>Institution:</strong>
                        ${member.institution || "-"}
                    </p>

                    <p>
                        <strong>Country:</strong>
                        ${member.country || "-"}
                    </p>

                    <p>
                        <strong>City:</strong>
                        ${member.city || "-"}
                    </p>

                    <p>
                        <strong>Position:</strong>
                        ${member.position || "-"}
                    </p>

                    <p>
                        <strong>Specialization:</strong>
                        ${member.specialization || "-"}
                    </p>

                    <p>
                        <strong>Membership:</strong>
                        ${member.membership || "-"}
                    </p>

                    <p>
                        <strong>Submitted:</strong>
                        ${created}
                    </p>

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

        console.error(
            "Error loading applications:",
            error
        );

        applications.innerHTML =
            "<p>Unable to load applications.</p>";

    }

}


// ==========================================
// Approve Member
// ==========================================

window.approveMember = async function(id) {

    console.log(
        "APPROVE BUTTON CLICKED. Application ID:",
        id
    );

    try {

        // ------------------------------------------
        // 1. Get private application
        // ------------------------------------------

        console.log(
            "Reading private application..."
        );

        const memberRef =
            doc(
                db,
                "members",
                id
            );

        const memberSnapshot =
            await getDoc(memberRef);


        if (!memberSnapshot.exists()) {

            console.error(
                "Application does not exist:",
                id
            );

            alert(
                "Member application could not be found."
            );

            return;

        }


        const member =
            memberSnapshot.data();


        console.log(
            "Private application found:",
            member
        );


        // ------------------------------------------
        // 2. Create safe public member object
        // ------------------------------------------

        const publicMember = {

            name:
                member.name || "",

            country:
                member.country || "",

            city:
                member.city || "",

            institution:
                member.institution || "",

            specialization:
                member.specialization || "",

            membership:
                member.membership || "",

            linkedin:
                member.linkedin || "",

            photo:
                member.photo || "",

            lat:
                member.lat ?? null,

            lng:
                member.lng ?? null

        };


        console.log(
            "PUBLIC MEMBER DATA PREPARED:",
            publicMember
        );


        // ------------------------------------------
        // 3. Create public member FIRST
        // ------------------------------------------
        //
        // IMPORTANT:
        // We create the public record BEFORE
        // marking the private application approved.
        //
        // This prevents a half-approved application
        // if public creation fails.
        // ------------------------------------------

        console.log(
            "Creating document in publicmembers..."
        );


        const publicMemberRef =
            doc(
                db,
                "publicmembers",
                id
            );


        await setDoc(
            publicMemberRef,
            publicMember
        );


        console.log(
            "PUBLIC MEMBER CREATED SUCCESSFULLY."
        );


        // ------------------------------------------
        // 4. Verify public member exists
        // ------------------------------------------

        console.log(
            "Verifying public member..."
        );


        const publicCheck =
            await getDoc(
                publicMemberRef
            );


        if (!publicCheck.exists()) {

            throw new Error(
                "The public member could not be verified after creation."
            );

        }


        console.log(
            "PUBLIC MEMBER VERIFIED SUCCESSFULLY."
        );


        // ------------------------------------------
        // 5. Update private application
        // ------------------------------------------

        console.log(
            "Updating private application..."
        );


        await updateDoc(
            memberRef,
            {
                approved: true,
                status: "Approved"
            }
        );


        console.log(
            "PRIVATE APPLICATION MARKED APPROVED."
        );


        // ------------------------------------------
        // 6. Success
        // ------------------------------------------

        alert(

            "Member approved successfully!\n\n" +

            "The member has been added to the " +

            "public AAN Members Directory."

        );


        // ------------------------------------------
        // 7. Reload applications
        // ------------------------------------------

        await loadApplications();

    }

    catch (error) {

        console.error(
            "APPROVAL ERROR:",
            error
        );

        alert(

            "Approval failed.\n\n" +

            error.message

        );

    }

};


// ==========================================
// Reject Member
// ==========================================

window.rejectMember = async function(id) {

    const confirmReject =
        confirm(

            "Reject this application?\n\n" +

            "This will permanently remove it."

        );


    if (!confirmReject) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "members",
                id
            )

        );


        alert(
            "Application rejected."
        );


        await loadApplications();

    }

    catch (error) {

        console.error(
            "Rejection error:",
            error
        );

        alert(
            "Unable to reject application."
        );

    }

};


// ==========================================
// Logout
// ==========================================

window.logoutAdmin = async function() {

    try {

        await signOut(auth);

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

};
