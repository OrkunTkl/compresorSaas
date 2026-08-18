import LandingCTA from "../../../components/Landing/LandingCTA";
import LandingFaq from "../../../components/Landing/LandingFaq";
import LandingFooter from "../../../components/Landing/LandingFooter";
import LandingHeader from "../../../components/Landing/LandingHeader";
import LandingHero from "../../../components/Landing/LandingHero";
import LandingHowDoesItWork from "../../../components/Landing/LandingHowDoesItWork";
import LandingPlan from "../../../components/Landing/LandingPlan";
import LandingPreview from "../../../components/Landing/LandingPreview";
import LandingProblem from "../../../components/Landing/LandingProblem";

const Landingpage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingHowDoesItWork />
        <LandingPreview />
        <LandingPlan />
        <LandingFaq />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landingpage;
