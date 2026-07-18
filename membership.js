// ==========================================
// Algae Africa Network
// membership.js
// Saves membership applications to Firestore
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const membershipForm = document.getElementById("membershipForm");

if (membershipForm) {

    membershipForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitButton = membershipForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {

            await addDoc(collection(db, "members"), {

                name: membershipForm.name.value,

                email: membershipForm.email.value,

                country: membershipForm.country.value,

                city: membershipForm.city.value,

                institution: membershipForm.organization.value,

                specialization: membershipForm.specialization.value,

                membership: membershipForm.membership.value,

                status: "Pending",

                approved: false,

                created: serverTimestamp()

            });

            alert(
                "Thank you for joining the Algae Africa Network.\n\nYour application has been submitted successfully and is awaiting administrator approval."
            );

            membershipForm.reset();

        } catch (error) {

            console.error(error);

            alert(
                "There was an error submitting your application. Please try again."
            );

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Apply for Membership";

        }

    });

}
