import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState<{ message: string }>({
    message: "No data found.",
  });

  useEffect(() => {
    setInterval(() => {
      setData({
        message: `Data updated at ${new Date().toLocaleTimeString()}`,
      });
    }, 3456);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Real Time Update POC</p>
        <div>{data.message}</div>
      </header>
    </div>
  );
};

export default App;
