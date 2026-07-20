// ==========================================
// Algae Africa Network
// contact.js
// Save Contact Messages to Firebase
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = form.querySelector("button");

        button.disabled = true;
        button.textContent = "Sending...";

        try {

            await addDoc(collection(db, "contacts"), {

                name: form.name.value,

                email: form.email.value,

                organization: form.organization.value,

                subject: form.subject.value,

                message: form.message.value,

                status: "Unread",

                created: serverTimestamp()

            });

            document.getElementById("contact-success").style.display = "block";

            form.reset();

            form.style.display = "none";

        }

        catch (error) {

            console.error(error);

            alert("Something went wrong. Please try again.");

        }

        finally {

            button.disabled = false;
            button.textContent = "Send Message";

        }

    });

}
