import React from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useCreateProducts, { ProductData } from "../../hooks/useCreateProducts";
import Loading from "../../components/Loading";

const categories: string[] = [
  "shoes",
  "t-shirts",
  "jeans",
  "suits",
  "glasses",
  "bags",
  "jackets",
];

const initValues: ProductData = {
  name: "",
  description: "",
  price: undefined,
  category: "bags",
  count: "",
  image: "",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const validationProductsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  count: yup.string(),
});

function CreateProduct(): JSX.Element {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoading, createProduct } = useCreateProducts();

  const handleFormSubmit = async (
    values: ProductData,
    { setSubmitting }: FormikHelpers<ProductData>
  ): Promise<void> => {
    setSubmitting(false);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("category", values.category);
    if (values.image) {
      formData.append("image", values.image);
    }
    const data = await createProduct(formData);

    if (data) {
      values.count = "";
      values.name = "";
      values.price = undefined;
      values.description = "";
      values.image = "";
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<ProductData>["setFieldValue"]
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFieldValue("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Stack
      className={
        theme.palette.mode === "dark"
          ? "Paper-overlay-Dark"
          : "Paper-overlay-Light"
      }
      width={isMobile ? "90%" : "60%"}
      p={3}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          textAlign="start"
          color={
            theme.palette.mode === "dark"
              ? colors.green[500]
              : colors.green[400]
          }
          fontSize="1.4rem"
          mb={3}
        >
          Create New Product
        </Typography>

        <Formik
          initialValues={initValues}
          validationSchema={validationProductsSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Product Name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                fullWidth
                sx={{ mb: 2.5 }}
                color="secondary"
              />
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                fullWidth
                sx={{ mb: 2.5 }}
                color="secondary"
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={values.price ?? ""}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.price && Boolean(errors.price)}
                helperText={touched.price && errors.price}
                fullWidth
                sx={{ mb: 2.5 }}
                color="secondary"
              />
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  id="category"
                  label="Category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  color="secondary"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="count"
                label="Count in Stock"
                type="text"
                value={values.count}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.count && Boolean(errors.count)}
                helperText={touched.count && errors.count}
                fullWidth
                sx={{ mb: 2.5 }}
                color="secondary"
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  mb: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? colors.primary[400]
                      : colors.green[300],
                }}
              >
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
              </Button>
              {values.image && (
                <Stack alignItems="center" sx={{ mb: 2 }}>
                  <img
                    src={values.image}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "contain",
                    }}
                  />
                </Stack>
              )}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ mt: 3 }}
              >
                {isLoading ? <Loading size="small" /> : "Create"}
              </Button>
            </form>
          )}
        </Formik>
      </motion.div>
    </Stack>
  );
}

export default CreateProduct;
