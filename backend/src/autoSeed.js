
import { CourseModel } from './models/Course.js'
import { Exam } from './models/Exam.js'
import { PracticePaper } from './models/PracticePaper.js'
const SEED = {
    literature: [
        'Shakespeare: Tragedies & Comedies',
        'Romantic Poetry Essentials',
        'Modernism: Eliot & Yeats',
        'Indian English Literature Survey',
        'Literary Criticism & Theory Basics',
        'Postcolonial Literature: Achebe & Rushdie',
        "Children's Literature & Storytelling",
        'World Literature: Themes & Movements',
    ],
    business: [
        'Business Communication Essentials',
        'Marketing Fundamentals',
        'Financial Accounting Basics',
        'Project Management with Agile',
        'Business Ethics & CSR',
        'Entrepreneurship & Startups',
        'Supply Chain Management',
        'Data-Driven Decision Making',
    ],
    computers: [
        'Web Dev Foundations (HTML/CSS/JS)',
        'Data Structures & Algorithms',
        'Database Systems (SQL/NoSQL)',
        'Operating Systems Concepts',
        'Computer Networks Basics',
        'Machine Learning Fundamentals',
        'Cloud Computing & DevOps',
        'Cybersecurity Basics',
    ],
}

const mkLessons = (cat, t) => {
    // Decide which metadata map to consult based on category
    const META_MAP = { literature: LIT_META, business: BUS_META, computers: CS_META }
    const metaSet = META_MAP[cat] || {}
    const meta = metaSet[t] || {}
    const readingList = meta.readingList || []
    const samplePapers = meta.samplePapers || []
    const tools = meta.tools || []

    if (cat === 'literature') {
        const lessons = [
            { title: t + ' – Overview', videoUrl: '', content: 'Syllabus & objectives.', resources: meta.resources || [] },
            { title: 'Reading List & Texts', videoUrl: '', content: 'Primary texts and recommended editions.', resources: readingList },
            { title: 'Close Reading & Analysis', videoUrl: '', content: 'Guided close-reading exercises and annotations.', resources: meta.analysisResources || [] },
            { title: 'Essay Writing & Sample Answers', videoUrl: '', content: 'Model essays and structuring techniques.', resources: samplePapers.length ? samplePapers : [{ title: 'Sample Essay (Project Gutenberg)', url: 'https://www.gutenberg.org/' }] },
            { title: 'Revision & Sample Papers', videoUrl: '', content: 'Practice questions and suggested answers.', resources: samplePapers },
        ]
        // ensure each lesson has a helpful YouTube search resource
        return lessons.map(l => ({
            ...l,
            resources: Array.from(new Set([...(l.resources || []), { title: `YouTube: Search for ${l.title}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(l.title)}` }].map(JSON.stringify))).map(JSON.parse)
        }))
    }

    // For business and computers, include reading lists, tools and sample papers where available
    const lessons = [
        { title: t + ' – Overview', videoUrl: '', content: 'Syllabus & objectives.', resources: meta.resources || [] },
        { title: 'Core Concepts & Theory', videoUrl: '', content: 'Foundational ideas and definitions.', resources: readingList },
        { title: 'Applied Case Studies', videoUrl: '', content: 'Real-world examples and walkthroughs.', resources: tools },
        { title: 'Practical Exercises', videoUrl: '', content: 'Hands-on problems and practice.', resources: samplePapers },
        { title: 'Revision & Exam Tips', videoUrl: '', content: 'Key points and past paper practice.', resources: samplePapers },
    ]
    return lessons.map(l => ({
        ...l,
        resources: Array.from(new Set([...(l.resources || []), { title: `YouTube: Search for ${l.title}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(l.title)}` }].map(JSON.stringify))).map(JSON.parse)
    }))
}

