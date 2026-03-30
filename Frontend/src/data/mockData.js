// Shared mock data for games and quizzes to avoid duplicates

export const mockGameQuizzes = [
    {
        id: 3,
        title: "Circuit Designer Challenge",
        subject_name: "Physics",
        category_icon: "⚡",
        difficulty: "medium",
        duration_minutes: 45,
        description: "Build electrical circuits to solve physics problems",
        game_component: "circuit",
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        id: 4,
        title: "Nutrition Knowledge Game",
        subject_name: "Science",
        category_icon: "🍎",
        difficulty: "easy",
        duration_minutes: 30,
        description: "Match foods with their nutritional values",
        game_component: "nutrition",
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        id: 7,
        title: "Pizza Fraction Fun",
        subject_name: "Mathematics",
        category_icon: "🍕",
        difficulty: "easy",
        duration_minutes: 25,
        description: "Learn fractions by dividing pizzas",
        game_component: "pizza",
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        id: 8,
        title: "Photosynthesis Explorer",
        subject_name: "Science",
        category_icon: "🌱",
        difficulty: "medium",
        duration_minutes: 35,
        description: "Discover how plants make food",
        game_component: "photosynthesis",
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    },
    {
        id: 9,
        title: "Equation Master",
        subject_name: "Mathematics",
        category_icon: "🔓",
        difficulty: "hard",
        duration_minutes: 40,
        description: "Solve mathematical equations step by step",
        game_component: "equation",
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    }
];

export const mockTraditionalQuizzes = [
    {
        id: 1,
        title: "Mathematics Fundamentals",
        subject_name: "Mathematics",
        subject_icon: "🧮",
        difficulty: "easy",
        duration_minutes: 30,
        total_questions: 15,
        classes: ["6", "7", "8"]
    },
    {
        id: 2,
        title: "Science Basics",
        subject_name: "Science",
        subject_icon: "🔬",
        difficulty: "medium",
        duration_minutes: 45,
        total_questions: 20,
        classes: ["6", "7", "8", "9", "10"]
    },
    {
        id: 5,
        title: "Physics Concepts",
        subject_name: "Physics",
        subject_icon: "⚛️",
        difficulty: "hard",
        duration_minutes: 50,
        total_questions: 25,
        classes: ["9", "10", "11", "12"]
    },
    {
        id: 6,
        title: "Chemistry Basics",
        subject_name: "Chemistry",
        subject_icon: "⚗️",
        difficulty: "medium",
        duration_minutes: 40,
        total_questions: 18,
        classes: ["9", "10", "11", "12"]
    },
    {
        id: 10,
        title: "Biology Fundamentals",
        subject_name: "Biology",
        subject_icon: "🧬",
        difficulty: "medium",
        duration_minutes: 35,
        total_questions: 16,
        classes: ["7", "8", "9", "10", "11", "12"]
    },
    {
        id: 11,
        title: "History Quiz",
        subject_name: "History",
        subject_icon: "🌍",
        difficulty: "easy",
        duration_minutes: 25,
        total_questions: 12,
        classes: ["6", "7", "8", "9"]
    },
    {
        id: 12,
        title: "English Grammar",
        subject_name: "English",
        subject_icon: "📖",
        difficulty: "easy",
        duration_minutes: 30,
        total_questions: 15,
        classes: ["6", "7", "8", "9", "10"]
    },
    {
        id: 13,
        title: "Geography Basics",
        subject_name: "Geography",
        subject_icon: "🗺️",
        difficulty: "easy",
        duration_minutes: 28,
        total_questions: 14,
        classes: ["6", "7", "8", "9", "10"]
    },
    {
        id: 14,
        title: "Circuit Knowledge Quiz",
        subject_name: "Physics",
        subject_icon: "⚡",
        difficulty: "medium",
        duration_minutes: 15,
        total_questions: 10,
        classes: ["6", "7", "8", "9", "10", "11", "12"]
    }
];

