import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, MoreVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentUploads = [
  { id: 1, fileName: "customers_jan.csv", uploadDate: "2025-01-15", recordsCount: 150, status: "completed", uploadedBy: "John Doe" },
  { id: 2, fileName: "customers_feb.csv", uploadDate: "2025-02-10", recordsCount: 200, status: "processing", uploadedBy: "Jane Smith" },
];

function ActionMenu({ onView, onDownload }: { onView: () => void; onDownload: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
        }}
        aria-label="More actions"
      >
        <MoreVertical />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 32,
            minWidth: 140,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 10,
            padding: "8px 0",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onView();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 16,
              color: "#111",
            }}
          >
            <Eye color="#22c55e" style={{ marginRight: 8 }} />
            View
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDownload();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 16,
              color: "#111",
            }}
          >
            <Download style={{ marginRight: 8 }} />
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default function UploadHistory() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Track your bulk customer import history and status.</CardDescription>
        </CardHeader>
        <div className="flex justify-between mb-1 px-4">
          <input
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
          />
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Customers
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
        <CardContent className="px-4">
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table style={{ minWidth: 900, width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <TableHeader style={{ background: '#f9fafb', borderRadius: 12, borderSpacing: 0 }}>
                <TableRow style={{ borderRadius: 12 }}>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb', borderTopLeftRadius: 12 }}>File Name</TableHead>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb' }}>Upload Date</TableHead>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb' }}>Records</TableHead>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb' }}>Status</TableHead>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb' }}>Uploaded By</TableHead>
                  <TableHead style={{ fontWeight: 600, background: '#f9fafb', borderTopRightRadius: 12 }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUploads
                  .filter((upload) => upload.fileName.toLowerCase().includes(search.toLowerCase()))
                  .map((upload, idx) => (
                    <TableRow
                      key={upload.id}
                      style={{ borderBottom: idx !== recentUploads.length - 1 ? '1px solid #e5e7eb' : undefined }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          {upload.fileName}
                        </div>
                      </TableCell>
                      <TableCell>{upload.uploadDate}</TableCell>
                      <TableCell>{upload.recordsCount} records</TableCell>
                      <TableCell>
                        {upload.status === 'completed' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', background: '#e6f9ed', color: '#22c55e', fontWeight: 500, borderRadius: 16, padding: '2px 10px', fontSize: 15 }}>
                            <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', marginRight: 8 }} />
                            Complete
                          </span>
                        ) : (
                          <Badge
                            variant={upload.status === 'processing' ? 'secondary' : 'destructive'}
                            style={{ fontSize: 15 }}
                          >
                            {upload.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{upload.uploadedBy}</TableCell>
                      <TableCell>
                        <ActionMenu
                          onView={() => {/* handle view */}}
                          onDownload={() => {/* handle download */}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}