import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const AuthLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  // Ensure theme matches the rest of the site (default to saved or prefers-color-scheme)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldDark);
    setHydrated(true);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Illustration panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-purple-400/10 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-700/10">
        {/* Gradient blob */}
        <svg className="absolute -top-24 -left-24 h-[48rem] w-[48rem] opacity-30 blur-3xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path fill="url(#g)" d="M47.6,-60.2C60.4,-51.3,68.5,-36.7,72.8,-21.2C77.1,-5.6,77.5,11,71.1,25.1C64.7,39.3,51.4,50.9,36.9,59.1C22.5,67.2,6.9,71.8,-8.2,72C-23.3,72.1,-46.7,67.7,-59.5,55.1C-72.2,42.5,-74.3,21.8,-71.6,3.1C-69,-15.7,-61.6,-31.4,-50.2,-41.9C-38.8,-52.5,-23.4,-58,-7.6,-64.2C8.3,-70.4,25.7,-77.1,47.6,-60.2Z" transform="translate(100 100)" />
        </svg>

        {/* Dotted grid */}
        <div className="absolute inset-0 bg-[radial-gradient(theme(colors.purple.500)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/forticoreLogo.svg" alt="FortiCore" className="h-8 w-8" />
            <span className="text-xl font-semibold">FortiCore</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold mb-4">Secure your apps with confidence</h2>
            <p className="text-muted-foreground max-w-md">
              FortiCore provides automated security testing with a simple workflow. Sign in to access your dashboard and get started.
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FortiCore. All rights reserved.
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-heading font-semibold mb-6 text-center">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};


