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
    // MEMBERS PAGE
    // ==========================================

   document.addEventListener("membersLoaded", () => {

    const members = window.members;

    // EVERYTHING BELOW stays exactly the same
    // Counters
    // Filters
    // Search
    // Member cards
    // Leaflet map

});

    const memberCount = document.getElementById("member-count");
    const countryCount = document.getElementById("country-count");
    const institutionCount = document.getElementById("institution-count");

    const grid = document.getElementById("members-grid");

    const search = document.getElementById("member-search");

    const countryFilter = document.getElementById("country-filter");

    const institutionFilter = document.getElementById("institution-filter");

    // ==========================================
    // Counters
    // ==========================================

    if (memberCount)
        memberCount.textContent = members.length;

    if (countryCount) {

        countryCount.textContent =
            [...new Set(members.map(m => m.country))].length;

    }

    if (institutionCount) {

        institutionCount.textContent =
            [...new Set(members.map(m => m.org).filter(Boolean))].length;

    }

    // ==========================================
    // Filters
    // ==========================================

    if (countryFilter) {

        [...new Set(members.map(m => m.country))]
            .sort()
            .forEach(country => {

                countryFilter.innerHTML +=
                    `<option value="${country}">${country}</option>`;

            });

    }

    if (institutionFilter) {

        [...new Set(members.map(m => m.org).filter(Boolean))]
            .sort()
            .forEach(org => {

                institutionFilter.innerHTML +=
                    `<option value="${org}">${org}</option>`;

            });

    }

    // ==========================================
    // Member Cards
    // ==========================================

    function renderMembers(data) {

        if (!grid) return;

        grid.innerHTML = "";

        data.forEach(member => {

            grid.innerHTML += `

            <article class="member-card">

                <h3>${member.name}</h3>

                <p><strong>${member.country}</strong></p>

                <p>${member.city}</p>

                <p>${member.specialization}</p>

                <p>${member.org || "Independent Researcher"}</p>

                <span class="badge">
                    ${member.membership}
                </span>

            </article>

            `;

        });

    }

    renderMembers(members);

    // ==========================================
    // Search
    // ==========================================

    if (search) {

        search.addEventListener("keyup", () => {

            const value = search.value.toLowerCase();

            const filtered = members.filter(member =>

                member.name.toLowerCase().includes(value) ||

                member.country.toLowerCase().includes(value) ||

                member.specialization.toLowerCase().includes(value) ||

                (member.org || "").toLowerCase().includes(value)

            );

            renderMembers(filtered);

        });

    }

    // ==========================================
    // Country Filter
    // ==========================================

    if (countryFilter) {

        countryFilter.addEventListener("change", () => {

            const value = countryFilter.value;

            if (value === "") {

                renderMembers(members);

                return;

            }

            renderMembers(

                members.filter(member => member.country === value)

            );

        });

    }

    // ==========================================
    // Institution Filter
    // ==========================================

    if (institutionFilter) {

        institutionFilter.addEventListener("change", () => {

            const value = institutionFilter.value;

            if (value === "") {

                renderMembers(members);

                return;

            }

            renderMembers(

                members.filter(member => member.org === value)

            );

        });

    }

    // ==========================================
    // Leaflet Map
    // ==========================================

    const mapElement = document.getElementById("africaMap");

    if (mapElement && typeof L !== "undefined") {

        const map = L.map("africaMap").setView([2, 20], 3);

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution:
                    "&copy; OpenStreetMap contributors"

            }

        ).addTo(map);

        members.forEach(member => {

            if (!member.lat || !member.lng) return;

            L.marker([member.lat, member.lng])

                .addTo(map)

                .bindPopup(

                    `
                    <strong>${member.name}</strong><br>
                    ${member.org || ""}<br>
                    ${member.city}, ${member.country}<br>
                    ${member.specialization}
                    `

                );

        });

        setTimeout(() => {

            map.invalidateSize();

        }, 500);

    }

});
