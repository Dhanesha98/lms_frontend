import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

export default function UserManagementList(){
 const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [open, setOpen] = useState(false);
const [editingUser, setEditingUser] = useState(null);
 const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    active: true,
    password: "",
 })
  const token = localStorage.getItem("token");
  const fetchUsers = useCallback(async () => {

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users",{
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() =>{
    fetchUsers();
  }, [fetchUsers]);


  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else{
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "student", active: true, password: ""});
    }
    setOpen(true);
  };

  const handleClose = () =>setOpen(false);
  const handleSave = async () =>{
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }else{
        await axios.post(
          "http://localhost:5000/api/users",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchUsers(); 
      handleClose();
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) =>{
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try{
      await axios.delete(`http://localhost:5000/api/users/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); 
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "id", headerName:"ID", width:90},
    { field: "name", headerName: "Name" , width: 200},
    { field: "email", headerName: "Email" , width: 200},
    { field: "role", headerName: "Role" , width: 200},
    {
      field: "password",
      headerName: "Password",
      width: 200,
      renderCell: () => "••••••••",
    },
    {
      field:"action",
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
  ];

  return (
    <Box sx={{height:500, width:"100%"}}>
      <Button variant="contained" color="primary" sx={{mb: 2}} onClick={() => handleOpen()}>
      Add User
      </Button>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        disableRowSelectionOnClick
      />

      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingUser ? "Update User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );

}
