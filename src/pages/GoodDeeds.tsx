
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCard from "@/components/good-deeds/StatsCard";
import AddGoodDeedButton from "@/components/good-deeds/AddGoodDeedButton";
import AddGoodDeedDialog from "@/components/good-deeds/AddGoodDeedDialog";
import { getGoodDeedsStats, getApprovedGoodDeeds } from "@/lib/api/good-deeds";
import GoodDeedItem from "@/components/good-deeds/GoodDeedItem";

const GoodDeeds = () => {
  const [stats, setStats] = useState({ total_count: 0, today_count: 0 });
  const [approvedGoodDeeds, setApprovedGoodDeeds] = useState<
    Array<{
      id: string;
      title?: string;
      description?: string;
      author_name?: string | null;
      created_at?: string;
    }>
  >([]);

  const loadStatsAndDeeds = useCallback(async () => {
    try {
      const [statsData, deedsData] = await Promise.all([getGoodDeedsStats(), getApprovedGoodDeeds()]);
      setStats(statsData);
      setApprovedGoodDeeds(deedsData);
    } catch (error) {
      console.error("Error loading stats or deeds:", error);
    }
  }, []);

  useEffect(() => {
    loadStatsAndDeeds();
  }, [loadStatsAndDeeds]);

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
            onAdd={loadStatsAndDeeds}
          />

          <div className="pt-4 flex justify-center space-x-4">
            <AddGoodDeedButton onAdd={loadStatsAndDeeds} />
            {/* Диалогът е запазен за по-детайлно добавяне, по желание */}
            <AddGoodDeedDialog onAdd={loadStatsAndDeeds} />
          </div>

          <section className="pt-8">
            <h2 className="text-2xl font-semibold mb-4">Одобрени добри дела</h2>
            {approvedGoodDeeds.length === 0 ? (
              <p className="text-center text-gray-600">Все още няма одобрени добри дела.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {approvedGoodDeeds.map((deed) => (
                  <GoodDeedItem
                    key={deed.id}
                    title={deed.title}
                    description={deed.description}
                    authorName={deed.author_name}
                    createdAt={deed.created_at}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GoodDeeds;
