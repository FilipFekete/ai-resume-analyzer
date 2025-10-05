import React, {useEffect} from 'react'
import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])


const Auth = () => {

    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next  = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) {
            navigate(next);
        }
    }, [auth.isAuthenticated, next])

    return (
        // Add top padding to avoid content being hidden behind the fixed navbar
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col pt-16">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between ">
                        <Link to="/" className="back-button flex items-center gap-2">
                            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                            <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                        </Link>

                        <Link to="/" className="block">
                            <p className="text-2xl font-bold text-gradient pr-10 sm:pr-14 lg:pr-20">RESUMIND</p>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Split layout: left quote, right login card */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                {/* Left: witty original quote */}
                <section className="flex items-center justify-center px-8 py-12">
                    <blockquote className="max-w-2xl text-center lg:text-left">
                        <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                            “In a world of fast scrolling, your CV is a six-second commercial. Make sure the call-to-action is an interview.”
                        </p>
                        <footer className="mt-4 text-gray-600 font-medium">— ChatGPT</footer>
                    </blockquote>
                </section>

                {/* Right: login card */}
                <section className="flex items-center justify-center px-6 py-12">
                    <div className="gradient-border shadow-lg rounded-2xl">
                        <div className="flex flex-col gap-8 bg-white rounded-2xl p-8 sm:p-10 w-full max-w-md box-border overflow-hidden">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1>Welcome</h1>
                                <h2>Log In to Continue Your Job Journey</h2>
                            </div>

                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <button className="auth-button w-full animate-pulse" disabled>
                                        <p>Signing you in...</p>
                                    </button>
                                ) : (
                                    <>
                                        {auth.isAuthenticated ? (
                                            <button className="auth-button w-full" onClick={auth.signOut}>
                                                <p>Log Out</p>
                                            </button>
                                        ) : (
                                            <button className="auth-button w-full" onClick={auth.signIn}>
                                                <p>Log In</p>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
export default Auth

