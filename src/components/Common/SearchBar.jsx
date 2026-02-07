import React, { useState, useRef, useEffect } from "react";
import { Search, Mic, X, ArrowLeft } from "lucide-react";
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
        : "amber";

  return (
    <div
      className={`relative w-full ${isHero ? "max-w-2xl mx-auto" : "max-w-md lg:max-w-xl"} ${isOpen ? "z-[100]" : "z-10"} transition-all duration-500`}
      ref={containerRef}>
      {/* Search Input Container */}
      <div className={`relative group ${isHero ? "z-20" : ""}`}>
        {isHero && (
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-${themeColor}-500/30 to-amber-500/30 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse`}></div>
        )}

        <div
          className={`relative flex items-center bg-white/80  ${isHero ? " md:rounded-[2rem] md:border-gray-200/50" : "rounded-full border-gray-200 "} ${isOpen ? "md:shadow-2xl md:shadow-gray-200/50 md:border-gray-300" : "md:shadow-sm"} ${isHero && isOpen ? "shadow-2xl shadow-gray-200/50 border-gray-300" : "shadow-sm"}`}>
          <div
            className={`flex flex-1 items-center md:px-2 ${isHero ? "py-3 md:py-4 md:px-6" : "py-2 "}`}>
            <Search
              className={`hidden md:block flex-shrink-0  text-gray-400 group-hover:text-${themeColor}-500 transition-colors ${isHero ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4 md:w-5 md:h-5 cursor-pointer"}`}
              onClick={!isHero ? () => handleSearchSubmit() : undefined}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder={
                isHero
                  ? "Search heritage, crafts..."
                  : `Search ${initialCategory ? "in " + initialCategory : contextType}...`
              }
              className={`flex-1 bg-transparent border-none px-2 placeholder:text-gray-400 ${isHero ? "text-base md:text-lg ml-3 md:ml-4" : "text-sm md:text-base ml-2 md:ml-3"}`}
            />
          </div>

          <div className="flex items-center gap-1 pr-3 md:pr-4">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X size={14} className="md:w-4 md:h-4 text-gray-400" />
              </button>
            )}
            <div className="w-px h-5 md:h-6 bg-gray-200 mx-0.5 md:mx-1"></div>
            <button
              onClick={startVoiceSearch}
              className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${isListening ? `bg-${themeColor}-50 text-${themeColor}-600 ring-4 ring-${themeColor}-100 scale-110` : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
              <Mic
                size={isHero ? 20 : 16}
                className="md:w-[22px] md:h-[22px]"
              />
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
          <div className="max-h-[350px] overflow-y-auto py-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearchSubmit(s)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-4 transition-all duration-200 group/item border-l-4 border-transparent hover:border-amber-500">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-amber-50 transition-colors`}>
                  <Search
                    className={`text-gray-400 group-hover/item:text-amber-500 transition-colors ${isHero ? "w-4.5 h-4.5" : "w-4 h-4"}`}
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-gray-800 group-hover/item:text-gray-900 ${isHero ? "text-base" : "text-sm"}`}>
                      {s.text}
                    </span>
                    {s.category && (
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight opacity-70">
                        {s.category.replace(/-/g, " ")}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <ArrowLeft className="w-4 h-4 text-amber-500 rotate-180" />
                  </div>
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
