"use client";

import SearchBar from "./search-bar";
import SearchResults from "./search-results";

export default function MusicPlayerLeft() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-5xl font-bold mb-8 text-white">OCTAVIA</h1>
      <SearchBar />
      <div className="mt-4 flex-1 min-h-0">
        <div className="h-full overflow-y-auto pr-1 hide-scrollbar">
          <SearchResults />
        </div>
      </div>
    </div>
  );
}
