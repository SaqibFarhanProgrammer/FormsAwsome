"use client";

import { useState } from "react";
import { FormsGrid } from "./FormsGrid";
import { FormsFilters } from "./FormsFilter";

export function FormsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  return (
    <div className="space-y-6">
      <FormsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <FormsGrid searchQuery={searchQuery} statusFilter={statusFilter} sortBy={sortBy} />
    </div>
  );
}
