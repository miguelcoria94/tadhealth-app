export const appointments = [
  {
    id: 1,
    student: {
      id: 101,
      name: "John Doe",
      age: 16,
      grade: 10,
      mentalState: "yellow",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 201,
      name: "Dr. Smith",
      specialization: "Mental Health",
    },
    time: {
      date: "2025-02-07",
      time: "14:30",
      location: "Room 305, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "medium",
    totalAppointments: 5,
    pastAppointments: [
      {
        date: "2024-12-05",
        type: "Mental Health",
        notes: "Follow up on emotional well-being.",
      },
      {
        date: "2024-10-20",
        type: "Career Counseling",
        notes: "Explored future career options.",
      },
    ],
    notes: [
      {
        title: "Mood Assessment",
        body: "Student reported feeling anxious, but manageable.",
        date: "2025-02-07",
      },
      {
        title: "Progress Review",
        body: "Discussed improvement in school performance.",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 4,
      meetingHelpfulness: 4,
      needAnotherMeeting: 2,
    },
  },
  {
    id: 2,
    student: {
      id: 102,
      name: "Jane Smith",
      age: 15,
      grade: 9,
      mentalState: "green",
      consent: {
        studentConsent: true,
        parentConsent: false,
      },
    },
    counselor: {
      id: 202,
      name: "Ms. Johnson",
      specialization: "Career Counseling",
    },
    time: {
      date: "2025-02-08",
      time: "09:00",
      location: "Room 402, School Building B",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "high",
    totalAppointments: 2,
    pastAppointments: [
      {
        date: "2024-11-30",
        type: "Career Counseling",
        notes: "Initial career discussion, interested in law.",
      },
    ],
    notes: [
      {
        title: "Initial Career Discussion",
        body: "Student is interested in pursuing a law career.",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 5,
      meetingHelpfulness: 5,
      needAnotherMeeting: 4,
    },
  },
  {
    id: 3,
    student: {
      id: 103,
      name: "Samuel Green",
      age: 17,
      grade: 12,
      mentalState: "orange",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 203,
      name: "Mr. Thompson",
      specialization: "Mental Health",
    },
    time: {
      date: "2025-02-09",
      time: "10:30",
      location: "Room 101, School Building C",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    totalAppointments: 8,
    pastAppointments: [
      {
        date: "2024-10-10",
        type: "Mental Health",
        notes: "Dealing with depression.",
      },
      {
        date: "2024-09-05",
        type: "Career Counseling",
        notes: "Explored potential college options.",
      },
    ],
    notes: [
      {
        title: "Anxiety Assessment",
        body: "Student is facing ongoing anxiety due to recent life changes.",
        date: "2025-02-09",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 3,
      meetingHelpfulness: 3,
      needAnotherMeeting: 5,
    },
  },
  {
    id: 4,
    student: {
      id: 104,
      name: "Emily White",
      age: 16,
      grade: 11,
      mentalState: "green",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 204,
      name: "Mrs. Davis",
      specialization: "Academic Counseling",
    },
    time: {
      date: "2025-02-10",
      time: "12:00",
      location: "Room 204, School Building D",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "medium",
    totalAppointments: 3,
    pastAppointments: [
      {
        date: "2024-11-15",
        type: "Academic Counseling",
        notes: "Worked on time management.",
      },
    ],
    notes: [
      {
        title: "Time Management Tips",
        body: "Discussed strategies for improving study habits and staying organized.",
        date: "2025-02-10",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 4,
      meetingHelpfulness: 5,
      needAnotherMeeting: 3,
    },
  },
  {
    id: 5,
    student: {
      id: 105,
      name: "Lucas Brown",
      age: 14,
      grade: 8,
      mentalState: "red",
      consent: {
        studentConsent: true,
        parentConsent: false,
      },
    },
    counselor: {
      id: 205,
      name: "Mr. Peterson",
      specialization: "Mental Health",
    },
    time: {
      date: "2025-02-11",
      time: "08:00",
      location: "Room 103, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    totalAppointments: 4,
    pastAppointments: [
      {
        date: "2024-12-01",
        type: "Mental Health",
        notes: "Dealing with anger issues.",
      },
      {
        date: "2024-10-18",
        type: "Mental Health",
        notes: "Initial emotional support.",
      },
    ],
    notes: [
      {
        title: "Anger Management",
        body: "Discussed techniques to manage emotions.",
        date: "2025-02-11",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 4,
      meetingHelpfulness: 5,
      needAnotherMeeting: 5,
    },
  },
  {
    id: 6,
    student: {
      id: 106,
      name: "Chloe Wilson",
      age: 18,
      grade: 12,
      mentalState: "yellow",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 206,
      name: "Ms. Lee",
      specialization: "Career Counseling",
    },
    time: {
      date: "2025-02-12",
      time: "13:30",
      location: "Room 307, School Building E",
    },
    type: "Career Counseling",
    status: "completed",
    priority: "medium",
    totalAppointments: 6,
    pastAppointments: [
      {
        date: "2024-11-05",
        type: "Career Counseling",
        notes: "Explored career opportunities in engineering.",
      },
    ],
    notes: [
      {
        title: "Engineering Career Discussion",
        body: "Discussed possible paths in mechanical and civil engineering.",
        date: "2025-02-12",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 5,
      meetingHelpfulness: 5,
      needAnotherMeeting: 2,
    },
  },
  {
    id: 7,
    student: {
      id: 107,
      name: "Max Miller",
      age: 17,
      grade: 11,
      mentalState: "green",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 207,
      name: "Dr. Taylor",
      specialization: "Academic Counseling",
    },
    time: {
      date: "2025-02-13",
      time: "15:00",
      location: "Room 305, School Building F",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    totalAppointments: 2,
    pastAppointments: [],
    notes: [],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 3,
      meetingHelpfulness: 3,
      needAnotherMeeting: 3,
    },
  },
  {
    id: 8,
    student: {
      id: 108,
      name: "Sophia Jackson",
      age: 16,
      grade: 10,
      mentalState: "orange",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 208,
      name: "Mrs. Clark",
      specialization: "Mental Health",
    },
    time: {
      date: "2025-02-14",
      time: "11:30",
      location: "Room 209, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    totalAppointments: 7,
    pastAppointments: [
      {
        date: "2024-12-20",
        type: "Mental Health",
        notes: "Dealing with depression and low self-esteem.",
      },
    ],
    notes: [
      {
        title: "Depression Check-in",
        body: "Reviewed emotional well-being and self-esteem challenges.",
        date: "2025-02-14",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 4,
      meetingHelpfulness: 4,
      needAnotherMeeting: 5,
    },
  },
  {
    id: 9,
    student: {
      id: 109,
      name: "Liam Harris",
      age: 15,
      grade: 9,
      mentalState: "yellow",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 209,
      name: "Ms. Ramirez",
      specialization: "Career Counseling",
    },
    time: {
      date: "2025-02-15",
      time: "09:45",
      location: "Room 405, School Building B",
    },
    type: "Career Counseling",
    status: "completed",
    priority: "medium",
    totalAppointments: 5,
    pastAppointments: [
      {
        date: "2024-10-15",
        type: "Career Counseling",
        notes: "Reviewed future career options.",
      },
    ],
    notes: [
      {
        title: "Career Options Discussion",
        body: "Discussed possible careers in tech and business fields.",
        date: "2025-02-15",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 4,
      meetingHelpfulness: 4,
      needAnotherMeeting: 3,
    },
  },
  {
    id: 10,
    student: {
      id: 110,
      name: "Isabella Martinez",
      age: 16,
      grade: 10,
      mentalState: "green",
      consent: {
        studentConsent: true,
        parentConsent: true,
      },
    },
    counselor: {
      id: 210,
      name: "Mr. Harper",
      specialization: "Academic Counseling",
    },
    time: {
      date: "2025-02-16",
      time: "16:00",
      location: "Room 502, School Building C",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    totalAppointments: 4,
    pastAppointments: [
      {
        date: "2024-11-12",
        type: "Academic Counseling",
        notes: "Focus on improving test-taking strategies.",
      },
    ],
    notes: [
      {
        title: "Test-Taking Tips",
        body: "Discussed strategies to manage test anxiety and improve focus.",
        date: "2025-02-16",
      },
    ],
    documents: [{ title: "Consent Form", url: "path/to/consent_form.pdf" }],
    questionnaire: {
      meetingRating: 5,
      meetingHelpfulness: 5,
      needAnotherMeeting: 2,
    },
  },
];

export const students = [
  {
    id: 101,
    name: "John Doe",
    age: 16,
    grade: 10,
    mentalState: "yellow",
    appointments: [1],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 5,
    gender: "male",  // added gender
  },
  {
    id: 102,
    name: "Jane Smith",
    age: 15,
    grade: 9,
    mentalState: "green",
    appointments: [2],
    parentConsent: false,
    studentConsent: true,
    totalAppointments: 2,
    gender: "female",
  },
  {
    id: 103,
    name: "Samuel Green",
    age: 17,
    grade: 12,
    mentalState: "orange",
    appointments: [3],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 8,
    gender: "male",
  },
  {
    id: 104,
    name: "Emily White",
    age: 16,
    grade: 11,
    mentalState: "green",
    appointments: [4],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 3,
    gender: "female",
  },
  {
    id: 105,
    name: "Lucas Brown",
    age: 14,
    grade: 8,
    mentalState: "red",
    appointments: [5],
    parentConsent: true,
    studentConsent: false,
    totalAppointments: 4,
    gender: "male",
  },
  {
    id: 106,
    name: "Chloe Wilson",
    age: 18,
    grade: 12,
    mentalState: "yellow",
    appointments: [6],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 6,
    gender: "female",  // added gender
  },
  {
    id: 107,
    name: "Max Miller",
    age: 17,
    grade: 11,
    mentalState: "green",
    appointments: [7],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 2,
    gender: "male",  // added gender
  },
  {
    id: 108,
    name: "Sophia Jackson",
    age: 16,
    grade: 10,
    mentalState: "orange",
    appointments: [8],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 7,
    gender: "female",  // added gender
  },
  {
    id: 109,
    name: "Liam Harris",
    age: 15,
    grade: 9,
    mentalState: "yellow",
    appointments: [9],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 5,
    gender: "male",  // added gender
  },
  {
    id: 110,
    name: "Isabella Martinez",
    age: 16,
    grade: 10,
    mentalState: "green",
    appointments: [10],
    parentConsent: true,
    studentConsent: true,
    totalAppointments: 4,
    gender: "female",  // added gender
  },
];


// Sample app tabs (appointments and students)
const appTabs = {
  appointments: appointments.map((appt) => ({
    id: appt.id,
    time: appt.time,
    studentName: appt.student.name,
    counselorName: appt.counselor.name,
    type: appt.type,
    status: appt.status,
    priority: appt.priority,
  })),
  students: students.map((student) => ({
    id: student.id,
    name: student.name,
    age: student.age,
    grade: student.grade,
    mentalState: student.mentalState,
    totalAppointments: student.totalAppointments,
  })),
};

// Sample function to get the full appointment details
function getAppointmentDetails(id) {
  const appt = appointments.find((appt) => appt.id === id);
  return appt ? appt : "Appointment not found.";
}

// Sample function to get full student details
function getStudentDetails(id) {
  const student = students.find((student) => student.id === id);
  return student ? student : "Student not found.";
}
