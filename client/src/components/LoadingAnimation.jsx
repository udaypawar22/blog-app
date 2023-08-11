import Lottie from "lottie-react";
import loadingicon from "../assets/animation_ll3zm4bg.json";

export default function LoadingAnimation() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Lottie animationData={loadingicon} style={{ width: "60px" }} />
    </div>
  );
}
