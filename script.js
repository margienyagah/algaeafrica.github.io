// ===========================================
// ALGAE AFRICA NETWORK
// script.js
// ===========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Sticky Navigation
    // ==========================================

    const header = document.querySelector("header");

    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 80);
        });
    }

    // ==========================================
    // Smooth Scroll
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

    // ==========================================
    // Fade In Animation
    // ==========================================

    const sections = document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        }, {
            threshold: 0.15
        });

        sections.forEach(section => {

            section.classList.add("hidden");

            observer.observe(section);

        });

    }

    // ==========================================
    // Homepage Counters
    // ==========================================

    document.querySelectorAll(".counter").forEach(counter => {

        const target = Number(counter.dataset.target);

        if (!target) return;

        const animate = () => {

            let value = 0;

            const increment = Math.max(1, Math.ceil(target / 100));

            const timer = setInterval(() => {

                value += increment;

                if (value >= target) {

                    value = target;

                    clearInterval(timer);

                }

                counter.textContent = value + "+";

            }, 20);

        };

        const obs = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting) {

                animate();

                obs.disconnect();

            }

        });

        obs.observe(counter);

    });

    // ==========================================
    // Current Year
    // ==========================================

    const year = document.getElementById("year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

    // ==========================================
    // Mobile Navigation
    // ==========================================

    const menuBtn = document.querySelector(".menu-toggle");

    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

        });

    }

 // ==========================================
// MEMBERS PAGE (Firebase)
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadMembers() {

    const memberCount = document.getElementById("member-count");
    const countryCount = document.getElementById("country-count");
    const institutionCount = document.getElementById("institution-count");

    const grid = document.getElementById("members-grid");

    const search = document.getElementById("member-search");

    const countryFilter = document.getElementById("country-filter");

    const institutionFilter = document.getElementById("institution-filter");

    const mapElement = document.getElementById("africaMap");

    if (!grid) return;

    const q = query(
        collection(db, "members"),
        where("approved", "==", true)
    );

    const snapshot = await getDocs(q);

    const members = [];

    snapshot.forEach(doc => {

        members.push(doc.data());

    });

    // ===========================
    // Counters
    // ===========================

    memberCount.textContent = members.length;

    countryCount.textContent =
        [...new Set(members.map(m => m.country))].length;

    institutionCount.textContent =
        [...new Set(members.map(m => m.institution).filter(Boolean))].length;

    // ===========================
    // Filters
    // ===========================

    [...new Set(members.map(m => m.country))]
        .sort()
        .forEach(country => {

            countryFilter.innerHTML +=
                `<option value="${country}">${country}</option>`;

        });

    [...new Set(members.map(m => m.institution).filter(Boolean))]
        .sort()
        .forEach(org => {

            institutionFilter.innerHTML +=
                `<option value="${org}">${org}</option>`;

        });

    // ===========================
    // Render Members
    // ===========================

    function render(data){

        grid.innerHTML="";

        data.forEach(member=>{

            grid.innerHTML +=`

            <article class="member-card">

                <h3>${member.name}</h3>

                <p><strong>${member.country}</strong></p>

                <p>${member.city || ""}</p>

                <p>${member.specialization}</p>

                <p>${member.institution || ""}</p>

                <span class="badge">${member.membership}</span>

            </article>

            `;

        });

    }

    render(members);

    // ===========================
    // Search
    // ===========================

    search.addEventListener("keyup",()=>{

        const value=search.value.toLowerCase();

        render(

            members.filter(member=>

                member.name.toLowerCase().includes(value) ||

                member.country.toLowerCase().includes(value) ||

                (member.institution||"").toLowerCase().includes(value) ||

                member.specialization.toLowerCase().includes(value)

            )

        );

    });

    // ===========================
    // Country Filter
    // ===========================

    countryFilter.addEventListener("change",()=>{

        if(countryFilter.value===""){

            render(members);

            return;

        }

        render(

            members.filter(

                m=>m.country===countryFilter.value

            )

        );

    });

    // ===========================
    // Institution Filter
    // ===========================

    institutionFilter.addEventListener("change",()=>{

        if(institutionFilter.value===""){

            render(members);

            return;

        }

        render(

            members.filter(

                m=>m.institution===institutionFilter.value

            )

        );

    });

    // ===========================
    // Leaflet Map
    // ===========================

    if(mapElement && typeof L!=="undefined"){

        const map=L.map("africaMap").setView([3,20],3);

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution:"© OpenStreetMap"

            }

        ).addTo(map);

        members.forEach(member=>{

            if(!member.lat || !member.lng) return;

            L.marker([member.lat,member.lng])

            .addTo(map)

            .bindPopup(`

                <strong>${member.name}</strong><br>

                ${member.institution || ""}<br>

                ${member.country}

            `);

        });

        setTimeout(()=>{

            map.invalidateSize();

        },300);

    }

}

loadMembers();
