import { Asset } from 'expo-asset';

export const extendedStudentInfo = {
  101: {
    phone: "(555) 123-4567",
    email: "john.doe@school.edu",
    dateOfBirth: "2008-05-15",
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Mother",
      phone: "(555) 123-4568"
    }
  },
  102: {
    phone: "(555) 234-5678",
    email: "jane.smith@school.edu",
    dateOfBirth: "2009-08-22",
    emergencyContact: {
      name: "Robert Smith",
      relationship: "Father",
      phone: "(555) 234-5679"
    }
  },
  103: {
    phone: "(555) 345-6789",
    email: "samuel.green@school.edu",
    dateOfBirth: "2007-11-30",
    emergencyContact: {
      name: "Mary Green",
      relationship: "Mother",
      phone: "(555) 345-6780"
    }
  },
  104: {
    phone: "(555) 456-7890",
    email: "emily.white@school.edu",
    dateOfBirth: "2008-09-03",
    emergencyContact: {
      name: "Thomas White",
      relationship: "Father",
      phone: "(555) 456-7891"
    }
  },
  105: {
    phone: "(555) 567-8901",
    email: "lucas.brown@school.edu",
    dateOfBirth: "2010-07-18",
    emergencyContact: {
      name: "Sarah Brown",
      relationship: "Mother",
      phone: "(555) 567-8902"
    }
  },
  106: {
    phone: "(555) 678-9012",
    email: "chloe.wilson@school.edu",
    dateOfBirth: "2006-12-05",
    emergencyContact: {
      name: "Jennifer Wilson",
      relationship: "Mother",
      phone: "(555) 678-9013"
    }
  },
  107: {
    phone: "(555) 789-0123",
    email: "max.miller@school.edu",
    dateOfBirth: "2007-03-25",
    emergencyContact: {
      name: "David Miller",
      relationship: "Father",
      phone: "(555) 789-0124"
    }
  },
  108: {
    phone: "(555) 890-1234",
    email: "sophia.jackson@school.edu",
    dateOfBirth: "2008-08-14",
    emergencyContact: {
      name: "Patricia Jackson",
      relationship: "Mother",
      phone: "(555) 890-1235"
    }
  },
  109: {
    phone: "(555) 901-2345",
    email: "liam.harris@school.edu",
    dateOfBirth: "2009-06-30",
    emergencyContact: {
      name: "Michael Harris",
      relationship: "Father",
      phone: "(555) 901-2346"
    }
  },
  110: {
    phone: "(555) 012-3456",
    email: "isabella.martinez@school.edu",
    dateOfBirth: "2008-10-12",
    emergencyContact: {
      name: "Maria Martinez",
      relationship: "Mother",
      phone: "(555) 012-3457"
    }
  }
};


