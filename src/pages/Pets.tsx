
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetItem from "@/components/pets/PetItem";
import PetForm from "@/components/pets/PetForm";
import { fetchApprovedPetPosts } from "@/lib/api/pets";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import PetsBackgroundEffects from "@/components/pets/PetsBackgroundEffects";

const Pets = () => {
  const [pets, setPets] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setDialogOpen(false);
    loadPets();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1F2C] relative overflow-hidden">
      <PetsBackgroundEffects />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20 pt-10 max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-700 mb-2">Домашни Любимци</h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Тук можете да публикувате сигнали за намерени, изхвърлени или загубени домашни любимци. След преглед и одобрение, публикациите ще се покажат тук и ще помогнат на хората да ги намерят, вземат или осиновят.
          </p>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4" size="lg" variant="default">
                Добави домашен любимец
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg sm:max-w-xl lg:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-lime-700 text-xl font-semibold">
                  Добави домашен любимец
                </DialogTitle>
              </DialogHeader>
              <PetForm onSuccess={onSuccess} />
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-lime-700 hover:bg-lime-100"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        <section className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Зареждане...</p>
          ) : pets.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Все още няма добавени домашни любимци.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
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

