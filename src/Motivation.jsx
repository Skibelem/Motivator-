import { useState } from "react";
import { motion } from "framer-motion";

const quotes = [
  "Keep going — you’re closer than you think.",
  "Small steps every day lead to big results.",
  "You have more in you than you know.",
  "Focus on progress, not perfection.",
  "Your potential is bigger than your excuses.",
  "Don’t stop when you're tired. Stop when you’re done.",
  "Action kills fear. Start now."
];

function Motivation() {
  const [quote, setQuote] = useState(quotes[0]);
  const [favorites, setFavorites] = useState([]);

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const saveFavorite = () => {
    if (!favorites.includes(quote)) {
      setFavorites([...favorites, quote]);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(quote);
    alert("Quote copied! 📋");
  };

  const shareQuote = () => {
    const text = `Motivation of the day: "${quote}"`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg,#ef4444,#3b82f6,#10b981,#f97316)"
      }}>
      
      <motion.div 
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl text-center text-black"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Daily Motivation</h2>

        <motion.p 
          className="text-lg italic mb-4"
          key={quote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          “{quote}”
        </motion.p>

        <div className="flex gap-3 justify-center">
          <button 
            onClick={generateQuote}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            New Quote
          </button>

          <button 
            onClick={saveFavorite}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>

        <div className="flex gap-3 justify-center mt-3">
          <button 
            onClick={copyQuote}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Copy
          </button>

          <button 
            onClick={shareQuote}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Share
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-semibold mb-2">⭐ Favorites:</h3>
            <ul className="space-y-1">
              {favorites.map((fav, i) => (
                <li key={i} className="text-sm bg-gray-100 p-2 rounded">
                  {fav}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Motivation;
