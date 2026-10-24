import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Doctor Tracker | Care Guide BD', description: 'Doctor and patient administration dashboard' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
