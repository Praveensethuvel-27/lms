// Sample course data - in real app, fetch from API
const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript and more from scratch.",
    category: "web",
    difficulty: "beginner",
    image: "6346777_5b47_2.jpg",
    students: 1500,
    duration: "12h 30m",
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into closures, prototypes, async programming.",
    category: "web",
    difficulty: "advanced",
    image: "download.jpeg",
    students: 800,
    duration: "8h 15m",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Design beautiful and usable interfaces with practical tools.",
    category: "design",
    difficulty: "beginner",
    image: "download (2).jpeg",
    students: 1200,
    duration: "10h",
  },
  {
    id: 4,
    title: "Data Science with Python",
    description: "Analyze data and build models using Python libraries.",
    category: "data",
    difficulty: "intermediate",
    image: "download (1).jpeg",
    students: 1100,
    duration: "15h 45m",
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile apps using React Native.",
    category: "mobile",
    difficulty: "intermediate",
    image: "download (1).png",
    students: 900,
    duration: "13h 20m",
  },
  {
    id: 16,
    title: "Full Stack MERN Development",
    description: "Master MongoDB, Express, React & Node in one go.",
    category: "web",
    difficulty: "advanced",
    image: "0_kxPYwfJmkXZ3iCWy.png",
    students: 1400,
    duration: "18h 00m",
  },
  {
    id: 17,
    title: "Responsive Web Design",
    description: "Build flexible layouts using Flexbox and Grid.",
    category: "web",
    difficulty: "beginner",
    image: "download (2).jpeg",
    students: 1250,
    duration: "7h 30m",
  },
  {
    id: 18,
    title: "Python for Beginners",
    description: "Start your programming journey with Python.",
    category: "data",
    difficulty: "beginner",
    image: "download (3).jpeg",
    students: 1900,
    duration: "10h 10m",
  },
  {
    id: 19,
    title: "Building APIs with FastAPI",
    description: "Modern, high-performance APIs with Python.",
    category: "web",
    difficulty: "intermediate",
    image: "download (2).png",
    students: 800,
    duration: "6h 45m",
  },
  {
    id: 20,
    title: "SASS & SCSS Styling Mastery",
    description: "Write modular, maintainable CSS using SASS.",
    category: "design",
    difficulty: "intermediate",
    image: "download (4).jpeg",
    students: 890,
    duration: "5h 55m",
  },
  {
    id: 21,
    title: "Django Full Stack App",
    description: "Build full stack apps with Django and PostgreSQL.",
    category: "web",
    difficulty: "advanced",
    image: "download (5).jpeg",
    students: 990,
    duration: "14h 30m",
  },
  {
    id: 22,
    title: "Docker & DevOps Essentials",
    description: "Understand containers, Dockerfiles, and CI/CD basics.",
    category: "web",
    difficulty: "intermediate",
    image: "download (6).jpeg",
    students: 1150,
    duration: "9h 15m",
  },
  {
    id: 23,
    title: "Intro to Blockchain Technology",
    description: "Explore the basics of decentralized systems and crypto.",
    category: "data",
    difficulty: "beginner",
    image: "download (7).jpeg",
    students: 700,
    duration: "6h 10m",
  },
  {
    id: 24,
    title: "Vue.js Crash Course",
    description: "Build fast web interfaces using Vue and Vue Router.",
    category: "web",
    difficulty: "intermediate",
    image: "download (8).jpeg",
    students: 960,
    duration: "8h 00m",
  },
  {
    id: 25,
    title: "Java Programming for Developers",
    description: "Object-oriented Java from beginner to intermediate.",
    category: "data",
    difficulty: "intermediate",
    image: "images.jpeg",
    students: 1230,
    duration: "11h 00m",
  },
  {
    id: 26,
    title: "Next.js & Server-Side Rendering",
    description: "Create SEO-friendly React apps using Next.js.",
    category: "web",
    difficulty: "advanced",
    image: "download (9).jpeg",
    students: 980,
    duration: "10h 30m",
  },
  {
    id: 27,
    title: "Intro to TypeScript",
    description: "Make your JavaScript scalable and type-safe.",
    category: "web",
    difficulty: "beginner",
    image: "download (10).jpeg",
    students: 1050,
    duration: "6h 40m",
  },
  {
    id: 28,
    title: "Photoshop for UI Designers",
    description: "Design polished interfaces using Photoshop tools.",
    category: "design",
    difficulty: "beginner",
    image: "download (11).jpeg",
    students: 830,
    duration: "7h 20m",
  },
  {
    id: 29,
    title: "Google Cloud Platform Fundamentals",
    description: "Deploy and manage cloud services on GCP.",
    category: "web",
    difficulty: "intermediate",
    image: "download (3).png",
    students: 750,
    duration: "9h 05m",
  },
  {
    id: 30,
    title: "Ethical Hacking Essentials",
    description: "Learn white-hat techniques and ethical hacking tools.",
    category: "web",
    difficulty: "advanced",
    image: "download (12).jpeg",
    students: 580,
    duration: "10h 25m",
  }
];

