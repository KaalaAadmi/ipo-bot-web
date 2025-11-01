// components/IPODataTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define the type for a single IPO, based on your data
// This is a good practice for TypeScript
type IPO = {
  _id: string;
  IPOAnalysisTitle: string;
  LiveIPOName: string;
  LiveIPODetails: {
    end_date: string;
  };
  LiveIPOSubscriptionDetails: {
    Total: string;
    QIB: string;
    NII: string;
    RII: string;
    GMP: string;
  };
  Recommendation: string;
  apply_for_listing_gain?: boolean; // New optional field
};

interface IPODataTableProps {
  data: IPO[];
  isLoading: boolean;
  error: any;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  activeTab: "live" | "history"; // <-- ADD THIS LINE
}

export function IPODataTable({
  data,
  isLoading,
  error,
  onUpdate,
  activeTab,
}: IPODataTableProps) {
  const isHistoryTab = activeTab === "history"; // <-- ADD THIS HELPER VARIABLE

  const handleRecommendationChange = (id: string, value: string) => {
    onUpdate(id, "Recommendation", value);
  };

  const handleListingGainChange = (id: string, checked: boolean) => {
    onUpdate(id, "apply_for_listing_gain", checked);
  };

  if (isLoading) return <div className="text-center p-8">Loading IPOs...</div>;
  if (error)
    return (
      <div className="text-center p-8 text-red-500">Failed to load data.</div>
    );
  if (!data || data.length === 0)
    return <div className="text-center p-8">No IPOs found.</div>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">IPO Name</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>GMP</TableHead>
            <TableHead>Subscription (Q/N/R)</TableHead>
            <TableHead className="min-w-[150px]">
              Recommendation/Status
            </TableHead>
            <TableHead className="min-w-[120px]">Listing Gain</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((ipo) => (
            <TableRow key={ipo._id}>
              <TableCell className="font-medium">
                {ipo.LiveIPOName}
                <span className="block text-xs text-muted-foreground">
                  {ipo.IPOAnalysisTitle}
                </span>
              </TableCell>
              <TableCell>{ipo.LiveIPODetails.end_date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ipo.LiveIPOSubscriptionDetails.GMP?.includes("(")
                      ? "default"
                      : "secondary"
                  }
                >
                  {ipo.LiveIPOSubscriptionDetails.GMP || "N/A"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>Total: {ipo.LiveIPOSubscriptionDetails.Total}x</span>
                  <span>QIB: {ipo.LiveIPOSubscriptionDetails.QIB}x</span>
                  <span>NII: {ipo.LiveIPOSubscriptionDetails.NII}x</span>
                  <span>RII: {ipo.LiveIPOSubscriptionDetails.RII}x</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={ipo.Recommendation}
                  onValueChange={(value) =>
                    handleRecommendationChange(ipo._id, value)
                  }
                  disabled={isHistoryTab}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apply">Apply</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Avoid">Avoid</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`listing-gain-${ipo._id}`}
                    // Use `?? false` to handle old documents where this field doesn't exist
                    checked={ipo.apply_for_listing_gain ?? false}
                    onCheckedChange={(checked) =>
                      handleListingGainChange(ipo._id, checked)
                    }
                    disabled={isHistoryTab} // <-- ADD THIS PROP
                  />
                  <label
                    htmlFor={`listing-gain-${ipo._id}`}
                    className="text-sm font-medium"
                  >
                    Apply?
                  </label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
