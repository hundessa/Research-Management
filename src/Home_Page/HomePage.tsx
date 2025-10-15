import {
  FaUniversity,
  FaUserGraduate,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const ResearchLandingPage = () => {
  // Sample research data
  const featuredResearches = [
    {
      id: 1,
      title: "Machine Learning in Healthcare",
      author: "Dr. Sarah Johnson",
      date: "2023-05-15",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Exploring the applications of deep learning algorithms for early disease detection in medical imaging.",
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions",
      author: "Prof. Michael Chen",
      date: "2023-03-22",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Innovative approaches to renewable energy storage and distribution for urban environments.",
    },
    {
      id: 3,
      title: "Blockchain in Financial Systems",
      author: "Dr. Emma Rodriguez",
      date: "2023-01-10",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Examining the impact of decentralized ledger technology on traditional banking systems.",
    },
    {
      id: 1,
      title: "Machine Learning in Healthcare",
      author: "Dr. Sarah Johnson",
      date: "2023-05-15",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Exploring the applications of deep learning algorithms for early disease detection in medical imaging.",
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions",
      author: "Prof. Michael Chen",
      date: "2023-03-22",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Innovative approaches to renewable energy storage and distribution for urban environments.",
    },
    {
      id: 3,
      title: "Blockchain in Financial Systems",
      author: "Dr. Emma Rodriguez",
      date: "2023-01-10",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt:
        "Examining the impact of decentralized ledger technology on traditional banking systems.",
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <FaUniversity className="h-8 w-8 text-blue-600" />
                  <span className="font-semibold text-gray-900 text-lg ml-2">
                    Research Portal
                  </span>
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="#featured"
                className="py-4 px-2 text-gray-700 hover:text-blue-600"
              >
                Featured Research
              </a>
              <a
                href="#about"
                className="py-4 px-2 text-gray-700 hover:text-blue-600"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="py-4 px-2 text-gray-700 hover:text-blue-600"
              >
                Contact
              </a>
              <a
                href="/login"
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Advancing Knowledge Through Research
          </h1>
          <p className="text-xl mb-12">
            Discover groundbreaking studies from our academic community
          </p>
          <a
            href="#featured"
            className="bg-white text-blue-700 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300"
          >
            Explore Research
          </a>
        </div>
      </section>

      {/* Featured Research Section */}
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Featured Research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResearches.map((research) => (
              <div
                key={research.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <img
                  src={research.image}
                  alt={research.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {research.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaUserGraduate className="mr-2" />
                    <span>{research.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(research.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{research.excerpt}</p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="/research"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition duration-300"
            >
              View All Research
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            About Our Research Center
          </h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="Research Team"
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 mb-4">
                We are dedicated to fostering innovative research that addresses
                global challenges and pushes the boundaries of human knowledge.
                Our interdisciplinary approach brings together experts from
                various fields to collaborate on cutting-edge projects.
              </p>
              <p className="text-gray-700 mb-4">
                Since our founding in 2010, we've published over 500
                peer-reviewed papers and secured numerous patents for
                groundbreaking technologies.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-bold text-blue-600">500+</h4>
                  <p className="text-gray-600">Published Papers</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-bold text-blue-600">120+</h4>
                  <p className="text-gray-600">Research Projects</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-bold text-blue-600">50+</h4>
                  <p className="text-gray-600">Patents</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-bold text-blue-600">30+</h4>
                  <p className="text-gray-600">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Contact Us
          </h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600">
                      123 Research Avenue, Innovation City, IC 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">contact@researchportal.edu</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600">
                    <FaTwitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-blue-700 hover:text-blue-900">
                    <FaFacebook className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Research Portal</h3>
              <p className="text-gray-400">
                Advancing knowledge through innovative research and
                collaboration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#featured"
                    className="text-gray-400 hover:text-white"
                  >
                    Research
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Research Areas</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Artificial Intelligence
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Biotechnology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Renewable Energy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Data Science
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Subscribe</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest research news.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Research Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResearchLandingPage;