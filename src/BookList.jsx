import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";


export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    available: true,
  });

  const token = localStorage.getItem("token");

  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role || decoded["custom:role"];
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  const isAdmin = role === "admin";

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleOpen = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({ ...book });
    } else {
      setEditingBook(null);
      setFormData({ title: "", author: "", category: "", available: true });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!isAdmin) return;

    try {
      if (editingBook) {
        await axios.put(
          `http://localhost:5000/api/books/${editingBook.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/books", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchBooks();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "author", headerName: "Author", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "available",
      headerName: "Available",
      width: 120,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },

    ...(isAdmin
      ? [
          {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
              <>
                <Button size="small" onClick={() => handleOpen(params.row)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(params.row.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      {isAdmin && (
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Book
        </Button>
      )}

      <DataGrid
        rows={books}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
      />
      
      {isAdmin && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingBook ? "Update Book" : "Add Book"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Author"
              fullWidth
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                />
              }
              label="Available"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editingBook ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
 


