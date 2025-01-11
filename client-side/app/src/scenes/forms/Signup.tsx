import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Person2Outlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { useMediaQuery } from "@mui/system";
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

import { motion } from "framer-motion";
import useSignUp from "../../hooks/useSignUp";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const initValues: SignupData = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

const validateSignupData = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

function Signup(): JSX.Element {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mode = theme.palette.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHiddenPassword, setIsHiddenPassword] = useState<boolean>(true);
  const [isHiddenConfirmPassword, setIsHiddenConfirmPassword] =
    useState<boolean>(true);
  const nav = useNavigate();

  const { signup, isLoading, success } = useSignUp();
  const handleFormSubmit = (
    values: SignupData,
    { setSubmitting }: FormikHelpers<SignupData>
  ) => {
    setSubmitting(false);
    signup({
      confrimPassword: values.confirmPassword,
      email: values.email,
      name: values.name,
      password: values.password,
    });
  };

  if (success) nav("/");
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack
          display={"flex"}
          width={isMobile ? "93%" : "50%"}
          margin={"30px auto"}
        >
          <Typography
            textAlign={"center"}
            fontSize={"1.8rem"}
            mb={3}
            color={mode === "dark" ? colors.green[500] : colors.green[400]}
            fontWeight={"bold"}
          >
            Create new account
          </Typography>
          <Box
            className={
              mode === "dark" ? "Paper-overlay-Dark" : "Paper-overlay-Light"
            }
            p={5}
          >
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initValues}
              validationSchema={validateSignupData}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="name"
                    label="Full name"
                    value={values.name}
                    color="secondary"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    placeholder={"Jhon Doe"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person2Outlined />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ mb: 2.5 }}
                  />
                  <TextField
                    name="email"
                    label="Email address"
                    type="text"
                    value={values.email}
                    onBlur={handleBlur}
                    color="secondary"
                    placeholder={"you@example.com"}
                    onChange={handleChange}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ mb: 2.5 }}
                  />
                  <TextField
                    name="password"
                    label="Password"
                    type={isHiddenPassword ? "password" : "text"}
                    color="secondary"
                    placeholder={"123456mM@"}
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {isHiddenPassword ? (
                            <Visibility
                              color="secondary"
                              sx={{ cursor: "pointer" }}
                              onClick={() => setIsHiddenPassword(false)}
                            />
                          ) : (
                            <VisibilityOff
                              sx={{ cursor: "pointer" }}
                              color="secondary"
                              onClick={() => setIsHiddenPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ mb: 2.5 }}
                  />
                  <TextField
                    name="confirmPassword"
                    label="Confirm password"
                    type={isHiddenConfirmPassword ? "password" : "text"}
                    color="secondary"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    placeholder={"123456mM@"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {isHiddenConfirmPassword ? (
                            <Visibility
                              sx={{ cursor: "pointer" }}
                              color="secondary"
                              onClick={() => setIsHiddenConfirmPassword(false)}
                            />
                          ) : (
                            <VisibilityOff
                              sx={{ cursor: "pointer" }}
                              color="secondary"
                              onClick={() => setIsHiddenConfirmPassword(true)}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ mb: 2.5 }}
                  />
                  <Button
                    disabled={isLoading}
                    type="submit"
                    color="secondary"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                  >
                    {isLoading ? <Loading size="small" /> : "Signup"}
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
          <Typography
            mt={1}
            textAlign={"center"}
            fontSize={"1rem"}
            color={mode === "dark" ? colors.green[500] : colors.green[200]}
          >
            already have an{" "}
            <Typography
              display={"inline"}
              sx={{ textDecoration: "underLine", cursor: "pointer" }}
              onClick={() => {
                nav("/login");
              }}
            >
              {" "}
              account?
            </Typography>
          </Typography>
        </Stack>
      </motion.div>
    </>
  );
}

export default Signup;
