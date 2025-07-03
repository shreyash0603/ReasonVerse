import ReasoningPage from '@/components/reasoning-page';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col">
        <ReasoningPage />
      </main>
    </div>
  );
}
