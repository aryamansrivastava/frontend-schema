import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export default function ExcelParser() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name); 

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const binaryData = e.target?.result as string;
      const workbook = XLSX.read(binaryData, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length > 0) {
        setHeaders(parsedData[0] as string[]);
        setTableData(parsedData.slice(1));
      }
    };
  };

  return (
    <Box className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h5" className="mb-4 text-3xl font-bold text-gray-800">
        Excel Parser
      </Typography>

      <div className="flex items-center gap-2 border p-2 rounded-md shadow-md bg-white">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="cursor-pointer"
        />
        {selectedFileName && (
          <span className="text-gray-500 truncate flex-grow text-right">
            {selectedFileName}
          </span>
        )}
      </div>

      {tableData.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 2,
            maxHeight: 600,
            overflowY: "auto",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {(row as any)[colIndex] || ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
