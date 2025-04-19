
import { useNavigate } from "react-router-dom";
import { Award, Eye, HandHeart, Heart } from "lucide-react";
import HubButton from "@/components/profile/HubButton";

const FeatureButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      <HubButton
        icon={Heart}
        label="Спасители"
        onClick={() => navigate("/rescuers")}
      />
      <HubButton
        icon={HandHeart}
        label="Доброволци"
        onClick={() => navigate("/volunteers")}
      />
      <HubButton
        icon={Award}
        label="Опасни Участъци"
        onClick={() => navigate("/dangerous-areas")}
      />
      <HubButton
        icon={Eye}
        label="Свидетели"
        onClick={() => navigate("/witnesses")}
      />
      <HubButton
        icon={HandHeart}
        label="Към добрините"
        onClick={() => navigate("/good-deeds")}
      />
    </div>
  );
};

export default FeatureButtons;
