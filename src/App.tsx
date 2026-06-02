import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { DailyPracticePage } from "./pages/DailyPracticePage";
import { HomePage } from "./pages/HomePage";
import { MistakeReviewPage } from "./pages/MistakeReviewPage";
import { SpecialPracticePage } from "./pages/SpecialPracticePage";

type AppPage = "home" | "daily" | "special" | "mistakes";

export default function App() {
  const [page, setPage] = useState<AppPage>("home");

  return (
    <div className="app-shell">
      <TopBar onHome={() => setPage("home")} />
      {page === "home" ? (
        <HomePage
          onDaily={() => setPage("daily")}
          onSpecial={() => setPage("special")}
          onMistakes={() => setPage("mistakes")}
        />
      ) : null}
      {page === "daily" ? <DailyPracticePage onExit={() => setPage("home")} /> : null}
      {page === "special" ? <SpecialPracticePage onExit={() => setPage("home")} /> : null}
      {page === "mistakes" ? <MistakeReviewPage onExit={() => setPage("home")} /> : null}
    </div>
  );
}
