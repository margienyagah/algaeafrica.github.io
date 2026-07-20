// ==========================================
// Algae Africa Network (AAN)
// members-firebase.js
// Firebase Approval Checker
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadApprovedMembers() {

    try {

        const q = query(
            collection(db, "members"),
            where("approved", "==", true)
        );

        const snapshot = await getDocs(q);

        const approvedMembers = [];

        snapshot.forEach(doc => {

            approvedMembers.push({

                id: doc.id,

                ...doc.data()

            });

        });

        console.log(
            "Approved applications:",
            approvedMembers
        );

        // Don't overwrite window.members
        window.approvedApplications = approvedMembers;

    }

    catch(error){

        console.error(error);

    }

}

loadApprovedMembers();
