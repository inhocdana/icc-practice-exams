import React from "react";
import { useUser } from "./UserContext"; // ✅ Make sure this path matches your project
import { supabase } from "./supabaseClient";

export default function Homepage() {
  const { user, loading } = useUser();
  console.log("User in Homepage:", user);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                ICC Exam Prep
              </span>
            </div>
            <div className="flex items-center">
              {!loading && (
                <div className="text-sm">
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700">
                        Welcome,{" "}
                        <span className="font-medium">{user.email}</span>
                      </span>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800 font-medium transition duration-150"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <a
                      href="/auth"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Sign In
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Master Your ICC Certification Exam
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Practice with realistic quizzes based on the International
                Property Maintenance Code (IPMC) and other ICC code books.
              </p>
              <div>
                <a
                  href={user ? "/exams" : "/auth"}
                  className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300"
                >
                  {user ? "Start Practicing Now" : "Create Free Account"}
                </a>
              </div>
            </div>
            <div className="md:w-1/2 bg-blue-600 p-8 md:p-12 flex items-center justify-center">
              <div className="text-white">
                <div className="text-2xl font-bold mb-4">Why Choose Us?</div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Code-specific questions with detailed explanations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Practice by chapter or take full-length exams</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Track your progress and identify weak areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Code Book",
                description:
                  "Select from IPMC and other ICC code books (more coming soon)",
                icon: (
                  <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Practice Questions",
                description: "Take quizzes by section or full practice exams",
                icon: (
                  <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Review Explanations",
                description:
                  "Learn from detailed, code-referenced explanations",
                icon: (
                  <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                step: "4",
                title: "Pass Your Exam",
                description: "Enter your certification exam with confidence",
                icon: (
                  <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Quiz Results Preview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Sample Quiz Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Question 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <p className="font-semibold text-lg">Question 1:</p>
                <p>What structures does the IPMC apply to?</p>
              </div>
              <div className="p-4">
                <ul className="space-y-2 mb-4">
                  <li className="p-2 rounded bg-gray-50">
                    A. Only new construction
                  </li>
                  <li className="p-2 rounded bg-gray-50">
                    B. Only historic buildings
                  </li>
                  <li className="p-2 rounded bg-green-50 border border-green-200 font-medium text-green-800">
                    C. Existing residential and nonresidential structures ✓
                  </li>
                  <li className="p-2 rounded bg-gray-50">
                    D. Temporary structures only
                  </li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Explanation:</span> The IPMC
                    applies to existing residential and nonresidential
                    structures to ensure maintenance and safety standards are
                    upheld. (Ref: Section 101.2)
                  </p>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <p className="font-semibold text-lg">Question 2:</p>
                <p>
                  Who is responsible for the maintenance of a building according
                  to the IPMC?
                </p>
              </div>
              <div className="p-4">
                <ul className="space-y-2 mb-4">
                  <li className="p-2 rounded bg-gray-50">
                    A. The previous owner
                  </li>
                  <li className="p-2 rounded bg-green-50 border border-green-200 font-medium text-green-800">
                    B. The current owner or property manager ✓
                  </li>
                  <li className="p-2 rounded bg-gray-50">
                    C. The original builder
                  </li>
                  <li className="p-2 rounded bg-gray-50">
                    D. The local government authority
                  </li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Explanation:</span> The code
                    holds the current property owner or designated agent
                    responsible for ensuring the building is maintained in
                    accordance with the code. (Ref: Section 107.1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href={user ? "/exams" : "/auth"}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              {user ? "Try More Questions" : "Sign Up to Practice"}
            </a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This platform helped me pass my Property Maintenance Inspector certification on the first try. The practice questions were spot-on!",
                author: "Michael T.",
                role: "Building Inspector",
              },
              {
                quote:
                  "I was struggling with certain sections of the IPMC, but the detailed explanations for each question really helped me understand the code better.",
                author: "Sarah L.",
                role: "Code Enforcement Officer",
              },
              {
                quote:
                  "Being able to practice by chapter made it easy to focus on my weak areas. Highly recommend for anyone preparing for ICC exams.",
                author: "Robert J.",
                role: "Property Manager",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">ICC Exam Prep</h3>
              <p className="text-gray-400">
                Helping professionals prepare for and pass their ICC
                certification exams with confidence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/exams"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Exams
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li> */}
                <li>
                  <a
                    href="mailto:help@iccpracticeexams.com"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Dana Testing Services. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
