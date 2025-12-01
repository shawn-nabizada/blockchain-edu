import { useState } from "react";
import { Introduction } from "./pages/Introduction";
import { Sandbox } from "./pages/Sandbox";
import { WrapUp } from "./pages/WrapUp";

type AppState = "intro" | "sandbox" | "wrapup";

function App() {
  const [view, setView] = useState<AppState>("intro");

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* View 1: Theory */}
      {view === "intro" && (
        <Introduction onComplete={() => setView("sandbox")} />
      )}

      {/* View 2: Sandbox */}
      {view === "sandbox" && (
        <div className="relative">
          <Sandbox />
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setView("wrapup")}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl font-bold hover:bg-slate-800 transition-transform active:scale-95"
            >
              Finish & Review →
            </button>
          </div>
        </div>
      )}

      {/* View 3: Wrap Up */}
      {view === "wrapup" && (
        <WrapUp onRestart={() => setView("intro")} />
      )}
    </div>
  );
}

export default App;