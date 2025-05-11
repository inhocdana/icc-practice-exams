import React from "react";

export default function Disclaimer() {
  return (
    <main className="p-8 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="mb-4">
        This website is an independent educational tool and is not affiliated
        with, endorsed by, or connected in any way to the International Code Council (ICC).
      </p>
      <p className="mb-4">
        The practice exams provided here are designed solely to help individuals
        prepare for ICC certification exams by testing their familiarity with the
        content of specific code books, such as the International Property Maintenance Code (IPMC).
      </p>
      <p className="mb-4">
        No continuing education credits (CEUs) are awarded, and completing these
        quizzes does not result in any certification or official recognition by
        the ICC or any governing body.
      </p>
      <p className="mb-4">
        All content is provided for informational and study purposes only. Users
        are responsible for verifying current code requirements and exam
        standards with the ICC or relevant local authority.
      </p>
      <p className="mb-4">
        Dana Testing Services makes no warranties as to the accuracy, completeness,
        or suitability of the material for any particular purpose.
      </p>
    </main>
  );
}
