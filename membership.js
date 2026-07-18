// ==========================================
// Algae Africa Network (AAN)
// membership.js
// Submit membership applications to Firebase
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

                name: membershipForm.fullname.value.trim(),

                email: membershipForm.email.value.trim(),

                institution: membershipForm.institution.value.trim(),

                position: membershipForm.position.value.trim(),

                country: membershipForm.country.value.trim(),

                city: membershipForm.city.value.trim(),

                specialization: membershipForm.specialization.value.trim(),

                membership: membershipForm.membership.value,

                bio: membershipForm.bio.value.trim(),

                status: "Pending",

                approved: false,

                created: serverTimestamp()

            });

            // Show success message
            const success = document.getElementById("membership-success");

            if (success) {
                success.style.display = "block";
            }

            alert(
                "Thank you for applying to join the Algae Africa Network.\n\nYour application has been submitted successfully and is awaiting approval from the AAN Secretariat."
            );

            membershipForm.reset();

        } catch (error) {

            console.error("Membership submission error:", error);

            alert(
                "Sorry, something went wrong while submitting your application.\nPlease try again."
            );

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Membership Application";

        }

    });

}