export const mockStudentProgress = {
    overall_stats: {
        completed_quizzes: 5,
        average_score: 85,
        best_score: 95
    },
    subject_progress: [
        {
            id: 1,
            name: "Mathematics",
            icon: "🧮",
            color: "from-blue-500 to-blue-700",
            completed: 2,
            total_quizzes: 4,
            average_score: 88,
            best_score: 95,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 2,
            name: "Science",
            icon: "🔬",
            color: "from-green-500 to-green-700",
            completed: 1,
            total_quizzes: 3,
            average_score: 82,
            best_score: 90,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 3,
            name: "Physics",
            icon: "⚛️",
            color: "from-purple-500 to-purple-700",
            completed: 0,
            total_quizzes: 2,
            average_score: 0,
            best_score: 0,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 4,
            name: "Chemistry",
            icon: "⚗️",
            color: "from-red-500 to-red-700",
            completed: 0,
            total_quizzes: 2,
            average_score: 0,
            best_score: 0,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 5,
            name: "English",
            icon: "📖",
            color: "from-indigo-500 to-indigo-700",
            completed: 1,
            total_quizzes: 2,
            average_score: 75,
            best_score: 85,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 6,
            name: "History",
            icon: "🌍",
            color: "from-orange-500 to-orange-700",
            completed: 1,
            total_quizzes: 2,
            average_score: 90,
            best_score: 95,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 7,
            name: "Biology",
            icon: "🧬",
            color: "from-lime-500 to-lime-700",
            completed: 0,
            total_quizzes: 2,
            average_score: 0,
            best_score: 0,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        },
        {
            id: 8,
            name: "Geography",
            icon: "🗺️",
            color: "from-teal-500 to-teal-700",
            completed: 0,
            total_quizzes: 2,
            average_score: 0,
            best_score: 0,
            classes: ["6", "7", "8", "9", "10", "11", "12"]
        }
    ],
    recent_attempts: [
        {
            id: 1,
            title: "Mathematics Fundamentals",
            subject_name: "Mathematics",
            subject_icon: "🧮",
            score: 95,
            correct_answers: 14,
            total_questions: 15,
            completed_at: "2024-01-15",
            time_spent_minutes: 28,
            difficulty: "easy"
        }
    ]
};

export const mockPrebuiltQuizzes = [
    {
        id: 1,
        title: "Mathematics - Basic Algebra",
        description: "Fundamental algebra concepts for 6th-8th grade",
        subject: "Mathematics",
        grade: "6-8",
        questions: 15,
        duration: 30,
        difficulty: "Easy",
        completions: 245
    },
    {
        id: 2,
        title: "Science - Human Body Systems",
        description: "Understanding different body systems and their functions",
        subject: "Science",
        grade: "7-9",
        questions: 20,
        duration: 45,
        difficulty: "Medium",
        completions: 189
    },
    {
        id: 3,
        title: "English - Grammar Fundamentals",
        description: "Basic grammar rules and sentence construction",
        subject: "English",
        grade: "6-10",
        questions: 25,
        duration: 35,
        difficulty: "Easy",
        completions: 312
    },
    {
        id: 4,
        title: "Physics - Laws of Motion",
        description: "Newton's laws and basic mechanics principles",
        subject: "Physics",
        grade: "9-12",
        questions: 18,
        duration: 50,
        difficulty: "Hard",
        completions: 156
    },
    {
        id: 5,
        title: "Chemistry - Periodic Table",
        description: "Elements, properties, and chemical bonds",
        subject: "Chemistry",
        grade: "9-12",
        questions: 22,
        duration: 40,
        difficulty: "Medium",
        completions: 134
    },
    {
        id: 6,
        title: "History - World War II",
        description: "Key events, causes, and consequences of WWII",
        subject: "History",
        grade: "9-12",
        questions: 30,
        duration: 60,
        difficulty: "Medium",
        completions: 98
    }
];

// Helper function to filter data by class
export const filterByClass = (data, studentClass) => {
    return data.filter(item => item.classes.includes(studentClass));
};

