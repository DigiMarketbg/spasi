
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCard from "@/components/good-deeds/StatsCard";
import AddGoodDeedDialog from "@/components/good-deeds/AddGoodDeedDialog";
import { getGoodDeedsStats } from "@/lib/api/good-deeds";

const GoodDeeds = () => {
  const [stats, setStats] = useState({ total_count: 0, today_count: 0 });

  const loadStats = useCallback(async () => {
    try {
      const data = await getGoodDeedsStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20 pt-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Добрини</h1>
            <p className="text-muted-foreground">
              Нека заедно направим света по-добро място, една малка стъпка наведнъж.
            </p>
          </div>

          <StatsCard
            totalCount={stats.total_count}
            todayCount={stats.today_count}
            onAdd={loadStats}
          />

          <div className="pt-4 flex justify-center">
            <AddGoodDeedDialog onAdd={loadStats} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GoodDeeds;
