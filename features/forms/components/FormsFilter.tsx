"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search, Plus, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface FormsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function FormsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: FormsFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      {/* Search */}
      <div className="relative flex-1 w-full lg:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-xl border-border bg-background h-11"
        />
      </div>

      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        {/* Status Filter */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-11 pl-10 pr-8 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-11 pl-10 pr-8 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="submissions">Most Submissions</option>
            <option value="views">Most Views</option>
          </select>
        </div>

        {/* Create New Form Button */}
        <Button className="rounded-xl h-11 ml-auto lg:ml-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>
    </div>
  );
}
