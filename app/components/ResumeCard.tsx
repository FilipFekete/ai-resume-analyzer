import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {usePuterStore} from "~/lib/puter";

type ResumeCardProps = {
    resume: Resume;
    onDelete?: (id: string) => void;
};

const ResumeCard = ({resume:{ id, companyName, jobTitle, feedback, imagePath}, onDelete} : ResumeCardProps) => {

    const { fs, auth } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResumes = async () => {
            // If user is not authenticated, use the imagePath directly as a public asset
            if (!auth.isAuthenticated) {
                setResumeUrl(imagePath);
                return;
            }

            // For authenticated users, read from filesystem
            try {
                const blob = await fs.read(imagePath);
                if(!blob) return;
                let url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (error) {
                console.error('Error loading image:', error);
                // Fallback to direct path if filesystem read fails
                setResumeUrl(imagePath);
            }
        }

        loadResumes();

        // Cleanup function to revoke object URLs
        return () => {
            if (resumeUrl && resumeUrl.startsWith('blob:')) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [imagePath, auth.isAuthenticated]);

    return (
        <div className="relative">

            <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        {companyName && <h2 className="!text-black font-bold break-words">
                            {companyName}
                        </h2>}
                        {jobTitle && <h3 className="text-lg break-words text-gray-500">
                            {jobTitle}
                        </h3>}
                        {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                {resumeUrl && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            />
                        </div>
                    </div>
                )}
            </Link>
        </div>
    )
}
export default ResumeCard