export const referrals = [
  {
    id: 1,
    studentId: 101,
    referrer: {
      name: "Sarah Johnson",
      relationship: "School Counselor",
      role: "Staff Member"
    },
    status: "Active",
    type: "Academic Support",
    createdDate: "2025-02-01",
    comment: "Student showing signs of academic stress and difficulty managing workload.",
    appointmentCreated: true,
    appointmentId: 1
  },
  {
    id: 2,
    studentId: 101,
    referrer: {
      name: "Sarah Johnson",
      relationship: "School Counselor",
      role: "Staff Member"
    },
    status: "Active",
    type: "Academic Support",
    createdDate: "2025-02-01",
    comment: "Student showing signs of academic stress and difficulty managing workload.",
    appointmentCreated: true,
    appointmentId: 1
    },
    {
      id: 3,
      studentId: 101,
      referrer: {
        name: "Jane Doe",
        relationship: "Mother",
        role: "Parent/Guardian"
      },
      status: "Completed",
      type: "Mental Health Support",
      createdDate: "2024-11-15",
      comment: "Concerned about anxiety affecting school performance.",
      appointmentCreated: true,
      appointmentId: 2
    },
    {
      id: 4,
      studentId: 102,
      referrer: {
        name: "Ms. Roberts",
        relationship: "Math Teacher",
        role: "Staff Member"
      },
      status: "Active",
      type: "Academic Support",
      createdDate: "2025-01-20",
      comment: "Student struggling with advanced algebra concepts. Requesting tutoring support.",
      appointmentCreated: false
    },
    {
      id: 5,
      studentId: 103,
      referrer: {
        name: "Michael Green",
        relationship: "Father",
        role: "Parent/Guardian"
      },
      status: "Active",
      type: "College Counseling",
      createdDate: "2025-02-05",
      comment: "Requesting guidance for college applications and scholarship opportunities.",
      appointmentCreated: true,
      appointmentId: 5
    },
    {
      id: 6,
      studentId: 103,
      referrer: {
        name: "Dr. Thompson",
        relationship: "School Psychologist",
        role: "Staff Member"
      },
      status: "Completed",
      type: "Mental Health Support",
      createdDate: "2024-10-10",
      comment: "Student reported feelings of depression. Initial assessment recommended.",
      appointmentCreated: true,
      appointmentId: 6
    },
    {
      id: 7,
      studentId: 104,
      referrer: {
        name: "Coach Williams",
        relationship: "PE Teacher",
        role: "Staff Member"
      },
      status: "Active",
      type: "Social Support",
      createdDate: "2025-01-30",
      comment: "Student showing signs of social isolation during team activities.",
      appointmentCreated: true,
      appointmentId: 7
    },
    {
      id: 8,
      studentId: 105,
      referrer: {
        name: "Sarah Brown",
        relationship: "Mother",
        role: "Parent/Guardian"
      },
      status: "Active",
      type: "Behavioral Support",
      createdDate: "2025-02-01",
      comment: "Concerned about recent aggressive behavior and anger management.",
      appointmentCreated: true,
      appointmentId: 8
    },
    {
      id: 9,
      studentId: 106,
      referrer: {
        name: "Ms. Lee",
        relationship: "Career Counselor",
        role: "Staff Member"
      },
      status: "Completed",
      type: "Career Guidance",
      createdDate: "2024-11-05",
      comment: "Student requesting information about engineering programs and internships.",
      appointmentCreated: true,
      appointmentId: 9
    },
    {
      id: 10,
      studentId: 108,
      referrer: {
        name: "Mrs. Clark",
        relationship: "English Teacher",
        role: "Staff Member"
      },
      status: "Active",
      type: "Academic Support",
      createdDate: "2025-02-10",
      comment: "Student showing decline in essay writing performance and class participation.",
      appointmentCreated: false
    },
    {
      id: 11,
      studentId: 109,
      referrer: {
        name: "Michael Harris",
        relationship: "Father",
        role: "Parent/Guardian"
      },
      status: "Completed",
      type: "Career Guidance",
      createdDate: "2024-10-15",
      comment: "Seeking guidance on course selection for technology career path.",
      appointmentCreated: true,
      appointmentId: 10
    }
];

export const progressNotes = [
  {
    id: 1,
    studentId: 101,
    title: "Initial Assessment",
    content: "Student expressed concerns about academic pressure. Setting up weekly check-ins.",
    createdBy: "Dr. Smith",
    createdDate: "2025-02-07",
    type: "Assessment"
  }
];

export const forms = [
  {
    id: 1,
    studentId: 101,
    name: "Consent for Counseling Services",
    type: "Consent Form",
    status: "Completed",
    sharedBy: "Dr. Smith",
    sharedDate: "2025-01-15",
    lastUpdated: "2025-01-20"
  },
  {
    id: 2,
    studentId: 101,
    name: "Field Trip Permission Form",
    type: "Permission Form",
    status: "Pending",
    sharedBy: "Mrs. Johnson",
    sharedDate: "2025-02-15",
    lastUpdated: "2025-02-15",
    // Use asset module resolution
    filePath: Asset.fromModule(require('../../assets/forms/consentform_a.pdf')).uri
  }
];

