// ==========================================
// Algae Africa Network (AAN)
// members-firebase.js
//
// Purpose:
// 1. Load approved members from Firebase
// 2. Keep existing members.js members
// 3. Add Firebase members automatically
// 4. Give new members website IDs 27, 28, 29...
// 5. Keep the existing website structure working
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// LOAD APPROVED FIREBASE MEMBERS
// ==========================================

async function loadApprovedMembers() {

    try {

        console.log("Loading approved AAN members from Firebase...");

        const q = query(
            collection(db, "members"),
            where("approved", "==", true)
        );

        const snapshot = await getDocs(q);

        const firebaseMembers = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            // ------------------------------------------
            // Convert Firebase record into the same
            // structure used by members.js
            // ------------------------------------------

            firebaseMembers.push({

                // Temporary Firebase reference.
                // This is NOT the website member number.
                firebaseId: doc.id,

                name: data.name || "AAN Member",

                country: data.country || "",

                city: data.city || "",

                // Your old members use "org".
                // Firebase applications use "institution".
                org: data.org || data.institution || "",

                institution: data.institution || data.org || "",

                specialization: data.specialization || "",

                membership: data.membership || "AAN Member",

                // We deliberately do not expose the
                // applicant's private email here.
                email: "",

                linkedin: data.linkedin || "",

                photo: data.photo || "images/members/default.jpg",

                lat: Number(data.lat) || 0,

                lng: Number(data.lng) || 0

            });

        });


        console.log(
            `Firebase returned ${firebaseMembers.length} approved member(s).`
        );


        // ==========================================
        // EXISTING MEMBERS FROM members.js
        // ==========================================

        const existingMembers = Array.isArray(window.members)
            ? [...window.members]
            : [];


        // ==========================================
        // PREVENT DUPLICATES
        // ==========================================
        //
        // We compare Firebase members against the
        // existing website members using name + country.
        //
        // This means if a person was already manually
        // added to members.js, Firebase won't add them
        // a second time.
        // ==========================================

        const existingKeys = new Set(

            existingMembers.map(member =>

                `${(member.name || "").trim().toLowerCase()}|` +
                `${(member.country || "").trim().toLowerCase()}`

            )

        );


        const newFirebaseMembers = firebaseMembers.filter(member => {

            const key =
                `${(member.name || "").trim().toLowerCase()}|` +
                `${(member.country || "").trim().toLowerCase()}`;

            return !existingKeys.has(key);

        });


        // ==========================================
        // START NEW MEMBER NUMBERS
        // ==========================================
        //
        // Your current website has members numbered
        // 1–26.
        //
        // We continue from the highest existing ID.
        //
        // 26 → next Firebase member becomes 27
        // 27 → next becomes 28
        // ==========================================

        let nextId = existingMembers.reduce(

            (highest, member) => {

                const id = Number(member.id);

                return Number.isFinite(id)
                    ? Math.max(highest, id)
                    : highest;

            },

            0

        ) + 1;


        // ==========================================
        // ASSIGN WEBSITE IDs
        // ==========================================

        newFirebaseMembers.forEach(member => {

            member.id = nextId;

            nextId++;

        });


        // ==========================================
        // COMBINE OLD + NEW MEMBERS
        // ==========================================

        const combinedMembers = [

            ...existingMembers,

            ...newFirebaseMembers

        ];


        // ==========================================
        // UPDATE GLOBAL MEMBER DATABASE
        // ==========================================

        window.members = combinedMembers;


        // Keep this available for debugging if needed.
        window.approvedApplications = firebaseMembers;


        console.log(
            `AAN website member database now contains ${combinedMembers.length} members.`
        );


        console.log(
            "New Firebase members added:",
            newFirebaseMembers
        );


        // ==========================================
        // TELL script.js THAT THE MEMBER DATABASE
        // IS READY
        // ==========================================

        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );


    } catch (error) {

        console.error(
            "Error loading approved members from Firebase:",
            error
        );


        // ==========================================
        // IMPORTANT:
        //
        // If Firebase fails, the existing members.js
        // members remain available.
        //
        // This prevents the website from becoming
        // empty simply because Firebase is temporarily
        // unavailable.
        // ==========================================

        if (!Array.isArray(window.members)) {

            window.members = [];

        }


        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );

    }

}


// ==========================================
// START
// ==========================================

loadApprovedMembers();
