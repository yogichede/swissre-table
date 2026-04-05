import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  TextField, Box, TableSortLabel, LinearProgress, Button
} from "@mui/material";

// Simple debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ProductTable() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");

  // Filters
  const [filters, setFilters] = useState({
    id: "",
    title: "",
    price: "",
    brand: "",
    category: ""
  });

  // Worker state
  const [progress, setProgress] = useState(null);
  const [worker, setWorker] = useState(null);
  const [loadingRow, setLoadingRow] = useState(null);

  const debouncedSetFilters = useMemo(
    () => debounce((field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(0);
    }, 500),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const skip = page * rowsPerPage;
      let url = `https://dummyjson.com/products?limit=${rowsPerPage}&skip=${skip}&sortBy=${orderBy}&order=${order}`;

      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          url += `&${field}=${encodeURIComponent(value)}`;
        }
      });

      const res = await fetch(url);
      const data = await res.json();

      setRows(data.products);
      setRowCount(data.total);
    };

    fetchData();
  }, [page, rowsPerPage, orderBy, order, filters]);

  const handleSort = useCallback((property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }, [orderBy, order]);

  const columns = useMemo(() => ["id", "title", "price", "brand", "category"], []);

  // Handle row click
  const handleRowClick = (row) => {
    alert(`current Row Selected row is ${row.id}`)
    if (worker) {
      worker.terminate();
      setWorker(null);
    }
    setProgress(0);
    setLoadingRow(row.id);

    const newWorker = new Worker(new URL("./worker.js", import.meta.url));
    console.log(row.id)
    newWorker.postMessage({ fileUrl: 'url' }); 
    newWorker.onmessage = (e) => {
      if (e.data.type === "progress") {
        setProgress(e.data.percent);
      } else if (e.data.type === "complete") {
        setProgress(100);
        setLoadingRow(null);
      } else if (e.data.type === "cancelled") {
        setProgress(null);
        setLoadingRow(null);
      } else if (e.data.type === "error") {
        console.error("Worker error:", e.data.message);
        setLoadingRow(null);
      }
    };
    setWorker(newWorker);
  };

  const handleCancel = () => {
    if (worker) {
      worker.postMessage({ type: "cancel" });
      worker.terminate();
      setWorker(null);
      setProgress(null);
      setLoadingRow(null);
    }
  };

  return (
    <Box>
      {progress !== null && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <span>Loading document... {loadingRow}… {progress}%</span>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col)}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                  <TextField
                    variant="standard"
                    placeholder={`Filter ${col}`}
                    defaultValue={filters[col]}
                    onChange={(e) => debouncedSetFilters(col, e.target.value)}
                    fullWidth
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => handleRowClick(row)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rowCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
}