export const appointments = [
  // Student 101 - John Doe
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
      date: "2025-03-15",
      time: "14:30",
      location: "Room 305, School Building A",
    },
    type: "Mental Health",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 2,
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
      id: 202,
      name: "Ms. Johnson",
      specialization: "Career Counseling",
    },
    time: {
      date: "2025-03-22",
      time: "10:00",
      location: "Room 402, School Building B",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },
  {
    id: 3,
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
      date: "2024-12-15",
      time: "13:30",
      location: "Room 305, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Anxiety Check-in",
        body: "Student reports improved anxiety management using breathing techniques.",
        date: "2024-12-15",
      },
    ],
  },

  // Student 102 - Jane Smith
  {
    id: 4,
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
      date: "2025-03-18",
      time: "09:00",
      location: "Room 402, School Building B",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 5,
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
      id: 204,
      name: "Mrs. Davis",
      specialization: "Academic Counseling",
    },
    time: {
      date: "2025-04-05",
      time: "11:30",
      location: "Room 204, School Building D",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },
  {
    id: 6,
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
      date: "2024-11-30",
      time: "09:30",
      location: "Room 402, School Building B",
    },
    type: "Career Counseling",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Career Exploration",
        body: "Initial discussion about law career path and required preparations.",
        date: "2024-11-30",
      },
    ],
  },

  // Student 103 - Samuel Green
  {
    id: 7,
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
      date: "2025-03-20",
      time: "14:00",
      location: "Room 101, School Building C",
    },
    type: "Mental Health",
    status: "pending",
    priority: "high",
    notes: [],
  },
  {
    id: 8,
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
      id: 202,
      name: "Ms. Johnson",
      specialization: "Career Counseling",
    },
    time: {
      date: "2025-03-25",
      time: "11:00",
      location: "Room 402, School Building B",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 9,
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
      date: "2024-10-10",
      time: "13:00",
      location: "Room 101, School Building C",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    notes: [
      {
        title: "Depression Assessment",
        body: "Initial assessment of depressive symptoms and coping strategies.",
        date: "2024-10-10",
      },
    ],
  },

  // Student 104 - Emily White
  {
    id: 10,
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
      date: "2025-03-19",
      time: "10:30",
      location: "Room 204, School Building D",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 11,
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
      date: "2025-04-02",
      time: "13:30",
      location: "Room 204, School Building D",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },
  {
    id: 12,
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
      date: "2024-11-15",
      time: "11:00",
      location: "Room 204, School Building D",
    },
    type: "Academic Counseling",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Study Skills",
        body: "Reviewed time management strategies and study techniques.",
        date: "2024-11-15",
      },
    ],
  },

  // Continue with similar patterns for students 105-110...
  // Student 105 - Lucas Brown
  {
    id: 13,
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
      date: "2025-03-21",
      time: "09:00",
      location: "Room 103, School Building A",
    },
    type: "Mental Health",
    status: "pending",
    priority: "high",
    notes: [],
  },
  {
    id: 14,
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
      date: "2024-12-01",
      time: "10:00",
      location: "Room 103, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    notes: [
      {
        title: "Anger Management",
        body: "Discussed triggers and developed coping strategies.",
        date: "2024-12-01",
      },
    ],
  },

  // Student 106 - Chloe Wilson
  {
    id: 15,
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
      date: "2025-03-28",
      time: "13:30",
      location: "Room 307, School Building E",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 16,
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
      date: "2024-11-05",
      time: "14:30",
      location: "Room 307, School Building E",
    },
    type: "Career Counseling",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Engineering Pathways",
        body: "Explored different engineering disciplines and university programs.",
        date: "2024-11-05",
      },
    ],
  },

  // Student 107 - Max Miller
  {
    id: 17,
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
      date: "2025-03-26",
      time: "15:00",
      location: "Room 305, School Building F",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },

  // Student 108 - Sophia Jackson
  {
    id: 18,
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
      date: "2025-03-22",
      time: "11:30",
      location: "Room 209, School Building A",
    },
    type: "Mental Health",
    status: "pending",
    priority: "high",
    notes: [],
  },
  {
    id: 19,
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
    date: "2024-12-20",
      time: "10:30",
      location: "Room 209, School Building A",
    },
    type: "Mental Health",
    status: "completed",
    priority: "high",
    notes: [
      {
        title: "Depression Follow-up",
        body: "Reviewed progress with medication and therapy techniques.",
        date: "2024-12-20",
      },
    ],
  },

  // Student 109 - Liam Harris
  {
    id: 20,
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
      date: "2025-03-25",
      time: "09:45",
      location: "Room 405, School Building B",
    },
    type: "Career Counseling",
    status: "pending",
    priority: "medium",
    notes: [],
  },
  {
    id: 21,
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
      date: "2024-10-15",
      time: "10:45",
      location: "Room 405, School Building B",
    },
    type: "Career Counseling",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Career Interest Assessment",
        body: "Completed interest inventory and discussed potential career paths in technology.",
        date: "2024-10-15",
      },
    ],
  },

  // Student 110 - Isabella Martinez
  {
    id: 22,
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
      date: "2025-03-30",
      time: "16:00",
      location: "Room 502, School Building C",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },
  {
    id: 23,
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
      date: "2025-04-15",
      time: "15:00",
      location: "Room 502, School Building C",
    },
    type: "Academic Counseling",
    status: "pending",
    priority: "low",
    notes: [],
  },
  {
    id: 24,
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
      date: "2024-11-12",
      time: "14:00",
      location: "Room 502, School Building C",
    },
    type: "Academic Counseling",
    status: "completed",
    priority: "medium",
    notes: [
      {
        title: "Test Preparation",
        body: "Reviewed test-taking strategies and created study schedule.",
        date: "2024-11-12",
      },
    ],
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
