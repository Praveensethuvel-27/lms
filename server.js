
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const XLSX = require('xlsx');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Enhanced request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sethuLMS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Course tasks and charges
const courseTasks = {
  1: [
    { id: 101, name: 'Responsive Webpage Layout', description: 'Create a responsive webpage layout using HTML and CSS.' },
    { id: 102, name: 'JavaScript Calculator', description: 'Build a simple calculator using JavaScript.' },
    { id: 103, name: 'API Data Fetch', description: 'Fetch data from a public API and display it.' },
    { id: 104, name: 'Form Validation', description: 'Implement form validation using JavaScript.' },
    { id: 105, name: 'Portfolio Website', description: 'Create a personal portfolio website.' }
  ],
  2: [
    { id: 201, name: 'Data Cleaning Exercise', description: 'Clean a dataset using Python.' },
    { id: 202, name: 'Exploratory Data Analysis', description: 'Perform EDA on a dataset.' },
    { id: 203, name: 'Linear Regression Model', description: 'Build a linear regression model.' },
    { id: 204, name: 'Data Visualization Dashboard', description: 'Create a dashboard with visualizations.' },
    { id: 205, name: 'K-Means Clustering', description: 'Implement K-Means clustering algorithm.' }
  ],
  3: [
    { id: 301, name: 'Classification Model', description: 'Build a classification model using scikit-learn.' },
    { id: 302, name: 'Neural Network Basics', description: 'Create a basic neural network.' },
    { id: 303, name: 'Cross-Validation Exercise', description: 'Perform cross-validation on a model.' },
    { id: 304, name: 'Hyperparameter Tuning', description: 'Tune hyperparameters for a model.' },
    { id: 305, name: 'Model Evaluation Report', description: 'Write a report evaluating model performance.' }
  ]
};

const courseCharges = {
  1: 5000, // Web Development
  2: 7000, // Data Science
  3: 8000  // Machine Learning
};

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'trainer', 'admin'] },
  studentID: { type: String, default: '' },
  attendancePercent: { type: Number, default: 0 },
  isCourseRegistered: { type: Boolean, default: false },
  courses: [{
    id: Number,
    name: String,
    assessments: [{
      id: Number,
      name: String,
      status: { type: String, enum: ['not_started', 'in_progress', 'submitted', 'completed'], default: 'not_started' },
      percentComplete: { type: Number, default: 0 },
      description: { type: String, default: '' },
      startTime: { type: Date, default: null },
      endTime: { type: Date, default: null }
    }]
  }],
  loginActivity: [{ timestamp: Date }],
  logoutActivity: [{ timestamp: Date }],
  trainerCourses: [{ id: Number, name: String }],
  payment: {
    status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
    courses: [{ id: Number, name: String, charge: Number }],
    totalCharge: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null }
  },
  adminApproval: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Username generation
function generateUsername(name, studentID) {
  const base = name.toLowerCase().replace(/\s+/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${base}${studentID.slice(-4)}${randomNum}`;
}

// Root route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'home.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('register.html not found');
  }
});

// Static file routes
app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, 'register.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('register.html not found');
  }
});

app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'login.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('login.html not found');
  }
});

app.get('/course-registration', (req, res) => {
  const filePath = path.join(__dirname, 'course-registration.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('course-registration.html not found');
  }
});

app.get('/payment', (req, res) => {
  const filePath = path.join(__dirname, 'payment.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('payment.html not found');
  }
});

app.get('/dashboard', (req, res) => {
  const filePath = path.join(__dirname, 'dashboard.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('dashboard.html not found');
  }
});

app.get('/task', (req, res) => {
  const filePath = path.join(__dirname, 'task.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('task.html not found. Ensure task.html exists in the project directory.');
  }
});

// Task details endpoint
app.get('/task-data', async (req, res) => {
  try {
    const { courseId, taskId } = req.query;
    if (!courseId || !taskId) {
      return res.status(400).json({ error: 'courseId and taskId are required' });
    }

    const courseIdNum = parseInt(courseId);
    const taskIdNum = parseInt(taskId);

    if (!courseTasks[courseIdNum]) {
      return res.status(404).json({ error: `Course with ID ${courseIdNum} not found` });
    }

    const task = courseTasks[courseIdNum].find(t => t.id === taskIdNum);
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${taskIdNum} not found in course ${courseIdNum}` });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Task fetch error:', error);
    res.status(500).json({ error: 'Server error fetching task details' });
  }
});

