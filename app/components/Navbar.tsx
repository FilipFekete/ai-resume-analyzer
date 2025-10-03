import React from 'react';
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>

            <div className="flex items-center gap-3">
                <Link 
                    to={auth.isAuthenticated ? "/upload" : "/auth?next=/upload"} 
                    className="primary-button w-fit"
                >
                    Upload Resume
                </Link>

                <Link
                    to="/auth?next="
                    className="secondary-button w-fit"
                    aria-label={auth.isAuthenticated ? "Log out" : "Log in"}
                >
                    {auth.isAuthenticated ? "Log out" : "Log in"}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
