// Responsive併
// Responsive Nav Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Sample data for courses
const courses = [
  {
    id: 1,
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming.',
    image: 'intro to js.png',
  },
  {
    id: 2,
    title: 'CSS Flexbox and Grid',
    description: 'Master modern CSS layout techniques.',
    image: 'css and grid.png',
  },
  {
    id: 3,
    title: 'Node.js and Express',
    description: 'Build backend applications using Node.js and Express.',
    image: 'node+express.png',
  },
  {
    id: 4,
    title: 'React for Beginners',
    description: 'Dive into React and build dynamic user interfaces.',
    image: 'react for brginers.png',
  },
  {
    id: 5,
    title: 'Advanced HTML5 & CSS3',
    description: 'Create beautiful and responsive web pages.',
    image: 'advance html css.jpeg',
  },
];

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    text: 'This LMS helped me land a new job!',
    author: 'Jane Doe',
  },
  {
    id: 2,
    text: 'The courses are well-structured and easy to follow.',
    author: 'John Smith',
  },
  {
    id: 3,
    text: 'Great platform for upskilling in tech.',
    author: 'Alice Johnson',
  },
];

// Dynamically create course cards
const courseList = document.getElementById('course-list');
function renderCourses(filter = '') {
  courseList.innerHTML = '';
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(filter.toLowerCase())
  );
  if (filteredCourses.length === 0) {
    courseList.innerHTML = '<p style="text-align:center; color:#ffb732;">No courses found.</p>';
    return;
  }
  filteredCourses.forEach((course) => {
    const card = document.createElement('div');
    card.classList.add('course-card');
    card.innerHTML = `
      <img src="${course.image}" alt="${course.title}" />
      <div class="course-card-content">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      alert('You clicked on ' + course.title);
    });
    courseList.appendChild(card);
  });
}

// Dynamically create testimonials
const testimonialCards = document.getElementById('testimonial-cards');
function renderTestimonials() {
  testimonials.forEach((t) => {
    const tCard = document.createElement('div');
    tCard.classList.add('testimonial-card');
    tCard.innerHTML = `
      <p>${t.text}</p>
      <footer>- ${t.author}</footer>
    `;
    testimonialCards.appendChild(tCard);
  });
}

// Initial render
renderCourses();
renderTestimonials();

// Search input filter
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {
  renderCourses(e.target.value);
});

// CTA button scroll to courses
document.querySelector('.cta-btn').addEventListener('click', () => {
  document.querySelector('.course-search').scrollIntoView({ behavior: 'smooth' });
});