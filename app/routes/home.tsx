import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { Link } from "react-router";
// Import your mock resumes
import { resumes as mockResumes } from "../../constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const loadAuthedResumes = async () => {
      setLoadingResumes(true);
      const items = (await kv.list("resume:*", true)) as KVItem[];
      const parsed = items?.map((it) => JSON.parse(it.value) as Resume);
      setResumes(parsed || []);
      setLoadingResumes(false);
    };

    if (auth.isAuthenticated) {
      loadAuthedResumes();
    } else {
      // Use mock resumes for visitors
      setResumes(mockResumes);
      setLoadingResumes(false);
    }
  }, [auth.isAuthenticated, kv]);

  const handleRemoveResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications and Resume Ratings</h1>
          {!auth.isAuthenticated ? (
            <h2>Explore sample CVs and see how feedback looks. Log in to analyze your own.</h2>
          ) : !loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col justify-center items-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={auth.isAuthenticated ? handleRemoveResume : undefined}
              />
            ))}
          </div>
        )}

        {auth.isAuthenticated && !loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}

        {!auth.isAuthenticated && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/auth?next=/" className="primary-button w-fit text-xl font-semibold">
              Log In to Analyze Yours
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
