import BoardList from "./BoardList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Bright Future School</h1>
        <p>Teacher Task Board — organise class projects and tasks in one place</p>
      </header>
      <main className="app-main">
        <BoardList />
      </main>
      <footer className="app-footer">© Bright Future School · Internal staff use</footer>
    </div>
  );
}

export default App;