import React from "react";
import { useUser } from "./UserContext"; // ✅ Make sure this path matches your project
import { supabase } from "./supabaseClient";


export default function Homepage() {
  const { user, loading } = useUser()
console.log("User in Homepage:", user);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      {/* User Greeting */}
      {!loading && (
        <div className="text-right text-sm text-gray-600 mb-4">
          {user ? (
            <>
              Welcome, {user.email}!{" "}
              <button
                onClick={handleLogout}
                className="text-red-500 underline ml-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>You are not logged in.</>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Prepare with Confidence for Your ICC Certification Exam
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Practice realistic quizzes based on the International Property
          Maintenance Code (IPMC) and other ICC code books (coming soon).
        </p>
        <a
          href={user ? "/exams" : "/auth"}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 inline-block text-lg"
        >
          {user ? "Go to Exams" : "Get Started Now"}
        </a>
      </section>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Pick your ICC code book and drill down by chapter or section</li>
          <li>
            Practice real-world multiple-choice questions — by section or
            full-book exams
          </li>
          <li>
            Understand every mistake with clear, code-referenced explanations
          </li>
          <li>Walk into your ICC exam confident and fully prepared</li>
        </ul>
      </section>

      {/* Sample Quiz Results Preview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Sample Results Preview</h2>

        {/* Question 1 */}
        <div className="border rounded p-4 mb-6 shadow-sm">
          <p className="font-medium">Question 1:</p>
          <p className="mb-2">What structures does the IPMC apply to?</p>
          <ul className="list-none space-y-1 mb-2">
            <li>A. Only new construction</li>
            <li>B. Only historic buildings</li>
            <li className="font-bold text-green-600">
              C. Existing residential and nonresidential structures ✅
            </li>
            <li>D. Temporary structures only</li>
          </ul>
          <p className="text-sm text-gray-600">
            Explanation: The IPMC applies to existing residential and
            nonresidential structures to ensure maintenance and safety standards
            are upheld. (Ref: Section 101.2)
          </p>
        </div>

        {/* Question 2 */}
        <div className="border rounded p-4 shadow-sm">
          <p className="font-medium">Question 2:</p>
          <p className="mb-2">
            Who is responsible for the maintenance of a building according to
            the IPMC?
          </p>
          <ul className="list-none space-y-1 mb-2">
            <li>A. The previous owner</li>
            <li className="font-bold text-green-600">
              B. The current owner or property manager ✅
            </li>
            <li>C. The original builder</li>
            <li>D. The local government authority</li>
          </ul>
          <p className="text-sm text-gray-600">
            Explanation: The code holds the current property owner or designated
            agent responsible for ensuring the building is maintained in
            accordance with the code. (Ref: Section 107.1)
          </p>
        </div>
      </section>
    </main>
  );
}
