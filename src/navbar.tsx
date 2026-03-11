import React from 'react';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <nav className="w-full bg-[#2b1b0c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="font-bold text-amber-100 tracking-wide">☕️ Random Coffee</div>
                        <div className="h-6 w-px bg-amber-500/40" />
                        <div className="flex gap-2 rounded-full bg-amber-900/30 p-1 shadow-inner">
                            {navItems.map((item) => {
                                const active = item.href === currentPath;
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                            active
                                                ? 'bg-amber-200 text-amber-900 shadow-sm'
                                                : 'text-amber-100 hover:bg-amber-200/30 hover:text-amber-50'
                                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}