// Helper function to deduplicate data by subject
export const deduplicateBySubject = (data) => {
    const seen = new Set();
    return data.filter(item => {
        // Handle different possible subject field names
        const key = item.subject_name || item.subject || item.subject_id || item.name;
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

// Helper function to deduplicate data by ID or title
export const deduplicateByID = (data) => {
    const seen = new Set();
    return data.filter(item => {
        // Use ID as primary key for deduplication
        const key = item.id;
        if (!key || seen.has(key)) {
            console.log('Duplicate found:', key, item);
            return false;
        }
        seen.add(key);
        console.log('Adding unique item:', key, item);
        return true;
    });
};

// Helper function to get subject progress by class
export const getSubjectProgressByClass = (studentClass) => {
    const filteredSubjects = mockStudentProgress.subject_progress.filter(subject =>
        subject.classes.includes(studentClass)
    );

    // Deduplicate by subject name to ensure no duplicates
    const seen = new Set();
    return filteredSubjects.filter(subject => {
        if (seen.has(subject.name)) {
            return false;
        }
        seen.add(subject.name);
        return true;
    });
};

// Circuit Knowledge Quiz Questions
export const circuitQuizQuestions = {
    quiz: {
        id: 14,
        title: "Circuit Knowledge Quiz",
        description: "Test your understanding of electrical circuits and components",
        subject_name: "Physics",
        difficulty: "medium",
        duration_minutes: 15,
        total_questions: 10
    },
    questions: [
        {
            id: 1,
            question_text: "What is the basic unit of electrical current?",
            question_type: "multiple_choice",
            options: ["Volt", "Ampere", "Ohm", "Watt"],
            correct_answer: "Ampere",
            explanation: "Ampere (A) is the SI unit of electrical current, named after André-Marie Ampère.",
            points: 1
        },
        {
            id: 2,
            question_text: "In a series circuit, what happens to the current when more resistors are added?",
            question_type: "multiple_choice",
            options: ["Increases", "Decreases", "Stays the same", "Becomes zero"],
            correct_answer: "Decreases",
            explanation: "In a series circuit, adding more resistors increases the total resistance, which decreases the current according to Ohm's law (I = V/R).",
            points: 1
        },
        {
            id: 3,
            question_text: "What does a capacitor store?",
            question_type: "multiple_choice",
            options: ["Current", "Voltage", "Electric charge", "Resistance"],
            correct_answer: "Electric charge",
            explanation: "A capacitor stores electric charge between its plates, creating an electric field.",
            points: 1
        },
        {
            id: 4,
            question_text: "Which component is used to control the flow of current in a circuit?",
            question_type: "multiple_choice",
            options: ["Battery", "Resistor", "Wire", "Switch"],
            correct_answer: "Resistor",
            explanation: "A resistor controls the flow of current by providing opposition to the current flow.",
            points: 1
        },
        {
            id: 5,
            question_text: "In a parallel circuit, the voltage across each component is the same.",
            question_type: "true_false",
            options: ["True", "False"],
            correct_answer: "True",
            explanation: "In a parallel circuit, all components are connected across the same voltage source, so they all have the same voltage.",
            points: 1
        },
        {
            id: 6,
            question_text: "What is the symbol for a resistor in a circuit diagram?",
            question_type: "multiple_choice",
            options: ["Zigzag line", "Circle", "Rectangle", "Triangle"],
            correct_answer: "Zigzag line",
            explanation: "A resistor is represented by a zigzag line in circuit diagrams.",
            points: 1
        },
        {
            id: 7,
            question_text: "What happens to the brightness of bulbs in a series circuit when one bulb burns out?",
            question_type: "multiple_choice",
            options: ["All bulbs get brighter", "All bulbs go out", "Remaining bulbs get dimmer", "Nothing changes"],
            correct_answer: "All bulbs go out",
            explanation: "In a series circuit, if one component fails (like a bulb burning out), the entire circuit is broken and all bulbs go out.",
            points: 1
        },
        {
            id: 8,
            question_text: "What is the relationship between voltage, current, and resistance?",
            question_type: "multiple_choice",
            options: ["V = I × R", "I = V × R", "R = V × I", "V = I ÷ R"],
            correct_answer: "V = I × R",
            explanation: "Ohm's law states that voltage (V) equals current (I) multiplied by resistance (R).",
            points: 1
        },
        {
            id: 9,
            question_text: "Which type of circuit allows current to flow through multiple paths?",
            question_type: "multiple_choice",
            options: ["Series circuit", "Parallel circuit", "Both", "Neither"],
            correct_answer: "Parallel circuit",
            explanation: "In a parallel circuit, current can flow through multiple independent paths.",
            points: 1
        },
        {
            id: 10,
            question_text: "What is the purpose of a switch in an electrical circuit?",
            question_type: "multiple_choice",
            options: ["To increase voltage", "To control current flow", "To store energy", "To measure resistance"],
            correct_answer: "To control current flow",
            explanation: "A switch is used to open or close a circuit, thereby controlling whether current can flow or not.",
            points: 1
        }
    ]
};
