import { useRef, useState } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";

function Motivation() {
  const [quote, setQuote] = useState("Click 'New Quote' to start!");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const shareRef = useRef(null);

  // Fetch Quote API
  const generateQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      setQuote(data.content);
    } catch {
      setQuote("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveFavorite = () => {
    if (!favorites.includes(quote) && quote !== "") {
      setFavorites([...favorites, quote]);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(quote);
    alert("Quote copied! 📋");
  };

  // FIXED Share as Image
  const shareAsImage = async () => {
    if (!shareRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(shareRef.current, {
        cacheBust: true,
        backgroundColor: "white",
        pixelRatio: 2,
        foreignObjectRendering: true
      });

      // Download the image
      const link = document.createElement("a");
      link.download = "motivation.png";
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Something went wrong generating the image.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 w-screen"
      style={{
        background: "linear-gradient(135deg,#ef4444,#3b82f6,#10b981,#f97316)"
      }}
    >

      {/* CAPTURE CARD - moved offscreen */}
      <div
        ref={shareRef}
        className="p-6 bg-white rounded-xl shadow-xl w-[500px] text-center"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          fontFamily: "'Playfair Display', serif"
        }}
      >
        <p className="text-xl italic">“{quote}”</p>

        {/* Watermark */}
        <p className="text-sm mt-4 opacity-70 font-semibold">
          — &lt;/joe&gt;
        </p>
      </div>

      {/* MAIN UI CARD */}
      <motion.div
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl p-6 rounded-xl shadow-xl text-center text-black"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Daily Motivation</h2>

        <motion.p
          className="text-lg italic mb-4 min-h-[60px]"
          key={quote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? "Loading..." : `“${quote}”`}
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
            onClick={shareAsImage}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Share Image
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