// Helper: create a simple SVG data-URL thumbnail with the course title so thumbnails are always meaningful and local
const escapeXml = (str = '') => str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const colorPalette = ['#fef3c7', '#fde68a', '#fbcfe8', '#c7f9ff', '#d1fae5', '#fee2e2', '#e9d5ff', '#dbdef0']
const hashCode = (s = '') => s.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0) | 0, 0)
const svgDataUrlForTitle = (title) => {
    const idx = Math.abs(hashCode(title || '')) % colorPalette.length
    const bg = colorPalette[idx]
    const text = escapeXml(title || '')
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='54%' font-family='Segoe UI, Arial, sans-serif' font-size='34' fill='#0f172a' font-weight='600' text-anchor='middle' dominant-baseline='middle'>${text}</text></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Generate an official-style thesis paragraph for literature courses when not provided
const generateThesis = (title, meta = {}) => {
    const summary = meta.summary || ''
    const descr = meta.description || ''
    const base = summary || descr || `An in-depth study of ${title} with emphasis on critical reading and historical context.`
    return `${base} This course examines key texts and themes, develops close-reading skills, and trains students in constructing sustained literary arguments and research-based essays. Suitable for advanced undergraduates and readers seeking a rigorous, scholarly engagement with the material.`
}

const LIT_META = {
    'Shakespeare: Tragedies & Comedies': {
        summary: 'In-depth readings of selected tragedies and comedies by William Shakespeare, focusing on character, language, and stagecraft.',
        description:
            'This course examines Shakespeare\'s major tragic and comic plays (e.g., Hamlet, Othello, Macbeth, A Midsummer Night\'s Dream, Much Ado). Students will learn close-reading techniques, historical context, performance history, and strategies for writing critical essays.',
        resources: [
            { title: 'Folger Shakespeare Library', url: 'https://www.folger.edu/' },
            { title: 'Open Shakespeare (MIT)', url: 'http://shakespeare.mit.edu/' },
            { title: 'SparkNotes: Shakespeare', url: 'https://www.sparknotes.com/shakespeare/' },
        ],
        readingList: [
            { title: 'Hamlet (Full text - MIT Open Shakespeare)', url: 'http://shakespeare.mit.edu/hamlet/full.html' },
            { title: 'Othello (Full text - MIT Open Shakespeare)', url: 'http://shakespeare.mit.edu/othello/full.html' },
            { title: 'A Midsummer Night\'s Dream (Full text - MIT)', url: 'http://shakespeare.mit.edu/midsummer/full.html' },
        ],
        samplePapers: [
            { title: 'Writing about Shakespeare (Purdue OWL)', url: 'https://owl.purdue.edu/owl/subject_specific_writing/writing_in_literature/writing_about_shakespeare.html' },
        ],
    },
    'Romantic Poetry Essentials': {
        summary: 'A guided tour through core Romantic poets and their major poems, with attention to themes of nature, imagination and self.',
        description:
            'Covering Wordsworth, Coleridge, Keats and Shelley, this course explores form, imagery, and the cultural backdrop of the Romantic movement. Students will practice poem analysis and comparative reading.',
        resources: [
            { title: 'Poetry Foundation: William Wordsworth', url: 'https://www.poetryfoundation.org/poets/william-wordsworth' },
            { title: 'Poetry Foundation: John Keats', url: 'https://www.poetryfoundation.org/poets/john-keats' },
            { title: 'British Library: Romanticism', url: 'https://www.bl.uk/romantics-and-victorians' },
        ],
        readingList: [
            { title: 'Selected Wordsworth Poems', url: 'https://www.poetryfoundation.org/poets/william-wordsworth' },
            { title: 'Selected Keats Poems', url: 'https://www.poetryfoundation.org/poets/john-keats' },
            { title: 'Coleridge: Selected Poems', url: 'https://www.poetryfoundation.org/poets/samuel-taylor-coleridge' },
        ],
        samplePapers: [
            { title: 'How to Analyze Poetry (Purdue OWL)', url: 'https://owl.purdue.edu/owl/subject_specific_writing/writing_in_literature/poetry_analysis.html' },
        ],
    },
    'Modernism: Eliot & Yeats': {
        summary: 'Introduces Modernist poetry through the works of T.S. Eliot and W.B. Yeats, focusing on technique and historical change.',
        description:
            'This module studies the formal innovations and cultural anxieties of early 20th-century poetry. Readings include selections from The Waste Land and selected Yeats poems, with attention to symbolism, myth, and modernity.',
        resources: [
            { title: 'Poetry Foundation: T. S. Eliot', url: 'https://www.poetryfoundation.org/poets/t-s-eliot' },
            { title: 'Poetry Foundation: W. B. Yeats', url: 'https://www.poetryfoundation.org/poets/w-b-yeats' },
            { title: 'Modernism Lab (Yale)', url: 'https://modernism.research.yale.edu/' },
        ],
        readingList: [
            { title: 'The Waste Land (excerpts)', url: 'https://www.poetryfoundation.org/poems/47311/the-waste-land' },
            { title: 'Selected Yeats Poems', url: 'https://www.poetryfoundation.org/poets/w-b-yeats' },
        ],
        samplePapers: [
            { title: 'Modernist Poetry Guide (Stanford)', url: 'https://web.stanford.edu/~hahn/modpo/' },
        ],
    },
    'Indian English Literature Survey': {
        summary: 'Survey of major writers and movements in Indian writing in English from the colonial period to the present.',
        description:
            'Topics include early anglophone writing, the rise of the novel in India, key poets and novelists (e.g., Mulk Raj Anand, R.K. Narayan, Arundhati Roy), and contemporary trends. The course emphasizes historical context and close readings.',
        resources: [
            { title: 'British Library: Modern South Asia', url: 'https://www.bl.uk/modern-south-asia' },
            { title: 'The Hindu — Books', url: 'https://www.thehindu.com/books/' },
            { title: 'Sahitya Akademi', url: 'https://sahitya-akademi.gov.in/' },
        ],
        readingList: [
            { title: 'R.K. Narayan — Selected Stories (overview)', url: 'https://www.britannica.com/biography/R-K-Narayan' },
            { title: 'Mulk Raj Anand — Background', url: 'https://www.britannica.com/biography/Mulk-Raj-Anand' },
        ],
        samplePapers: [
            { title: 'Writing about Postcolonial Literature (Guide)', url: 'https://www.britannica.com/topic/postcolonialism' },
        ],
    },
    'Literary Criticism & Theory Basics': {
        summary: 'Foundations of literary theory: close reading, formalism, structuralism, post-structuralism and contemporary approaches.',
        description:
            'This course provides an accessible introduction to major schools of literary criticism and practical tools for interpreting texts. Students will learn key terms and apply approaches to short readings.',
        resources: [
            { title: 'LiteraryTheory.org', url: 'http://www.literarytheory.org/' },
            { title: 'Purdue OWL — Literature', url: 'https://owl.purdue.edu/owl/subject_specific_writing/writing_in_literature/index.html' },
            { title: 'Stanford Encyclopedia of Philosophy — Aesthetics', url: 'https://plato.stanford.edu/entries/aesthetics/' },
        ],
        readingList: [
            { title: 'A Short History of Literary Theory (overview)', url: 'http://www.literarytheory.org/' },
        ],
        analysisResources: [
            { title: 'Close Reading Exercises (Purdue OWL)', url: 'https://owl.purdue.edu/owl/subject_specific_writing/writing_in_literature/literary_analysis.html' },
        ],
    },
    'Postcolonial Literature: Achebe & Rushdie': {
        summary: 'Key texts and themes in postcolonial writing, with case studies of Chinua Achebe and Salman Rushdie.',
        description:
            'Explore issues of identity, language, migration, and historical memory in postcolonial fiction. Close readings of Things Fall Apart and selected Rushdie novels will illuminate narrative strategies and political context.',
        resources: [
            { title: 'British Library — Postcolonial Studies', url: 'https://www.bl.uk/subjects/postcolonial-studies' },
            { title: 'Britannica: Chinua Achebe', url: 'https://www.britannica.com/biography/Chinua-Achebe' },
            { title: 'Britannica: Salman Rushdie', url: 'https://www.britannica.com/biography/Salman-Rushdie' },
        ],
        readingList: [
            { title: 'Things Fall Apart — Background (Britannica)', url: 'https://www.britannica.com/topic/Things-Fall-Apart' },
            { title: 'Selected Rushdie — Context', url: 'https://www.britannica.com/biography/Salman-Rushdie' },
        ],
        samplePapers: [
            { title: 'Postcolonialism — Introduction (Stanford)', url: 'https://plato.stanford.edu/entries/postcolonialism/' },
        ],
    },
    "Children's Literature & Storytelling": {
        summary: 'An introduction to children\'s literature, storytelling techniques, and age-appropriate narrative design.',
        description:
            'Study classic and contemporary children\'s texts, learn about narrative voice, illustration relationships, and methods for adapting stories for young readers. Includes practical exercises in story creation.',
        resources: [
            { title: 'Project Gutenberg — Children\'s Bookshelf', url: 'https://www.gutenberg.org/ebooks/bookshelf/35' },
            { title: 'National Storytelling Network', url: 'https://storynet.org/' },
            { title: 'Children\'s Literature Association', url: 'https://www.childlitassn.org/' },
        ],
        readingList: [
            { title: 'Children\'s Classics (Project Gutenberg)', url: 'https://www.gutenberg.org/ebooks/bookshelf/35' },
            { title: 'How to Tell Stories (Storytelling tips)', url: 'https://storynet.org/' },
        ],
        samplePapers: [
            { title: 'Storytelling Guide (National Storytelling Network)', url: 'https://storynet.org/' },
        ],
    },
    'World Literature: Themes & Movements': {
        summary: 'A thematic survey of world literature with attention to major movements, translation, and comparative reading.',
        description:
            'This course introduces global literary traditions and recurring themes (migration, modernity, colonialism, folklore). Readings are chosen from multiple regions to encourage comparative analysis and cross-cultural thinking.',
        resources: [
            { title: 'World Digital Library', url: 'https://www.wdl.org/' },
            { title: 'Britannica — World literature', url: 'https://www.britannica.com/art/World-literature' },
            { title: 'UNESCO — Literature', url: 'https://en.unesco.org/themes/literature' },
        ],
        readingList: [
            { title: 'World Digital Library — Selected texts', url: 'https://www.wdl.org/en/' },
        ],
    },
}

const BUS_META = {
    'Business Communication Essentials': {
        summary: 'Practical skills for clear, professional communication in business contexts.',
        description: 'Covers email writing, presentations, report writing, and interpersonal communication in organisations. Includes templates, sample memos, and presentation checklists.',
        resources: [
            { title: 'Harvard Business Review – Communication', url: 'https://hbr.org/topic/communication' },
            { title: 'Purdue OWL – Business Writing', url: 'https://owl.purdue.edu/owl/subject_specific_writing/business_writing/index.html' },
        ],
        readingList: [
            { title: 'Business Communication Handbook (overview)', url: 'https://www.businesscommunication.org/' },
        ],
        samplePapers: [
            { title: 'Sample Business Report', url: 'https://www.example.com/sample-business-report' },
        ],
        tools: [
            { title: 'Canva – Presentation Templates', url: 'https://www.canva.com/templates/presentations/' },
        ],
    },
    'Marketing Fundamentals': {
        summary: 'Marketing principles, segmentation, and the marketing mix (4Ps) with practical examples.',
        description: 'An introductory course on market research, targeting, positioning, and promotional strategies. Includes case studies and campaign planning templates.',
        resources: [
            { title: 'Marketing Week', url: 'https://www.marketingweek.com/' },
            { title: 'HubSpot Academy – Marketing', url: 'https://academy.hubspot.com/courses/marketing' },
        ],
        readingList: [
            { title: 'Principles of Marketing (overview)', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/marketing' },
        ],
        samplePapers: [
            { title: 'Sample Marketing Plan (template)', url: 'https://www.example.com/sample-marketing-plan' },
        ],
        tools: [
            { title: 'Google Analytics', url: 'https://analytics.google.com/' },
        ],
    },
    'Financial Accounting Basics': {
        summary: 'Introductory accounting concepts: ledgers, trial balance, and basic financial statements.',
        description: 'Learn bookkeeping fundamentals, prepare profit & loss and balance sheets, and understand accounting cycles. Includes worked examples and practice problems.',
        resources: [
            { title: 'AccountingCoach', url: 'https://www.accountingcoach.com/' },
        ],
        readingList: [
            { title: 'Fundamental Accounting Concepts', url: 'https://www.investopedia.com/terms/a/accounting.asp' },
        ],
        samplePapers: [
            { title: 'Practice Ledger & Trial Balance', url: 'https://www.example.com/practice-ledger' },
        ],
        tools: [
            { title: 'Wave Accounting (free)', url: 'https://www.waveapps.com/' },
        ],
    },
    'Project Management with Agile': {
        summary: 'Agile frameworks, Scrum basics, and managing projects iteratively.',
        description: 'Covers Scrum roles, ceremonies, backlog grooming, sprint planning and practical techniques for agile teams. Includes templates and sample sprint plans.',
        resources: [
            { title: 'Scrum Guide', url: 'https://scrumguides.org/' },
        ],
        readingList: [
            { title: 'Agile Overview', url: 'https://www.atlassian.com/agile' },
        ],
        samplePapers: [
            { title: 'Sample Sprint Plan', url: 'https://www.example.com/sample-sprint' },
        ],
        tools: [
            { title: 'Trello', url: 'https://trello.com/' },
        ],
    },
    'Business Ethics & CSR': {
        summary: 'Ethical frameworks and corporate social responsibility in modern business.',
        description: 'Study ethical theories, stakeholder analysis, and CSR reporting. Case studies examine ethical dilemmas and sustainability initiatives.',
        resources: [
            { title: 'Institute of Business Ethics', url: 'https://www.ibe.org.uk/' },
        ],
        readingList: [
            { title: 'CSR Basics', url: 'https://www.un.org/sustainabledevelopment/sustainable-consumption-production/' },
        ],
        samplePapers: [
            { title: 'Case Study Responses (ethics)', url: 'https://www.example.com/ethics-cases' },
        ],
        tools: [
            { title: 'CSR Reporting Tools', url: 'https://www.example.com/csr-tools' },
        ],
    },
    'Entrepreneurship & Startups': {
        summary: 'Foundations of starting and growing a new venture: idea, validation, and early-stage operations.',
        description: 'Learn how to validate business ideas, build MVPs, understand basic finance for startups, and prepare investor-ready pitch materials. Includes case studies of successful startups and common pitfalls.',
        resources: [
            { title: 'Y Combinator – Startup School', url: 'https://www.startupschool.org/' },
            { title: 'SBA – Starting a Business', url: 'https://www.sba.gov/business-guide/plan-your-business/start-business' },
        ],
        readingList: [
            { title: 'The Lean Startup (summary)', url: 'https://leanstartup.co/' },
        ],
        samplePapers: [
            { title: 'Sample Pitch Deck', url: 'https://www.example.com/sample-pitch' },
        ],
        tools: [
            { title: 'Notion – Startup Templates', url: 'https://www.notion.so/templates' },
        ],
    },
    'Supply Chain Management': {
        summary: 'Principles of supply chain logistics, procurement, and inventory management.',
        description: 'Covers demand forecasting, procurement strategies, inventory control models (EOQ), and basics of logistics networks. Includes worked examples and spreadsheet templates.',
        resources: [
            { title: 'SCM Globe', url: 'https://www.scmglobe.com/' },
        ],
        readingList: [
            { title: 'Supply Chain Basics', url: 'https://www.cips.org/' },
        ],
        samplePapers: [
            { title: 'Inventory Management Exercises', url: 'https://www.example.com/inventory-exercises' },
        ],
        tools: [
            { title: 'Excel Inventory Templates', url: 'https://templates.office.com/' },
        ],
    },
    'Data-Driven Decision Making': {
        summary: 'Using data analysis and visualization to inform business decisions.',
        description: 'Introduces descriptive and inferential analytics, dashboarding, key metrics (KPIs) and A/B testing basics. Includes hands-on examples with spreadsheets and simple Python/R snippets.',
        resources: [
            { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
            { title: 'Google Data Studio', url: 'https://datastudio.google.com/' },
        ],
        readingList: [
            { title: 'Data Literacy Basics', url: 'https://www.data-literacy.org/' },
        ],
        samplePapers: [
            { title: 'Sample Dashboard Case', url: 'https://www.example.com/sample-dashboard' },
        ],
        tools: [
            { title: 'Tableau Public', url: 'https://public.tableau.com/' },
        ],
    },
}

const CS_META = {
    'Web Dev Foundations (HTML/CSS/JS)': {
        summary: 'HTML, CSS and JavaScript fundamentals for building interactive websites.',
        description: 'Hands-on introduction to building responsive pages, DOM manipulation, and basic JS programming patterns. Includes starter templates and exercises.',
        resources: [
            { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
            { title: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
        ],
        readingList: [
            { title: 'Eloquent JavaScript (online)', url: 'https://eloquentjavascript.net/' },
        ],
        samplePapers: [
            { title: 'Project: Simple Portfolio', url: 'https://www.example.com/portfolio-project' },
        ],
        tools: [
            { title: 'CodePen', url: 'https://codepen.io/' },
        ],
    },
    'Data Structures & Algorithms': {
        summary: 'Core data structures and algorithmic thinking for problem solving.',
        description: 'Covers arrays, linked lists, trees, graphs, sorting and searching algorithms with complexity analysis and coding exercises.',
        resources: [
            { title: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/' },
            { title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
        ],
        readingList: [
            { title: 'Introduction to Algorithms (CLRS overview)', url: 'https://mitpress.mit.edu/books/introduction-algorithms-third-edition' },
        ],
        samplePapers: [
            { title: 'Practice Problems (LeetCode-style)', url: 'https://leetcode.com/' },
        ],
        tools: [
            { title: 'Visualgo (algorithm visualiser)', url: 'https://visualgo.net/en' },
        ],
    },
    'Database Systems (SQL/NoSQL)': {
        summary: 'Relational and NoSQL databases: design, queries and transactions.',
        description: 'Introduction to SQL, schema design, indexing and basics of NoSQL stores like MongoDB. Includes practice queries and example datasets.',
        resources: [
            { title: 'SQLZoo', url: 'https://sqlzoo.net/' },
            { title: 'MongoDB University', url: 'https://university.mongodb.com/' },
        ],
        readingList: [
            { title: 'Database Design Fundamentals', url: 'https://www.example.com/db-design' },
        ],
        samplePapers: [
            { title: 'Sample SQL Exercises', url: 'https://www.example.com/sql-exercises' },
        ],
        tools: [
            { title: 'DB Fiddle', url: 'https://www.db-fiddle.com/' },
        ],
    },
    'Operating Systems Concepts': {
        summary: 'Processes, scheduling, memory management and file systems essentials.',
        description: 'Survey of OS concepts with practical examples and simulated exercises for process scheduling and memory allocation.',
        resources: [
            { title: 'Operating Systems: Three Easy Pieces', url: 'http://pages.cs.wisc.edu/~remzi/OSTEP/' },
        ],
        readingList: [
            { title: 'Intro to OS Concepts', url: 'https://www.example.com/os-intro' },
        ],
        samplePapers: [
            { title: 'Sample OS Questions', url: 'https://www.example.com/os-questions' },
        ],
        tools: [
            { title: 'UMLSim (process simulator)', url: 'https://www.example.com/umlsim' },
        ],
    },
    'Computer Networks Basics': {
        summary: 'Networking layers, protocols, and basic network troubleshooting concepts.',
        description: 'Covers OSI/TCP-IP models, routing basics, common protocols and tools like ping/traceroute. Includes packet capture examples.',
        resources: [
            { title: 'Computer Networking — Stanford (CS144)', url: 'https://cs144.github.io/' },
        ],
        readingList: [
            { title: 'Networking Fundamentals', url: 'https://www.example.com/networking-fundamentals' },
        ],
        samplePapers: [
            { title: 'Sample Network Problems', url: 'https://www.example.com/network-practice' },
        ],
        tools: [
            { title: 'Wireshark', url: 'https://www.wireshark.org/' },
        ],
    },
    'Machine Learning Fundamentals': {
        summary: 'Intro to supervised and unsupervised learning, models and evaluation.',
        description: 'Covers linear regression, classification, basic neural networks, overfitting/regularization, and model evaluation metrics. Includes practical Python notebooks and datasets for hands-on practice.',
        resources: [
            { title: 'Coursera – Machine Learning (Andrew Ng)', url: 'https://www.coursera.org/learn/machine-learning' },
            { title: 'scikit-learn documentation', url: 'https://scikit-learn.org/' },
        ],
        readingList: [
            { title: 'A Beginner’s Guide to Machine Learning', url: 'https://www.example.com/ml-guide' },
        ],
        samplePapers: [
            { title: 'Notebook: Linear Regression Example', url: 'https://www.example.com/linear-regression-notebook' },
        ],
        tools: [
            { title: 'Google Colab', url: 'https://colab.research.google.com/' },
        ],
    },
    'Cloud Computing & DevOps': {
        summary: 'Cloud platforms, containerization, and continuous deployment basics.',
        description: 'Introduction to cloud services (IaaS/PaaS), Docker containers, CI/CD pipelines, and basic infrastructure-as-code concepts. Includes sample deployments and Terraform/CloudFormation pointers.',
        resources: [
            { title: 'AWS Training & Certification', url: 'https://aws.amazon.com/training/' },
            { title: 'Docker Docs', url: 'https://docs.docker.com/' },
        ],
        readingList: [
            { title: 'Intro to DevOps Practices', url: 'https://www.atlassian.com/devops' },
        ],
        samplePapers: [
            { title: 'Sample CI Pipeline', url: 'https://www.example.com/sample-ci' },
        ],
        tools: [
            { title: 'GitHub Actions', url: 'https://github.com/features/actions' },
        ],
    },
    'Cybersecurity Basics': {
        summary: 'Core cybersecurity concepts: threats, defenses, and secure coding basics.',
        description: 'Covers common attack vectors, secure development practices, basic cryptography, and incident response fundamentals. Includes hands-on labs and checklists for secure configuration.',
        resources: [
            { title: 'OWASP Top Ten', url: 'https://owasp.org/www-project-top-ten/' },
            { title: 'Cybrary', url: 'https://www.cybrary.it/' },
        ],
        readingList: [
            { title: 'Cybersecurity Fundamentals', url: 'https://www.example.com/cyber-fundamentals' },
        ],
        samplePapers: [
            { title: 'Secure Coding Exercises', url: 'https://www.example.com/secure-coding' },
        ],
        tools: [
            { title: 'TryHackMe', url: 'https://tryhackme.com/' },
        ],
    },
}

export async function autoSeed() {
    const RESET = (process.env.SEED_RESET || 'false').toLowerCase() === 'true'
    if (RESET) {
        await CourseModel.deleteMany({})
        await Exam.deleteMany({})
        await PracticePaper.deleteMany({})
    }

    if (await CourseModel.countDocuments() === 0) {
        const docs = []
        const META_MAP = { literature: LIT_META, business: BUS_META, computers: CS_META }
        for (const [cat, arr] of Object.entries(SEED)) {
            for (const t of arr) {
                const metaSet = META_MAP[cat] || {}
                const meta = metaSet[t] || {}
                docs.push({
                    title: t,
                    category: cat,
                    level: meta.level || 'Intermediate',
                    rating: 4.6,
                    learners: Math.floor(Math.random() * 2000) + 500,
                    duration: meta.duration || '6h+',
                    summary: meta.summary || `Comprehensive study of ${t} with examples and revision notes.`,
                    description: meta.description || '',
                    thesis: (cat === 'literature') ? (meta.thesis || generateThesis(t, meta)) : (meta.thesis || ''),
                    resources: Array.from(new Set([...(meta.resources || []), { title: `YouTube: Search for ${t}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}` }].map(JSON.stringify))).map(JSON.parse),
                    // Use thumbnail from metadata if provided; otherwise generate a small SVG data-URL that includes the course title
                    thumbnail: meta.thumbnail || svgDataUrlForTitle(t),
                    lessons: mkLessons(cat, t),
                })
            }
        }
        await CourseModel.insertMany(docs)
    }
    const courses = await CourseModel.find({}).lean()
    if (await Exam.countDocuments() === 0) { await Exam.insertMany(courses.map(c => ({ title: c.title + ' – Exam', category: c.category, course: c._id, durationMinutes: 30, questions: Array.from({ length: 18 }, (_, i) => ({ question: `${c.title} Exam Q${i + 1}: Choose the correct option.`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answerIndex: Math.floor(Math.random() * 4) })) }))) }
    if (await PracticePaper.countDocuments() === 0) { const list = []; for (const c of courses) { for (let p = 1; p <= 3; p++) { list.push({ title: `${c.title} – Practice Set ${p}`, category: c.category, course: c._id, durationMinutes: 35, questions: Array.from({ length: 14 }, (_, i) => ({ question: `${c.title} Practice Q${i + 1}: Pick the right answer.`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answerIndex: Math.floor(Math.random() * 4) })) }) } } await PracticePaper.insertMany(list) }
    console.log('✅ Seed complete')
}