// Update task status endpoint
app.post('/update-task', async (req, res) => {
  try {
    const { email, courseId, taskId, status, role } = req.body;
    if (!email || !courseId || !taskId || !status) {
      return res.status(400).json({ error: 'email, courseId, taskId, and status are required' });
    }

    if (!['not_started', 'in_progress', 'submitted', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be not_started, in_progress, submitted, or completed' });
    }

    const courseIdNum = parseInt(courseId);
    const taskIdNum = parseInt(taskId);

    const user = await User.findOne({ email, role: 'student' });
    if (!user) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const course = user.courses.find(c => c.id === courseIdNum);
    if (!course) {
      return res.status(404).json({ error: `Course with ID ${courseIdNum} not found for user` });
    }

    const assessment = course.assessments.find(a => a.id === taskIdNum);
    if (!assessment) {
      return res.status(404).json({ error: `Task with ID ${taskIdNum} not found in course ${courseIdNum}` });
    }

    if (role === 'student') {
      if (assessment.status === 'completed') {
        return res.status(400).json({ error: 'Task is already completed' });
      }
      if (assessment.status === 'not_started' && status !== 'in_progress') {
        return res.status(400).json({ error: 'Task must be started before it can be submitted' });
      }
      if (assessment.status === 'in_progress' && status !== 'submitted') {
        return res.status(400).json({ error: 'Task is already in progress; next status must be submitted' });
      }
    } else if (role === 'trainer' && status !== 'completed') {
      return res.status(400).json({ error: 'Trainers can only set status to completed' });
    }

    assessment.status = status;
    if (status === 'in_progress' && !assessment.startTime) {
      assessment.startTime = new Date();
    }
    if (status === 'submitted' || status === 'completed') {
      assessment.endTime = new Date();
    }

    await user.save();

    let nextTask = null;
    let nextCourse = null;
    let allTasksCompleted = false;

    const currentIndex = course.assessments.findIndex(a => a.id === taskIdNum);
    nextTask = course.assessments[currentIndex + 1] || null;

    if (!nextTask) {
      allTasksCompleted = course.assessments.every(a => a.status === 'completed' || a.status === 'submitted');
      if (allTasksCompleted) {
        const nextCourseCandidate = user.courses.find(c => c.id > courseIdNum && c.assessments.some(a => a.status !== 'completed' && a.status !== 'submitted'));
        if (nextCourseCandidate) {
          nextCourse = {
            courseId: nextCourseCandidate.id,
            name: nextCourseCandidate.name
          };
          nextTask = nextCourseCandidate.assessments.find(a => a.status !== 'completed' && a.status !== 'submitted') || null;
          if (nextTask) {
            nextTask = { courseId: nextCourse.courseId, taskId: nextTask.id };
          }
        }
      }
    } else {
      nextTask = { courseId: courseIdNum, taskId: nextTask.id };
    }

    console.log(`Task updated for ${email}: Course ${courseIdNum}, Task ${taskIdNum}, Status: ${status}`);
    res.status(200).json({
      message: 'Task status updated successfully',
      nextTask,
      nextCourse,
      allTasksCompleted
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error updating task status' });
  }
});

// Login endpoint with attendance tracking
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Attendance tracking: increment attendancePercent once per day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const lastLogin = user.loginActivity.length > 0 ? new Date(user.loginActivity[user.loginActivity.length - 1].timestamp) : null;
    let isNewDay = true;

    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0);
      isNewDay = today > lastLogin;
    }

    if (isNewDay && user.role === 'student') {
      user.attendancePercent = Math.min(user.attendancePercent + 5, 100); // Increment by 5%, cap at 100%
      try {
        await user.save();
      } catch (saveError) {
        console.error('Error saving attendance update:', saveError);
        return res.status(500).json({ error: 'Server error updating attendance' });
      }
    }

    user.loginActivity.push({ timestamp: new Date() });
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      role: user.role,
      redirect: user.isCourseRegistered ? '/dashboard' : '/course-registration',
      attendancePercent: user.attendancePercent
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// API routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentID } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    if (role === 'student' && !studentID) {
      return res.status(400).json({ error: 'Student ID is required for students' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentID: role === 'student' ? studentID : '',
      username: role === 'student' ? generateUsername(name, studentID || `STU${Date.now()}`) : name
    });

    await user.save();
    res.status(200).json({ message: 'Registration successful', redirect: '/login' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/course-registration', async (req, res) => {
  try {
    const { email, studentID, username, courses } = req.body;
    console.log('Received data:', { email, studentID, username, courses });

    if (!email || !username || !courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: 'Please provide email, username, and select at least one course.' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    if (user.role === 'student' && !studentID) {
      return res.status(400).json({ error: 'Student ID is required for students.' });
    }

    const validCourseIds = Object.keys(courseTasks).map(Number);
    const invalidCourses = courses.filter(c => !validCourseIds.includes(c.id));
    if (invalidCourses.length > 0) {
      return res.status(400).json({ error: `Invalid course IDs: ${invalidCourses.map(c => c.id).join(', ')}` });
    }

    const paymentCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      charge: courseCharges[course.id]
    }));
    const totalCharge = paymentCourses.reduce((sum, course) => sum + course.charge, 0);

    if (user.role === 'student') {
      user.studentID = studentID;
      user.courses = courses.map(course => ({
        id: course.id,
        name: course.name,
        assessments: courseTasks[course.id].map(task => ({
          ...task,
          status: 'not_started',
          percentComplete: 0,
          startTime: null,
          endTime: null
        }))
      }));
      user.payment = {
        status: 'pending',
        courses: paymentCourses,
        totalCharge,
        paymentDate: null
      };
      user.username = generateUsername(username, studentID);
    } else if (user.role === 'trainer') {
      user.trainerCourses = courses.map(course => ({
        id: course.id,
        name: course.name
      }));
    }

    user.isCourseRegistered = true;
    await user.save();
    res.status(200).json({ message: 'Courses registered successfully', redirect: user.role === 'student' ? '/payment' : '/dashboard' });
  } catch (error) {
    console.error('Course registration error:', error);
    res.status(500).json({ error: 'Server error during course registration' });
  }
});