// Pagination setup
const itemsPerPage = 4;
let currentPage = 1;
let filteredCourses = [...courses];

const courseListEl = document.querySelector(".course-list");
const searchInput = document.getElementById("search-courses");
const filterCategory = document.getElementById("filter-category");
const filterDifficulty = document.getElementById("filter-difficulty");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const modal = document.getElementById("course-modal");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalDescription = document.getElementById("modal-description");
const modalStudents = document.getElementById("modal-students");
const modalDuration = document.getElementById("modal-duration");
const modalDifficulty = document.getElementById("modal-difficulty");
const modalCategory = document.getElementById("modal-category");

// Render courses for current page
function renderCourses() {
  courseListEl.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  if (pageItems.length === 0) {
    courseListEl.innerHTML = `<p style="text-align:center; font-size:1.2rem; color:#ffa500;">No courses found.</p>`;
    pageInfo.textContent = `Page 0 of 0`;
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }

  pageItems.forEach((course) => {
    const card = document.createElement("article");
    card.className = "course-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${course.image}" alt="${course.title} course image" />
      <div class="course-card-content">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span>Students: ${course.students}</span>
          <span>Duration: ${course.duration}</span>
          <span>Difficulty: ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}</span>
        </div>
        <button class="enroll-button" data-course-id="${course.id}">Enroll Now</button>
      </div>
    `;
    // Add click event to the enroll button
    card.querySelector(".enroll-button").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click from triggering
      window.location.href = `login.html?courseId=${course.id}`;
    });
    // Add click event to show modal with course details (optional)
    card.addEventListener("click", () => {
      modalTitle.textContent = course.title;
      modalImage.src = course.image;
      modalImage.alt = `${course.title} course image`;
      modalDescription.textContent = course.description;
      modalStudents.textContent = `Students: ${course.students}`;
      modalDuration.textContent = `Duration: ${course.duration}`;
      modalDifficulty.textContent = `Difficulty: ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`;
      modalCategory.textContent = `Category: ${course.category.charAt(0).toUpperCase() + course.category.slice(1)}`;
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
    });
    courseListEl.appendChild(card);
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  prevPageBtn.setAttribute("aria-disabled", prevPageBtn.disabled);
  nextPageBtn.setAttribute("aria-disabled", nextPageBtn.disabled);
}

// Filter & search logic
function filterCourses() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = filterCategory.value;
  const difficulty = filterDifficulty.value;

  filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm) || course.description.toLowerCase().includes(searchTerm);
    const matchesCategory = category ? course.category === category : true;
    const matchesDifficulty = difficulty ? course.difficulty === difficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  currentPage = 1; // Reset page after filtering
  renderCourses();
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// Event listeners
searchInput.addEventListener("input", () => {
  filterCourses();
});

filterCategory.addEventListener("change", () => {
  filterCourses();
});

filterDifficulty.addEventListener("change", () => {
  filterCourses();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCourses();
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCourses();
  }
});

modalClose.addEventListener("click", closeModal);

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "flex") {
    closeModal();
  }
});

// Responsive menu toggle (reused from home)
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");
});

// Initialize
renderCourses();