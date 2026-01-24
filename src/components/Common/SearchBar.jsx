import React, { useState, useRef, useEffect } from "react";
import { Search, Mic, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../Configs/ApiEndpoints";

/**
 * Reusable SearchBar Component
 * @param {string} variant - 'navbar' or 'hero'
 * @param {string} contextType - 'product', 'course', or 'all'
 * @param {string} initialCategory - context category if any
 */
const SearchBar = ({
  variant = "navbar",
  contextType = "all",
  initialCategory = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Sync searchQuery with URL 'q' parameter
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q !== null) {
      setSearchQuery(q);
    } else if (variant === "navbar") {
      setSearchQuery("");
    }
  }, [location.search, variant]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Category to Route mapping
  const categoryToPathMap = {
    "cultural-clothes": "/marketplace/traditional",
    "musical-instruments": "/marketplace/instruments",
    "handicraft-decors": "/marketplace/arts_decors",
    "Cultural Dances": "/learnculture/dances",
    "Cultural Singing": "/learnculture/singing",
    "Musical Instruments": "/learnculture/instruments",
    "Cultural Art & Crafts": "/learnculture/art",
  };

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isOpen) return;

      try {
        const params = new URLSearchParams({
          query: searchQuery,
          type: contextType,
          category: initialCategory,
          limit: 8,
        });

        const response = await fetch(
          `${API.GET_SEARCH_SUGGESTIONS}?${params.toString()}`,
        );
        const data = await response.json();

        if (data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error("Search suggestions fetch failed:", err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, contextType, initialCategory]);

  // Click outside handling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (suggestion = null) => {
    const queryText =
      suggestion && typeof suggestion === "object"
        ? suggestion.text
        : typeof suggestion === "string"
          ? suggestion
          : searchQuery;
    if (!queryText.trim()) return;

    let targetPath = location.pathname;
    const category =
      suggestion && typeof suggestion === "object"
        ? suggestion.category
        : initialCategory;

    // Smart Redirection
    if (category && categoryToPathMap[category]) {
      targetPath = categoryToPathMap[category];
    } else if (contextType === "product") {
      // If we're on the landing page or a non-matching page, go to the first product category
      targetPath = "/marketplace/traditional";
    } else if (contextType === "course") {
      // If on learn landing, go to the first course category
      targetPath = "/learnculture/dances";
    } else if (contextType === "all") {
      targetPath = "/marketplace/traditional";
    }

    const searchParams = new URLSearchParams();
    searchParams.set("q", queryText);

    navigate(`${targetPath}?${searchParams.toString()}`);
    setIsOpen(false);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setSearchQuery(transcript);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
        handleSearchSubmit(transcript);
      }, 2000);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const isHero = variant.startsWith("hero");
  const themeColor =
    variant === "hero-marketplace"
      ? "orange"
      : variant === "hero-learn"
        ? "teal"
        : "blue";

  return (
    <div
      className={`relative w-full ${isHero ? "max-w-2xl mx-auto" : "max-w-xl"} ${isOpen ? "z-[100]" : "z-10"}`}
      ref={containerRef}>
      {/* Search Input Container */}
      <div className={`relative group ${isHero ? "z-20" : ""}`}>
        {isHero && (
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-${themeColor}-500/20 to-amber-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder={
              isHero
                ? "Search for heritage, crafts, masters..."
                : `Search ${initialCategory ? "in " + initialCategory : contextType}...`
            }
            className={`w-full ${isHero ? "pl-14 pr-24 py-5 rounded-[1.5rem] text-lg bg-white" : "pl-11 pr-20 py-2 rounded-full text-sm md:text-base bg-gray-50 md:bg-white"} border border-gray-100 md:border-gray-300 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 transition-all hover:shadow-md`}
          />

          <Search
            className={`absolute ${isHero ? "left-5" : "left-4"} top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-${themeColor}-500 transition-colors ${isHero ? "w-6 h-6" : "w-5 h-5 cursor-pointer"}`}
            onClick={!isHero ? () => handleSearchSubmit() : undefined}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-100 rounded-full">
                <X size={16} className="text-gray-400" />
              </button>
            )}
            <button
              onClick={startVoiceSearch}
              className={`p-3 rounded-full  ${isListening ? "text-red-500 animate-pulse " : "text-gray-400"}`}>
              <Mic size={isHero ? 24 : 20} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-[100] overflow-hidden ${isHero ? "rounded-2xl" : "rounded-lg"}`}>
          {!searchQuery && (
            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b">
              Top Recommendations
            </div>
          )}
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearchSubmit(s)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0">
                <Search
                  className={`text-gray-300 ${isHero ? "w-5 h-5" : "w-4 h-4"}`}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-medium text-gray-900 ${isHero ? "text-base" : "text-sm"}`}>
                    {s.text}
                  </span>
                  {s.category && (
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {s.category}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
