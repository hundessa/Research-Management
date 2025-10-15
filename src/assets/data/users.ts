interface Users {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
}

interface Roles {
  name: string;
  amount: number;
  percent: number;
}

interface Researches {
    researchName: string,
    researchType: string,
    status: string
}

export const users: Users[] = [
  {
    firstname: "John",
    lastname: "Michael",
    email: "john@creative-tim.com",
    role: "Manager",
    status: "Active",
  },
  {
    firstname: "Alexa",
    lastname: "Liras",
    email: "alexa@creative-tim.com",
    role: "Designer",
    status: "Inactive",
  },
  {
    firstname: "Laurent",
    lastname: "Perrier",
    email: "laurent@creative-tim.com",
    role: "Executive",
    status: "Inactive",
  },
  {
    firstname: "Michael",
    lastname: "Levi",
    email: "michael@creative-tim.com",
    role: "Designer",
    status: "Active",
  },
  {
    firstname: "John",
    lastname: "Michael",
    email: "john@creative-tim.com",
    role: "Manager",
    status: "Active",
  },
  {
    firstname: "Alexa",
    lastname: "Liras",
    email: "alexa@creative-tim.com",
    role: "Designer",
    status: "Inactive",
  },
  {
    firstname: "Laurent",
    lastname: "Perrier",
    email: "laurent@creative-tim.com",
    role: "Executive",
    status: "Inactive",
  },
  {
    firstname: "Michael",
    lastname: "Levi",
    email: "michael@creative-tim.com",
    role: "Designer",
    status: "Active",
  },
  {
    firstname: "Johnnnnn",
    lastname: "Michael",
    email: "john@creative-tim.com",
    role: "Manager",
    status: "Active",
  },
  {
    firstname: "Alexa",
    lastname: "Liras",
    email: "alexa@creative-tim.com",
    role: "Designer",
    status: "Inactive",
  },
  {
    firstname: "Laurent",
    lastname: "Perrier",
    email: "laurent@creative-tim.com",
    role: "Executive",
    status: "Inactive",
  },
  {
    firstname: "Michael",
    lastname: "Levi",
    email: "michael@creative-tim.com",
    role: "Designer",
    status: "Active",
  },
];

export const roles: Roles[] = [
  { name: "Researcher", amount: 1, percent: 35 },
  { name: "Dean", amount: 6, percent: 35 },
  { name: "Coordinator", amount: 5, percent: 35 },
  { name: "Directorate", amount: 4, percent: 35 },
  { name: "Finance", amount: 2, percent: 35 },
];


export const researches: Researches[] = [
  {
    researchName:
      "The Impact of Artificial Intelligence on Healthcare: Opportunities and Challenges",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Sustainable Urban Development: Strategies for Green Cities in the 21st Century",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Blockchain Technology in Supply Chain Management: Enhancing Transparency and Security",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Exploring the Role of Social Media in Shaping Public Opinion during Political Campaigns",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "The Future of Renewable Energy: Innovations in Solar Power and Energy Storage Systems",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Cybersecurity Threats and Solutions: A Comprehensive Review of Emerging Risks and Countermeasures",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "The Influence of Digital Learning Platforms on Student Engagement and Academic Performance",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Understanding the Economic Effects of Remote Work on Global Business Practices",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Mental Health in the Digital Age: The Impact of Social Media on Adolescent Well-being",
    researchType: "Normal Research",
    status: "Under Defence",
  },
  {
    researchName:
      "Advancements in Machine Learning for Predictive Analytics in Financial Markets",
    researchType: "Normal Research",
    status: "Under Defence",
  },
];