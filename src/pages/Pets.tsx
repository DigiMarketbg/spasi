
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetItem from "@/components/pets/PetItem";
import PetForm from "@/components/pets/PetForm";
import { fetchApprovedPetPosts } from "@/lib/api/pets";
import { useAuth } from "@/components/AuthProvider";

const Pets = () => {
  const [pets, setPets] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20 pt-10 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-700 mb-2">Домашни Любимци</h1>
          <p className="text-muted-foreground">
            Прегледайте и добавете Вашите любими домашни любимци. След преглед, одобрените публикации ще бъдат показани тук.
          </p>
        </div>

        <PetForm onSuccess={loadPets} />

        <section className="mt-12">
          {loading ? (
            <p className="text-center text-gray-500">Зареждане...</p>
          ) : pets.length === 0 ? (
            <p className="text-center text-gray-600">Все още няма добавени домашни любимци.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
