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
        // IMPORTANT:
        // The Firestore collection is named exactly:
        // publicmembers
        const snapshot = await getDocs(
            collection(db, "publicmembers")
        );

        console.log(
            "Public approved members found:",
            snapshot.size
        );

        // Keep all existing members from members.js
        const existingMembers = Array.isArray(window.members)
            ? window.members
            : [];

        // Find the highest existing website ID.
        // Existing members 1–26 remain unchanged.
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

            // Your Firestore coordinates field is a GeoPoint.
            // Convert it to the lat/lng format used by the website map.
            const latitude =
                data.coordinates?.latitude ??
                data.lat ??
                null;

            const longitude =
                data.coordinates?.longitude ??
                data.lng ??
                null;

            firebaseMembers.push({
                // Website ID: 27, 28, 29...
                // NOT the Firebase document ID.
                id: highestId,

                name: data.name || "AAN Member",

                country: data.country || "",

                city: data.city || "",

                // The website uses org/institution.
                org: data.institution || "",

                institution: data.institution || "",

                specialization: data.specialization || "",

                membership: data.membership || "",

                // Email is intentionally NOT loaded.
                // Keep private member email data out of the public collection.
                email: "",

                linkedin: data.linkedin || "",

                photo: data.photo || "images/members/default.jpg",

                // Converted from Firestore GeoPoint
                lat: latitude,
                lng: longitude
            });
        });

        // Add Firebase public members to the existing 26 members.
        window.members = [
            ...existingMembers,
            ...firebaseMembers
        ];

        // Keep a separate reference if other website code needs it.
        window.approvedApplications = firebaseMembers;

        console.log(
            "Firebase public members added:",
            firebaseMembers.length
        );

        console.log(
            "AAN total website members:",
            window.members.length
        );

        // Tell script.js that the complete member list is ready.
        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );

    } catch (error) {
        console.error(
            "Error loading public AAN members from Firebase:",
            error
        );

        // Keep the original 26 members working
        // even if Firebase temporarily fails.
        if (!Array.isArray(window.members)) {
            window.members = [];
        }

        document.dispatchEvent(
            new CustomEvent("membersLoaded")
        );
    }
}

loadApprovedMembers();


// ==========================================
// Start
// ==========================================

loadApprovedMembers();
