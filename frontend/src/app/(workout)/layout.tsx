import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Workout | FitVision',
  description: 'Suivez vos entraînements en temps réel',
};

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-background to-background-dark">
        {children}
      </div>
    </Suspense>
  );
}
