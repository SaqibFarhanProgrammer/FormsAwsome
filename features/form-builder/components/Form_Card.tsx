import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  BarChart3,
  Copy,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

function getStatusBadge(status: string) {
  switch (status) {
    case "PUBLISHED":
      return (
        <Badge className="rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-50 font-medium text-xs">
          Published
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge className="rounded-lg bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-50 font-medium text-xs">
          Draft
        </Badge>
      );
    case "ARCHIVED":
      return (
        <Badge className="rounded-lg bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-100 font-medium text-xs">
          Archived
        </Badge>
      );
    default:
      return (
        <Badge className="rounded-lg bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-100 font-medium text-xs">
          {status || "Unknown"}
        </Badge>
      );
  }
}

function Form_Card({ form }: { form: any }) {
  return (
    <Card
      key={form.id}
      className="rounded-2xl border-border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 group cursor-pointer"
    >
      <CardContent className=" space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(form.state)}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg ">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-48">
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <Pencil className="w-4 h-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <BarChart3 className="w-4 h-4" /> Analytics
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <Copy className="w-4 h-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <Send className="w-4 h-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2">
                  <Archive className="w-4 h-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-foreground leading-tight">
            {form.title || "Untitled Form"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {form.description || "No description"}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">30 submissions</span>
          </div>
          <div className="flex items-center pl-7 gap-1.5">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">150 views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Form_Card;
