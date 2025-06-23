import React from "react";

export default function TestApp() {
  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <h1>Personal Finance Tracker</h1>
      <p>App is loading successfully!</p>
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "8px",
        marginTop: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2>Quick Test</h2>
        <p>If you can see this message, your React app is working properly.</p>
        <button 
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => alert("Button clicked! App is responsive.")}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}