// ===========================================
// ALGAE AFRICA NETWORK
// script.js
// ===========================================

// ---------- Sticky Navigation ----------

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// ---------- Smooth Scroll ----------

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

// ---------- Fade-in Animation ----------

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

document.querySelectorAll("section").forEach(section=>{

    section.classList.add("hidden");

    observer.observe(section);

});

// ---------- Animated Counters ----------

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter = entry.target;

const target = +counter.dataset.target;

let count = 0;

const speed = target / 100;

const updateCounter = () =>{

count += speed;

if(count < target){

counter.innerText = Math.ceil(count);

requestAnimationFrame(updateCounter);

}else{

counter.innerText = target + "+";

}

};

updateCounter();

counterObserver.unobserve(counter);

}

});

});

counters.forEach(counter=>{

counterObserver.observe(counter);

});

// ---------- Current Year ----------

const year = document.getElementById("year");

if(year){

year.textContent = new Date().getFullYear();

}

// ---------- Mobile Navigation (Future Ready) ----------

const menuBtn = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});
    // ===========================================
// MEMBERS PAGE
// ===========================================

if (typeof window.members !== "undefined") {

    const memberCount = document.getElementById("member-count");
    const countryCount = document.getElementById("country-count");
    const institutionCount = document.getElementById("institution-count");

    const membersGrid = document.getElementById("members-grid");

    const searchInput = document.getElementById("member-search");

    const countryFilter = document.getElementById("country-filter");

    const institutionFilter = document.getElementById("institution-filter");

    let filteredMembers = [...window.members];

    // ===============================
    // Update Counters
    // ===============================

    function updateCounters() {

        if (memberCount)
            memberCount.textContent = window.members.length;

        if (countryCount) {

            const countries = [...new Set(window.members.map(m => m.country))];

            countryCount.textContent = countries.length;
        }

        if (institutionCount) {

            const institutions = [...new Set(window.members.map(m => m.org).filter(Boolean))];

            institutionCount.textContent = institutions.length;
        }

    }

    updateCounters();

    // ===============================
    // Populate Filters
    // ===============================

    function populateFilters() {

        if (countryFilter) {

            [...new Set(window.members.map(m => m.country))]
                .sort()
                .forEach(country => {

                    countryFilter.innerHTML +=
                        `<option value="${country}">${country}</option>`;

                });

        }

        if (institutionFilter) {

            [...new Set(window.members.map(m => m.org).filter(Boolean))]
                .sort()
                .forEach(org => {

                    institutionFilter.innerHTML +=
                        `<option value="${org}">${org}</option>`;

                });

        }

    }

    populateFilters();

    // ===============================
    // Render Members
    // ===============================

    function renderMembers(data) {

        if (!membersGrid) return;

        membersGrid.innerHTML = "";

        data.forEach(member => {

            membersGrid.innerHTML += `

            <div class="member-card">

                <h3>${member.name}</h3>

                <p><strong>${member.country}</strong></p>

                <p>${member.city}</p>

                <p>${member.specialization}</p>

                <p>${member.org || "Independent"}</p>

                <p>${member.membership}</p>

            </div>

            `;

        });

    }

    renderMembers(window.members);

    // ===============================
    // Search
    // ===============================

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value = searchInput.value.toLowerCase();

            filteredMembers = window.members.filter(member =>

                member.name.toLowerCase().includes(value) ||

                member.country.toLowerCase().includes(value) ||

                member.city.toLowerCase().includes(value) ||

                member.specialization.toLowerCase().includes(value) ||

                member.org.toLowerCase().includes(value)

            );

            renderMembers(filteredMembers);

        });

    }

    // ===============================
    // Country Filter
    // ===============================

    if (countryFilter) {

        countryFilter.addEventListener("change", () => {

            const country = countryFilter.value;

            if (country === "") {

                renderMembers(window.members);

            } else {

                renderMembers(window.members.filter(m => m.country === country));

            }

        });

    }

    // ===============================
    // Institution Filter
    // ===============================

    if (institutionFilter) {

        institutionFilter.addEventListener("change", () => {

            const org = institutionFilter.value;

            if (org === "") {

                renderMembers(window.members);

            } else {

                renderMembers(window.members.filter(m => m.org === org));

            }

        });

    }

    // ===============================
    // Leaflet Map
    // ===============================

    if (document.getElementById("africaMap") && typeof L !== "undefined") {

        const map = L.map("africaMap").setView([3, 20], 3);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

            attribution: "&copy; OpenStreetMap contributors"

        }).addTo(map);

        window.members.forEach(member => {

            if (member.lat && member.lng) {

                L.marker([member.lat, member.lng])

                    .addTo(map)

                    .bindPopup(`
                        <strong>${member.name}</strong><br>
                        ${member.org || "Independent"}<br>
                        ${member.city}, ${member.country}<br>
                        ${member.specialization}
                    `);

            }

        });

    }

}
}
