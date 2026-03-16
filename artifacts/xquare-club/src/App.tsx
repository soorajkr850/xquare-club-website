import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import InfluencerOnboarding from "@/pages/InfluencerOnboarding";

const queryClient = new QueryClient();

function Router() {
  const path = window.location.pathname;
  if (path === "/influencer-onboarding") return <InfluencerOnboarding />;
  return <Landing />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
