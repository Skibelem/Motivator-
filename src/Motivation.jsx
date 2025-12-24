import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaShareAlt, FaCopy, FaRedo, FaTrashAlt, FaRegHeart, FaWhatsapp } from 'react-icons/fa';

// --- Momentum Motivator App Component ---
function Momentum() {
  const [quoteData, setQuoteData] = useState({ content: "Click 'New Quote' to get started!", author: "Momentum App" });
  const [favorites, setFavorites] = useState(() => {
    // Initialize favorites from LocalStorage, or an empty array if none exist
    const saved = localStorage.getItem("momentum-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  
  // shareRef is removed as it is no longer needed.
  
  // Check if the current quote is in favorites
  const isCurrentQuoteFavorited = favorites.some(fav => fav.content === quoteData.content);

  // --- Persistence Effect: Save favorites to LocalStorage ---
  useEffect(() => {
    localStorage.setItem("momentum-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // --- Fallback Quotes (for when API fails) ---
  const fallbackQuotes = [
    { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston S. Churchill" },
    { content: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  ];

  // --- API Fetching for Quotes ---
 // --- API Fetching for Quotes (FIXED WITH LOCAL PROXY) ---
const generateQuote = async () => {
  setLoading(true);
  
  // NOTE: This URL now points to the proxy configured in vite.config.js
  const localProxyUrl = "/api-quotes"; 

  try {
    // 1. Fetch Request targets your local proxy
    const response = await fetch(localProxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy failed with status: ${response.status}`);
    }
    
    // 2. Process Data (ZenQuotes format: array of objects)
    const dataArray = await response.json();
    const data = dataArray[0]; 
    
    setQuoteData({
      content: data.q,       // ZenQuotes uses 'q'
      author: data.a || "Unknown" // ZenQuotes uses 'a'
    });
  } catch (error) {
    console.error("Local proxy fetch failed, using fallback:", error);
    
    // Fallback logic
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    setQuoteData(fallbackQuotes[randomIndex]);
  } finally {
    setLoading(false);
  }
};

  // --- Favorite Management Handlers ---
  const toggleFavorite = () => {
    if (quoteData.content === "Click 'New Quote' to get started!") return;

    if (isCurrentQuoteFavorited) {
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.content !== quoteData.content));
    } else {
      setFavorites(prevFavorites => [...prevFavorites, quoteData]);
    }
  };

  const removeFavorite = (contentToRemove) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.content !== contentToRemove));
  };

  // --- Copy Quote to Clipboard ---
  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quoteData.content}" - ${quoteData.author}`)
      .then(() => alert("Quote copied to clipboard! ✅"))
      .catch(err => console.error("Failed to copy quote:", err));
  };

  // --- WhatsApp Share Functionality ---
  const shareOnWhatsApp = () => {
    if (quoteData.content === "Click 'New Quote' to get started!") {
        alert("Generate a quote first before sharing!");
        return;
    }

    // 1. Construct the message text
    const message = `✨ New Motivation Moment ✨\n\n“${quoteData.content}”\n— ${quoteData.author}\n\n#MomentumApp`;

    // 2. Encode the message
    const encodedMessage = encodeURIComponent(message);

    // 3. Construct the WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // 4. Open the link
    window.open(whatsappUrl, '_blank');
  };

  // --- Rendered Component ---
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-red-500 via-blue-500 to-green-500 text-white font-sans overflow-x-hidden w-screen"
    >
      {/* The hidden share card element has been removed here, 
        making the code much cleaner and more efficient!
      */}

      {/* Main App Card */}
      <motion.div
        className="
          bg-white text-gray-800 rounded-xl shadow-2xl 
          w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
          p-6 sm:p-8 md:p-10 
          flex flex-col items-center
        "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          Momentum
        </h1>

        {/* Quote Display Area */}
        <motion.p
          key={quoteData.content}
          className="text-lg sm:text-xl md:text-2xl italic mb-6 text-center min-h-[80px] sm:min-h-[100px] flex items-center justify-center px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {loading ? (
            <span className="text-gray-500 animate-pulse">Loading inspiration...</span>
          ) : (
            `“${quoteData.content}”`
          )}
        </motion.p>
        <motion.p
          key={quoteData.author}
          className="text-sm sm:text-base text-gray-600 font-semibold mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          — {quoteData.author}
        </motion.p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xs sm:max-w-none mb-8">
          <button
            onClick={generateQuote}
            className="flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
            disabled={loading}
          >
            <FaRedo className="mr-2" /> New
          </button>
          <button
            onClick={toggleFavorite}
            className={`flex items-center justify-center p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium ${isCurrentQuoteFavorited ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100"}`}
          >
            {isCurrentQuoteFavorited ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />} Favorite
          </button>
          <button
            onClick={copyQuote}
            className="flex items-center justify-center p-3 bg-gray-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
          >
            <FaCopy className="mr-2" /> Copy
          </button>
          
          <button
  onClick={shareOnWhatsApp}
  className="flex items-center justify-center p-3 bg-green-500 text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
>
  {/* Changed from FaShareAlt to FaWhatsapp */}
  <FaWhatsapp className="mr-2 text-6xl" /> Share
</button>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              Your Favorite Moments ✨
            </h3>
            <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto w-full pr-2 custom-scrollbar">
              <ul className="space-y-3">
                {favorites.map((fav, index) => (
                  <motion.li
                    key={fav.content + index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="text-sm sm:text-base text-gray-800 flex-grow mr-4">
                      <span className="font-semibold">“{fav.content}”</span> <br />
                      <span className="text-xs sm:text-sm text-gray-500">— {fav.author}</span>
                    </p>
                    <button
                      onClick={() => removeFavorite(fav.content)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                      title="Remove from favorites"
                    >
                      <FaTrashAlt />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Custom Scrollbar Style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default Momentum;