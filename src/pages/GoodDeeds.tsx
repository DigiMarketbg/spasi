
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCard from "@/components/good-deeds/StatsCard";
import AddGoodDeedDialog from "@/components/good-deeds/AddGoodDeedDialog";
import { getGoodDeedsStats, getApprovedGoodDeeds } from "@/lib/api/good-deeds";
import GoodDeedItem from "@/components/good-deeds/GoodDeedItem";
import { Input } from "@/components/ui/input";

const GoodDeeds = () => {
  const [stats, setStats] = useState({
    total_count: 0,
    today_count: 0
  });
  const [approvedGoodDeeds, setApprovedGoodDeeds] = useState<Array<{
    id: string;
    description?: string;
    author_name?: string | null;
    created_at?: string;
    title?: string | null;
  }>>([]);
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  // Removed descriptionSearchTerm to have only one search input
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
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter approved good deeds only by title search term now
  const filteredGoodDeeds = approvedGoodDeeds.filter(deed => {
    return titleSearchTerm.trim() === '' || deed.title?.toLowerCase().includes(titleSearchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20 pt-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black">Добрини</h1>
            <p className="text-muted-foreground">
              Нека заедно направим света по-добро място, една малка стъпка наведнъж.
            </p>
          </div>

          <StatsCard totalCount={stats.total_count} todayCount={stats.today_count} onAdd={() => setDialogOpen(true)} />

          <AddGoodDeedDialog onAdd={loadStatsAndDeeds} open={dialogOpen} onOpenChange={setDialogOpen} />

          <section className="pt-8">
            <h2 className="text-2xl font-semibold mb-4">Одобрени добри дела</h2>

            {/* Single search input optimized for mobile */}
            <Input 
              placeholder="Търсене по заглавие..." 
              value={titleSearchTerm} 
              onChange={e => setTitleSearchTerm(e.target.value)} 
              className="mb-6 bg-background max-w-md mx-auto block" 
            />

            {filteredGoodDeeds.length === 0 ? (
              <p className="text-center text-gray-600">Няма одобрени добри дела, които да отговарят на търсенето.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {filteredGoodDeeds.map(deed => (
                  <div key={deed.id} className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    {deed.title && <h3 className="mb-2 font-semibold text-black">{deed.title}</h3>}
                    <GoodDeedItem description={deed.description} authorName={deed.author_name} createdAt={deed.created_at} />
                  </div>
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

