import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (tableData: any[], columns: any[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Institutes");

    const filteredColumns = columns.filter((col) => col.accessorKey !== "actions");

    worksheet.columns = filteredColumns.map((col) => ({
        header: col.header,
        key: col.accessorKey,
        width: 20,
      }));

    worksheet.getRow(1).font = { bold: true };

    tableData.forEach((row) => {
    const rowData: any = {};
    filteredColumns.forEach((col) => {
      let value = row[col.accessorKey] || "N/A"; 

      if (col.accessorKey === "established") {
        value = row.established ? format(new Date(row.established), "dd/MM/yyyy") : "N/A";
      } else if (col.accessorKey === "website") {
        value = row.website || "N/A"; 
      }

      rowData[col.accessorKey] = value;
    });
    worksheet.addRow(rowData);
  });

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(file, "InstituteList.xlsx");
};