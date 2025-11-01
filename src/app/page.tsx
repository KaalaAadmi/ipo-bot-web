// app/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce"; // npm install use-debounce

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPODataTable } from "@/components/IPODataTable";
import { Button } from "@/components/ui/button";

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [tab, setTab] = useState("live");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500); // Debounce search input

  const { data, error, isLoading, mutate } = useSWR(
    `/api/ipos?tab=${tab}&page=${page}&search=${debouncedSearch}&limit=10`,
    fetcher
  );

  const handleUpdate = async (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    try {
      const res = await fetch(`/api/ipos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      // Tell SWR to re-fetch the data to show the update
      mutate();
    } catch (err) {
      console.error(err);
      // Here you could show an error toast
    }
  };

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">IPO Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v);
              setPage(1);
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <TabsList>
                <TabsTrigger value="live">Live IPOs</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <Input
                placeholder="Search IPO Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>

            <TabsContent value="live">
              <IPODataTable
                data={data?.data}
                isLoading={isLoading}
                error={error}
                onUpdate={handleUpdate}
                activeTab="live" // <-- ADD THIS PROP
              />
            </TabsContent>
            <TabsContent value="history">
              <IPODataTable
                data={data?.data}
                isLoading={isLoading}
                error={error}
                onUpdate={handleUpdate}
                activeTab="history" // <-- ADD THIS PROP
              />
            </TabsContent>
          </Tabs>

          {/* Pagination Controls */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <PaginationPrevious className="mr-2" /> Previous
                  </Button>
                </PaginationItem>
                <PaginationItem className="mx-4 font-medium">
                  Page {page} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next <PaginationNext className="ml-2" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
