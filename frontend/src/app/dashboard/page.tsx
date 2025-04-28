import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-500">Ici vous retrouverez toutes vos annonces et messages.</p>
      </main>
    </>
  );
}
