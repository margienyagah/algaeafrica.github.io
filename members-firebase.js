// ==========================================
// Algae Africa Network
// Public Approved Members Loader
// ==========================================
//
// IMPORTANT:
// This file reads ONLY publicMembers.
// It does NOT read the private members collection.
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// Load Public Approved Members
// ==========================================

async function loadApprovedMembers() {

    console.log("Loading approved AAN members from publicMembers...");

    try {

        const snapshot = await getDocs(
            collection(db, "publicMembers")
        );

        console.log(
            "Public approved members found:",
            snapshot.size
        );


        // ------------------------------------------
        // Existing static AAN members
        // ------------------------------------------

        const existingMembers =
            Array.isArray(window.members)
                ? window.members
                : [];


        // ------------------------------------------
        // Find next website ID
        // ------------------------------------------

        let highestId = existingMembers.reduce(

            (highest, member) => {

                const id = Number(member.id);

                return Number.isFinite(id)
                    ? Math.max(highest, id)
                    : highest;

            },

            0

        );


        // ------------------------------------------
        // Convert Firebase public members
        // ------------------------------------------

        const firebaseMembers = [];


        snapshot.forEach((firebaseDoc) => {

            const data = firebaseDoc.data();

            highestId++;


            firebaseMembers.push({

                // IMPORTANT:
                // Website numbering continues from 26.
                // Firebase document ID remains internal.

                id: highestId,

                name: data.name || "AAN Member",

                country: data.country || "",

                city: data.city || "",

                org: data.institution || "",

                institution: data.institution || "",

                specialization: data.specialization || "",

                membership: data.membership || "",

                // Never expose private email addresses
                email: "",

                linkedin: data.linkedin || "",

                photo: data.photo || "",

                lat: data.lat ?? null,

                lng: data.lng ?? null

            });

        });


        // ------------------------------------------
        // Combine existing + Firebase members
        // ------------------------------------------

        window.members = [

            ...existingMembers,

            ...firebaseMembers

        ];


        // ------------------------------------------
        // Keep compatibility with existing code
        // ------------------------------------------

        window.approvedApplications = firebaseMembers;


        console.log(

            "AAN total website members:",

            window.members.length

        );


        // ------------------------------------------
        // Tell script.js that members are ready
        // ------------------------------------------

        document.dispatchEvent(

            new CustomEvent("membersLoaded")

        );

    }

    catch (error) {

        console.error(

            "Error loading public AAN members from Firebase:",

            error

        );


        // ------------------------------------------
        // IMPORTANT:
        // If Firebase fails, don't destroy the
        // existing 26-member website.
        // ------------------------------------------

        if (!Array.isArray(window.members)) {

            window.members = [];

        }


        document.dispatchEvent(

            new CustomEvent("membersLoaded")

        );

    }

}


// ==========================================
// Start
// ==========================================

loadApprovedMembers();
