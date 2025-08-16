import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Grid, Box, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Signup() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/Home");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };
  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
      <Grid item xs={11} sm={8} md={5}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {[
              { name: "name", label: "Name" },
              { name: "email", label: "Email" },
              { name: "password", label: "Password", type: "password" },
              { name: "confirmPassword", label: "Confirm Password", type: "password" },
            ].map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    type={field.type || "text"}
                    fullWidth
                    label={field.label}
                    margin="normal"
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                  />
                )}
              />
            ))}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Sign Up
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
