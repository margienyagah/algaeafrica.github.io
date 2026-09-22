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


async function loadApprovedMembers() {

    console.log("Loading approved AAN members from publicmembers...");

    try {

        const snapshot = await getDocs(
            collection(db, "publicmembers")
        );

        console.log(
            "Public approved members found:",
            snapshot.size
        );


        // Keep the original 26 members
        const existingMembers = Array.isArray(window.members)
            ? window.members
            : [];


        // Find highest existing website ID
        let highestId = existingMembers.reduce(
            (highest, member) => {

                const id = Number(member.id);

                return Number.isFinite(id)
                    ? Math.max(highest, id)
                    : highest;

            },
            0
        );


        const firebaseMembers = [];


        snapshot.forEach((firebaseDoc) => {

            const data = firebaseDoc.data();

            highestId++;


            // Read Firestore GeoPoint
            const latitude =
                data.coordinates?.latitude ??
                data.lat ??
                null;

            const longitude =
                data.coordinates?.longitude ??
                data.lng ??
                null;


            firebaseMembers.push({

                // Website ID
                id: highestId,

                name:
                    data.name || "AAN Member",

                country:
                    data.country || "",

                city:
                    data.city || "",

                org:
                    data.institution || "",

                institution:
                    data.institution || "",

                specialization:
                    data.specialization || "",

                membership:
                    data.membership || "",

                // Private email is NOT exposed
                email: "",

                linkedin:
                    data.linkedin || "",

                photo:
                    data.photo ||
                    "images/members/default.jpg",

                lat: latitude,

                lng: longitude
            });

        });


        // Combine members 1–26 with Firebase members
        window.members = [
            ...existingMembers,
            ...firebaseMembers
        ];


        window.approvedApplications =
            firebaseMembers;


        console.log(
            "Firebase public members added:",
            firebaseMembers.length
        );

        console.log(
            "AAN total website members:",
            window.members.length
        );


        // Tell script.js that the members are ready
        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );

    }

    catch (error) {

        console.error(
            "Error loading public AAN members from Firebase:",
            error
        );


        // Keep existing members working
        if (!Array.isArray(window.members)) {
            window.members = [];
        }


        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );

    }
}


// Run ONCE
loadApprovedMembers();
