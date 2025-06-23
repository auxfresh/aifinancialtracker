export default function Diagnostic() {
  console.log("Diagnostic component loaded");
  
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      color: "#00ff00",
      fontFamily: "monospace",
      padding: "20px",
      zIndex: 9999
    }}>
      <h1>DIAGNOSTIC MODE ACTIVE</h1>
      <p>React is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Environment variables:</p>
      <ul>
        <li>VITE_FIREBASE_API_KEY: {import.meta.env.VITE_FIREBASE_API_KEY ? "SET" : "NOT SET"}</li>
        <li>VITE_FIREBASE_PROJECT_ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? "SET" : "NOT SET"}</li>
        <li>VITE_FIREBASE_APP_ID: {import.meta.env.VITE_FIREBASE_APP_ID ? "SET" : "NOT SET"}</li>
      </ul>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#00ff00",
          color: "#000",
          border: "none",
          cursor: "pointer"
        }}
      >
        RELOAD PAGE
      </button>
    </div>
  );
}