app.post('/payment-details', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(400).json({ error: 'Invalid user or role' });
    }

    if (!user.payment || user.payment.status !== 'pending') {
      return res.status(400).json({ error: 'No pending payment found' });
    }

    const qrCodeUrl = await QRCode.toDataURL(`Payment for ${user.email}: ₹${user.payment.totalCharge}`);
    res.status(200).json({
      courses: user.payment.courses,
      totalCharge: user.payment.totalCharge,
      qrCodeUrl
    });
  } catch (error) {
    console.error('Payment details error:', error);
    res.status(500).json({ error: 'Server error fetching payment details' });
  }
});

app.post('/confirm-payment', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(400).json({ error: 'Invalid user or role' });
    }

    if (!user.payment || user.payment.status !== 'pending') {
      return res.status(400).json({ error: 'No pending payment found' });
    }

    user.payment.status = 'pending';
    user.payment.paymentDate = new Date();
    await user.save();
    res.status(200).json({ message: 'Payment confirmation recorded, awaiting admin approval', redirect: '/dashboard' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Server error confirming payment' });
  }
});

app.post('/pending-payments', async (req, res) => {
  try {
    const { adminEmail } = req.body;
    if (!adminEmail) {
      return res.status(400).json({ error: 'Admin email is required' });
    }

    const admin = await User.findOne({ email: adminEmail, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid admin' });
    }

    const students = await User.find({
      role: 'student',
      'payment.status': 'pending',
      adminApproval: false
    }).select('name email username payment');

    res.status(200).json({ students });
  } catch (error) {
    console.error('Pending payments error:', error);
    res.status(500).json({ error: 'Server error fetching pending payments' });
  }
});

app.post('/approve-payment', async (req, res) => {
  try {
    const { studentEmail } = req.body;
    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    const user = await User.findOne({ email: studentEmail, role: 'student' });
    if (!user) {
      return res.status(400).json({ error: 'Student not found' });
    }

    if (!user.payment || user.payment.status !== 'pending') {
      return res.status(400).json({ error: 'No pending payment found' });
    }

    user.payment.status = 'completed';
    user.adminApproval = true;
    await user.save();
    res.status(200).json({ message: 'Payment approved successfully' });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ error: 'Server error approving payment' });
  }
});

app.post('/reject-payment', async (req, res) => {
  try {
    const { studentEmail } = req.body;
    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    const user = await User.findOne({ email: studentEmail, role: 'student' });
    if (!user) {
      return res.status(400).json({ error: 'Student not found' });
    }

    if (!user.payment || user.payment.status !== 'pending') {
      return res.status(400).json({ error: 'No pending payment found' });
    }

    user.payment.status = 'rejected';
    user.adminApproval = false;
    await user.save();
    res.status(200).json({ message: 'Payment rejected successfully' });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ error: 'Server error rejecting payment' });
  }
});

