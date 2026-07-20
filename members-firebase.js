// ==========================================
// Algae Africa Network
// members-firebase.js
// Loads approved members from Firebase
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadMembers() {

    try {

        const q = query(

            collection(db, "members"),

            where("approved", "==", true)

        );

        const snapshot = await getDocs(q);

        const members = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            members.push({

                id: doc.id,

                name: data.name || "",

                country: data.country || "",

                city: data.city || "",

                specialization: data.specialization || "",

                org: data.institution || "",

                membership: data.membership || "",

                email: data.email || "",

                lat: Number(data.lat) || null,

                lng: Number(data.lng) || null

            });

        });

        // Make available to script.js
        window.members = members;

        // Trigger an event so script.js knows data is ready
        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );

        console.log(
            "Loaded",
            members.length,
            "approved members from Firebase."
        );

    }

    catch (error) {

        console.error("Error loading members:", error);

    }

}

loadMembers();
