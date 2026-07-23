import './globals.css';
import { ToastProvider } from '../components/Toast';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'SkillMesh — Verified Skill Portfolio',
  description: 'Build your professional portfolio with real, peer-verified work and tasks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
