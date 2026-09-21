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

            header.classList.toggle(
                "scrolled",
                window.scrollY > 80
            );

        });

    }


    // ==========================================
    // Smooth Scroll
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target =
                document.querySelector(
                    this.getAttribute("href")
                );

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

    const sections =
        document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(entries => {

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

    document
        .querySelectorAll(".counter")
        .forEach(counter => {

            const target =
                Number(counter.dataset.target);

            if (!target) return;


            const animate = () => {

                let value = 0;

                const increment =
                    Math.max(
                        1,
                        Math.ceil(target / 100)
                    );


                const timer =
                    setInterval(() => {

                        value += increment;


                        if (value >= target) {

                            value = target;

                            clearInterval(timer);

                        }


                        counter.textContent =
                            value + "+";

                    }, 20);

            };


            const obs =
                new IntersectionObserver(entries => {

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

    const year =
        document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    // ==========================================
    // Mobile Navigation
    // ==========================================

    const menuBtn =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

        });

    }


    // ==========================================
    // MEMBERS PAGE
    //
    // IMPORTANT:
    //
    // members-firebase.js loads approved Firebase
    // members and then dispatches:
    //
    // "membersLoaded"
    //
    // We wait for that event before building
    // the directory.
    // ==========================================

    document.addEventListener(
        "membersLoaded",
        initializeMembersPage
    );


    function initializeMembersPage() {


        // ==========================================
        // GET COMBINED MEMBER DATABASE
        // ==========================================

        const members =
            Array.isArray(window.members)
                ? window.members
                : [];


        console.log(
            `Initializing Members page with ${members.length} members.`
        );


        // ==========================================
        // PAGE ELEMENTS
        // ==========================================

        const memberCount =
            document.getElementById("member-count");

        const countryCount =
            document.getElementById("country-count");

        const institutionCount =
            document.getElementById("institution-count");

        const grid =
            document.getElementById("members-grid");

        const search =
            document.getElementById("member-search");

        const countryFilter =
            document.getElementById("country-filter");

        const institutionFilter =
            document.getElementById(
                "institution-filter"
            );


        // ==========================================
        // COUNTERS
        // ==========================================

        if (memberCount) {

            memberCount.textContent =
                members.length;

        }


        if (countryCount) {

            const countries =
                new Set(

                    members

                        .map(member =>
                            (member.country || "").trim()
                        )

                        .filter(Boolean)

                );


            countryCount.textContent =
                countries.size;

        }


        if (institutionCount) {

            const institutions =
                new Set(

                    members

                        .map(member =>
                            (
                                member.org ||
                                member.institution ||
                                ""
                            ).trim()
                        )

                        .filter(Boolean)

                );


            institutionCount.textContent =
                institutions.size;

        }


        // ==========================================
        // COUNTRY FILTER
        // ==========================================

        if (countryFilter) {

            countryFilter.innerHTML =
                `<option value="">All Countries</option>`;


            const countries =
                new Set(

                    members

                        .map(member =>
                            (member.country || "").trim()
                        )

                        .filter(Boolean)

                );


            [...countries]

                .sort()

                .forEach(country => {

                    countryFilter.innerHTML +=
                        `
                        <option value="${country}">
                            ${country}
                        </option>
                        `;

                });

        }


        // ==========================================
        // INSTITUTION FILTER
        // ==========================================

        if (institutionFilter) {

            institutionFilter.innerHTML =
                `<option value="">All Institutions</option>`;


            const institutions =
                new Set(

                    members

                        .map(member =>
                            (
                                member.org ||
                                member.institution ||
                                ""
                            ).trim()
                        )

                        .filter(Boolean)

                );


            [...institutions]

                .sort()

                .forEach(institution => {

                    institutionFilter.innerHTML +=
                        `
                        <option value="${institution}">
                            ${institution}
                        </option>
                        `;

                });

        }


        // ==========================================
        // MEMBER CARDS
        // ==========================================

        function renderMembers(data) {

            if (!grid) return;


            grid.innerHTML = "";


            data.forEach(member => {


                const organization =
                    member.org ||
                    member.institution ||
                    "Independent Researcher";


                grid.innerHTML +=
                    `

                    <article class="member-card">

                        <h3>
                            ${member.name || ""}
                        </h3>

                        <p>
                            <strong>
                                ${member.country || ""}
                            </strong>
                        </p>

                        <p>
                            ${member.city || ""}
                        </p>

                        <p>
                            ${member.specialization || ""}
                        </p>

                        <p>
                            ${organization}
                        </p>

                        <span class="badge">
                            ${member.membership || "AAN Member"}
                        </span>

                    </article>

                    `;

            });

        }


        // ==========================================
        // INITIAL MEMBER DISPLAY
        // ==========================================

        renderMembers(members);


        // ==========================================
        // SEARCH
        // ==========================================

        if (search) {

            search.addEventListener(
                "keyup",
                () => {

                    const value =
                        search.value
                            .toLowerCase()
                            .trim();


                    const filtered =
                        members.filter(member => {


                            const name =
                                (
                                    member.name || ""
                                ).toLowerCase();


                            const country =
                                (
                                    member.country || ""
                                ).toLowerCase();


                            const specialization =
                                (
                                    member.specialization || ""
                                ).toLowerCase();


                            const organization =
                                (
                                    member.org ||
                                    member.institution ||
                                    ""
                                ).toLowerCase();


                            return (

                                name.includes(value) ||

                                country.includes(value) ||

                                specialization.includes(value) ||

                                organization.includes(value)

                            );

                        });


                    renderMembers(filtered);

                }
            );

        }


        // ==========================================
        // COUNTRY FILTER
        // ==========================================

        if (countryFilter) {

            countryFilter.addEventListener(
                "change",
                () => {

                    const value =
                        countryFilter.value;


                    if (value === "") {

                        renderMembers(members);

                        return;

                    }


                    renderMembers(

                        members.filter(
                            member =>
                                member.country === value
                        )

                    );

                }
            );

        }


        // ==========================================
        // INSTITUTION FILTER
        // ==========================================

        if (institutionFilter) {

            institutionFilter.addEventListener(
                "change",
                () => {

                    const value =
                        institutionFilter.value;


                    if (value === "") {

                        renderMembers(members);

                        return;

                    }


                    renderMembers(

                        members.filter(member => {

                            const institution =
                                member.org ||
                                member.institution ||
                                "";


                            return institution === value;

                        })

                    );

                }
            );

        }


        // ==========================================
        // LEAFLET MAP
        // ==========================================

        const mapElement =
            document.getElementById("africaMap");


        if (
            mapElement &&
            typeof L !== "undefined"
        ) {


            const map =
                L.map("africaMap")
                    .setView(
                        [2, 20],
                        3
                    );


            L.tileLayer(

                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

                {

                    attribution:
                        "&copy; OpenStreetMap contributors"

                }

            ).addTo(map);


            members.forEach(member => {


                const lat =
                    Number(member.lat);

                const lng =
                    Number(member.lng);


                if (
                    !Number.isFinite(lat) ||
                    !Number.isFinite(lng) ||
                    lat === 0 && lng === 0
                ) {

                    return;

                }


                const organization =
                    member.org ||
                    member.institution ||
                    "";


                L.marker([lat, lng])

                    .addTo(map)

                    .bindPopup(

                        `
                        <strong>
                            ${member.name || ""}
                        </strong>
                        <br>

                        ${organization}
                        <br>

                        ${member.city || ""},
                        ${member.country || ""}
                        <br>

                        ${member.specialization || ""}
                        `

                    );

            });


            setTimeout(() => {

                map.invalidateSize();

            }, 500);

        }

    }

});