app.post('/user-data', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('User data error:', error);
    res.status(500).json({ error: 'Server error fetching user data' });
  }
});

app.post('/students', async (req, res) => {
  try {
    const { trainerEmail } = req.body;
    if (!trainerEmail) {
      return res.status(400).json({ error: 'Trainer email is required' });
    }

    const trainer = await User.findOne({ email: trainerEmail, role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({ error: 'Invalid trainer' });
    }

    const trainerCourseIds = trainer.trainerCourses.map(course => course.id);
    const students = await User.find({
      role: 'student',
      'courses.id': { $in: trainerCourseIds }
    }).select('name email username courses attendancePercent');

    const studentsWithProgress = students.map(student => {
      const relevantCourses = student.courses.filter(course => trainerCourseIds.includes(course.id));
      const totalTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.length || 0), 0);
      const completedTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.filter(a => a.status === 'completed').length || 0), 0);
      const submittedTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.filter(a => a.status === 'submitted').length || 0), 0);
      return {
        name: student.name,
        email: student.email,
        username: student.username,
        attendancePercent: student.attendancePercent || 0,
        courses: relevantCourses.map(course => ({
          id: course.id,
          name: course.name,
          assessments: (course.assessments || []).map(assessment => ({
            id: assessment.id,
            name: assessment.name,
            status: assessment.status,
            description: assessment.description || ''
          }))
        })),
        totalTasks,
        completedTasks,
        submittedTasks
      };
    });

    console.log(`Fetched ${studentsWithProgress.length} students for trainer ${trainerEmail}`);
    res.status(200).json({ students: studentsWithProgress });
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ error: 'Server error fetching students' });
  }
});

app.post('/download-students', async (req, res) => {
  try {
    const { trainerEmail } = req.body;
    if (!trainerEmail) {
      return res.status(400).json({ error: 'Trainer email is required' });
    }

    const trainer = await User.findOne({ email: trainerEmail, role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({ error: 'Invalid trainer' });
    }

    const trainerCourseIds = trainer.trainerCourses.map(course => course.id);
    const students = await User.find({
      role: 'student',
      'courses.id': { $in: trainerCourseIds }
    }).select('name email username courses attendancePercent');

    const studentsData = students.map(student => {
      const relevantCourses = student.courses.filter(course => trainerCourseIds.includes(course.id));
      const totalTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.length || 0), 0);
      const completedTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.filter(a => a.status === 'completed').length || 0), 0);
      const submittedTasks = relevantCourses.reduce((sum, course) => sum + (course.assessments?.filter(a => a.status === 'submitted').length || 0), 0);
      const studentData = {
        Name: student.name,
        Email: student.email,
        Username: student.username,
        AttendancePercent: student.attendancePercent || 0,
        TotalTasks: totalTasks,
        CompletedTasks: completedTasks,
        SubmittedTasks: submittedTasks
      };
      relevantCourses.forEach(course => {
        course.assessments?.forEach(assessment => {
          studentData[`${course.name} - ${assessment.name}`] = assessment.status;
        });
      });
      return studentData;
    });

    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(studentsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=student_data.xlsx');
    res.status(200).send(excelBuffer);
  } catch (error) {
    console.error('Download students error:', error);
    res.status(500).json({ error: 'Server error downloading student data' });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (user) {
      user.logoutActivity.push({ timestamp: new Date() });
      await user.save();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// Test user creation route for debugging
app.get('/create-test-user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      name: 'Guru',
      email: 'guru@example.com',
      password: hashedPassword,
      role: 'student',
      studentID: 'STU1234',
      username: 'guru1234',
      adminApproval: true,
      courses: [{
        id: 1,
        name: 'Web Development',
        assessments: courseTasks[1].map(task => ({
          ...task,
          status: task.id === 101 ? 'submitted' : 'not_started',
          percentComplete: task.id === 101 ? 100 : 0,
          startTime: task.id === 101 ? new Date() : null,
          endTime: task.id === 101 ? new Date() : null
        }))
      }],
      attendancePercent: 10
    });
    await user.save();
    res.status(200).json({ message: 'Test user created (Guru with task 101 submitted)' });
  } catch (error) {
    console.error('Test user creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Test user email already exists' });
    }
    res.status(500).json({ error: 'Error creating test user' });
  }
});

// Catch-all for unmatched routes
app.use((req, res) => {
  console.error(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
