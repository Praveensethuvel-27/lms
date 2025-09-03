// Sample course data (same as in courses.js for simplicity; in a real app, fetch from API)
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

// Get course ID from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const courseId = parseInt(urlParams.get("id"));

// Find the course by ID
const course = courses.find(c => c.id === courseId);

// DOM elements
const courseTitleEl = document.getElementById("course-title");
const courseDescriptionEl = document.getElementById("course-description");
const courseImageEl = document.getElementById("course-image");
const courseStudentsEl = document.getElementById("course-students");
const courseDurationEl = document.getElementById("course-duration");
const courseDifficultyEl = document.getElementById("course-difficulty");
const courseCategoryEl = document.getElementById("course-category");

// Render course details
function renderCourseDetails() {
  if (!course) {
    courseTitleEl.textContent = "Course Not Found";
    courseDescriptionEl.textContent = "The course you are looking for does not exist.";
    courseImageEl.style.display = "none";
    courseStudentsEl.textContent = "";
    courseDurationEl.textContent = "";
    courseDifficultyEl.textContent = "";
    courseCategoryEl.textContent = "";
    return;
  }

  courseTitleEl.textContent = course.title;
  courseDescriptionEl.textContent = course.description;
  courseImageEl.src = course.image;
  courseImageEl.alt = `${course.title} course image`;
  courseStudentsEl.textContent = `Students: ${course.students}`;
  courseDurationEl.textContent = `Duration: ${course.duration}`;
  courseDifficultyEl.textContent = `Difficulty: ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}`;
  courseCategoryEl.textContent = `Category: ${course.category.charAt(0).toUpperCase() + course.category.slice(1)}`;
}

// Responsive menu toggle (reused from courses.js)
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");
});

// Initialize
renderCourseDetails();