// // 

// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";

// function Motivation() {
//   const [quote, setQuote] = useState("");
//   const [author, setAuthor] = useState("");
//   const [favorites, setFavorites] = useState([]);
//   const cardRef = useRef(null);
//   const [sharing, setSharing] = useState(false);

//   const fetchQuote = async () => {
//     try {
//       const res = await fetch("https://api.quotable.io/random");
//       const data = await res.json();
//       setQuote(data.content);
//       setAuthor(data.author);
//     } catch (error) {
//       console.log("Error fetching quote:", error);
//     }
//   };

//   useEffect(() => {
//     fetchQuote();
//   }, []);

//   const saveFavorite = () => {
//     const fullQuote = `“${quote}” — ${author}`;
//     if (!favorites.includes(fullQuote)) {
//       setFavorites((prev) => [...prev, fullQuote]);
//     }
//   };

//   const copyQuote = async () => {
//     try {
//       await navigator.clipboard.writeText(`"${quote}" — ${author}`);
//       alert("Quote copied! 📋");
//     } catch (err) {
//       console.log("Copy failed", err);
//     }
//   };

//   // Helper to convert canvas -> blob (promise)
//   const canvasToBlob = (canvas) =>
//     new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));

//   const shareAsImage = async () => {
//     if (!cardRef.current) return;
//     setSharing(true);

//     try {
//       // 1) Render the card
//       const canvas = await html2canvas(cardRef.current, {
//         useCORS: true,
//         backgroundColor: null,
//         scale: 2 // higher quality
//       });

//       // 2) Convert to blob
//       const blob = await canvasToBlob(canvas);
//       if (!blob) throw new Error("Could not create image blob");

//       const file = new File([blob], "motivation.png", { type: "image/png" });

//       // 3) If the Web Share API supports files, use it (mobile + some desktop)
//       if (navigator.canShare && navigator.canShare({ files: [file] })) {
//         try {
//           await navigator.share({
//             files: [file],
//             title: "Daily Motivation",
//             text: `${quote} — ${author}`
//           });
//           setSharing(false);
//           return;
//         } catch (shareErr) {
//           // user may cancel or share failed — fallback below
//           console.log("Native share failed or cancelled:", shareErr);
//         }
//       }

//       // 4) Fallback: open image in new tab for manual save + open WhatsApp with text
//       const url = URL.createObjectURL(blob);
//       window.open(url, "_blank"); // user can save the image

//       // open WhatsApp web/mobile with text prefilled (image must be added manually)
//       const waText = `Daily Motivation: "${quote}" — ${author}`;
//       const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;
//       window.open(waUrl, "_blank");

//     } catch (err) {
//       console.error("Share-as-image error:", err);
//       alert("Could not share image automatically. The image will open in a new tab instead.");
//     } finally {
//       setSharing(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center px-4 py-8 w-screen"
//       style={{
//         background: "linear-gradient(135deg,#ef4444,#3b82f6,#10b981,#f97316)"
//       }}
//     >
//       {/* The card we will capture — keep this self-contained and styled */}
//       <motion.div
//         ref={cardRef}
//         className="bg-white w-full max-w-md sm:max-w-lg p-6 rounded-xl shadow-xl text-center text-black"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.35 }}
//       >
//         <h2 className="text-2xl font-bold mb-4">Daily Motivation</h2>

//         <motion.p
//           className="text-lg italic mb-2 font-playfair"
//           key={quote}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//         >
//           “{quote}”
//         </motion.p>

//         <p className="text-sm text-gray-600 mb-4">— {author}</p>

//         <div className="flex gap-3 justify-center">
//           <button
//             onClick={fetchQuote}
//             className="px-4 py-2 bg-black text-white rounded-lg"
//           >
//             New Quote
//           </button>

//           <button
//             onClick={saveFavorite}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Save
//           </button>
//         </div>

//         <div className="flex gap-3 justify-center mt-3">
//           <button
//             onClick={copyQuote}
//             className="px-4 py-2 bg-gray-800 text-white rounded-lg"
//           >
//             Copy
//           </button>

//           <button
//             onClick={shareAsImage}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
//             disabled={sharing}
//           >
//             {sharing ? "Preparing…" : "Share as Image"}
//           </button>
//         </div>

//         {favorites.length > 0 && (
//           <div className="mt-6 text-left">
//             <h3 className="font-semibold mb-2">⭐ Favorites:</h3>
//             <ul className="space-y-1">
//               {favorites.map((fav, i) => (
//                 <li key={i} className="text-sm bg-gray-100 p-2 rounded">
//                   {fav}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

// export default Motivation;


import { useRef, useState } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";

function Motivation() {
  const [quote, setQuote] = useState("Click 'New Quote' to start!");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const shareRef = useRef(null);

  // ✅ Fetch Quote API
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

  // ✅ Share as Image with Watermark </joe>
  const shareAsImage = async () => {
    if (!shareRef.current) return;

    const dataUrl = await htmlToImage.toPng(shareRef.current);
    const newTab = window.open();
    newTab.document.write(`<img src="${dataUrl}" style="width:100%"/>`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 w-screen"
      style={{
        background: "linear-gradient(135deg,#ef4444,#3b82f6,#10b981,#f97316)"
      }}>

      {/* HIDDEN IMAGE CARD */}
      <div 
        ref={shareRef}
        className="hidden p-6 bg-white rounded-xl shadow-xl w-[500px] text-center"
      >
        <p className="text-xl italic">“{quote}”</p>

        {/* Watermark */}
        <p className="text-sm mt-4 opacity-70 font-semibold">
          — &lt;/joe&gt;
        </p>
      </div>

      {/* MAIN CARD */}
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
