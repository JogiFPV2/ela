import { useMediaQuery } from 'react-responsive';
import { Navbar } from './Navbar';
import { MobileNavbar } from './MobileNavbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <div className="min-h-screen bg-gray-50">
      {isDesktop ? <Navbar /> : <MobileNavbar />}
      <main className={`${isDesktop ? 'p-8 pt-24' : 'p-4 pt-32'}`}>
        <div className={`${isDesktop ? 'max-w-7xl mx-auto' : 'w-full'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
