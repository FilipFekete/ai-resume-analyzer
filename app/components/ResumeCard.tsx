import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ScoreCircle from '~/components/ScoreCircle';
import { usePuterStore } from '~/lib/puter';

type ResumeCardProps = {
  resume: Resume;
  onDelete?: (id: string) => void;
};

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
  onDelete,
}: ResumeCardProps) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');
  const [useLinkWrapper, setUseLinkWrapper] = useState(true);

  useEffect(() => {
    let revoked = false;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      // If it's a public static asset, use it directly
      if (typeof imagePath === 'string' && imagePath.startsWith('/')) {
        setResumeUrl(imagePath);
        // For public assets, allow navigation (e.g., mock cards)
        setUseLinkWrapper(true);
        return;
      }

      // Otherwise, try reading from fs (user-uploaded)
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        objectUrl = URL.createObjectURL(blob);
        if (!revoked) setResumeUrl(objectUrl);
        setUseLinkWrapper(true);
      } catch {
        // If reading fails (e.g., logged out), show nothing and disable navigation
        setResumeUrl('');
        setUseLinkWrapper(false);
      }
    };

    loadImage();

    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imagePath, fs]);

  const handleDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(id);
  };

  const CardInner = (
    <div className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
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
    </div>
  );

  return (
    <div className="relative">
      {onDelete && (
        <button
          type="button"
          aria-label="Remove resume"
          onClick={handleDeleteClick}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-200 shadow p-1 w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      )}

      {useLinkWrapper ? (
        <Link to={`/resume/${id}`}>{CardInner}</Link>
      ) : (
        <div>{CardInner}</div>
      )}
    </div>
  );
};

export default ResumeCard;