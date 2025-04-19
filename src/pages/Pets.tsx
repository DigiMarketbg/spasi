
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetItem from "@/components/pets/PetItem";
import PetForm from "@/components/pets/PetForm";
import { fetchApprovedPetPosts } from "@/lib/api/pets";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

const Pets = () => {
  const [pets, setPets] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await fetchApprovedPetPosts();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const onSuccess = () => {
    setSheetOpen(false);
    loadPets();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20 pt-10 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-700 mb-2">Домашни Любимци</h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Тук можете да публикувате сигнали за намерени, изхвърлени или загубени домашни любимци. След преглед и одобрение, публикациите ще се покажат тук и ще помогнат на хората да ги намерят, вземат или осиновят.
          </p>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="mt-4" size="lg" variant="default" >
                Добави домашен любимец
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="pb-10">
              <SheetHeader>
                <SheetTitle>Добави домашен любимец</SheetTitle>
              </SheetHeader>
              <PetForm onSuccess={onSuccess} />
              <SheetFooter />
            </SheetContent>
          </Sheet>
        </div>

        <section className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Зареждане...</p>
          ) : pets.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Все още няма добавени домашни любимци.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map(pet => (
                <PetItem
                  key={pet.id}
                  id={pet.id}
                  title={pet.title}
                  description={pet.description}
                  imageUrl={pet.image_url}
                  createdAt={pet.created_at}
                  isApproved={pet.is_approved}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pets;

