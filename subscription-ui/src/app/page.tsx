import SubscriptionTable from "@/components/SubscriptionTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Subscription UI</h1>
      <p className="mt-4 text-lg">Welcome to the Subscription UI!</p>
      <SubscriptionTable />
    </main>
  );
}
