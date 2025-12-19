// frontend/src/utils/validation.js
// Validation utilities to match backend Joi schemas

// Phone regex from backend: /^\+?[0-9]{10,14}$/
export const phoneRegex = /^\+?[0-9]{10,14}$/;

// GST regex from backend: /^[0-9A-Z]{15}$/
export const gstRegex = /^[0-9A-Z]{15}$/;

// Vehicle number regex from backend: /^[A-Z0-9-]+$/
export const vehicleNoRegex = /^[A-Z0-9-]+$/;

// Email regex (basic, backend uses Joi.email())
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error parser for backend responses
export const parseBackendError = (error) => {
  const response = error.response?.data;
  if (!response) return { message: "Network error", fieldErrors: {} };

  // For validation errors: { success: false, message: 'Validation error', errors: [...] }
  if (response.errors && Array.isArray(response.errors)) {
    const fieldErrors = {};
    response.errors.forEach((errMsg) => {
      // Try to extract field name from message (e.g., "vehicleNo is required" -> vehicleNo)
      const fieldMatch = errMsg.match(/^"([^"]+)"|^(\w+)/);
      const field = fieldMatch ? fieldMatch[1] || fieldMatch[2] : "general";
      fieldErrors[field] = errMsg;
    });
    return {
      message: response.message || "Validation failed",
      fieldErrors,
      isValidationError: true,
    };
  }

  // For AppError: { success: false, message: '...', error: {...} }
  return {
    message: response.message || "An error occurred",
    fieldErrors: {},
    isValidationError: false,
  };
};

// Validation functions
export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  if (!phoneRegex.test(phone))
    return "Invalid phone number format (10-14 digits, optional + prefix)";
  return null;
};

export const validateGST = (gst) => {
  if (!gst || gst.trim() === "") return null; // Optional
  if (!gstRegex.test(gst))
    return "GST number must be 15 alphanumeric characters";
  return null;
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === "")
    return `${fieldName} is required`;
  return null;
};

export const validateMinLength = (value, min, fieldName) => {
  if (value && value.length < min)
    return `${fieldName} must be at least ${min} characters`;
  return null;
};

export const validateMinNumber = (value, min, fieldName) => {
  const num = Number(value);
  if (isNaN(num) || num < min) return `${fieldName} must be at least ${min}`;
  return null;
};

export const validatePattern = (value, regex, fieldName, message) => {
  if (value && !regex.test(value))
    return message || `Invalid ${fieldName} format`;
  return null;
};

// Combined validators for forms
export const validateClientForm = (form) => {
  const errors = {};

  // Required fields
  errors.name = validateRequired(form.name, "Name");
  errors.contactPersonName = validateRequired(
    form.contactPersonName,
    "Contact person name"
  );
  errors.contactPersonPhone = validatePhone(form.contactPersonPhone);
  errors.address = validateRequired(
    `${form.street} ${form.city} ${form.state} ${form.pincode}`,
    "Address"
  );

  // Optional
  errors.gstNumber = validateGST(form.gstNumber);
  errors.email = form.email ? validateEmail(form.email) : null;
  errors.contactPersonEmail = form.contactPersonEmail
    ? validateEmail(form.contactPersonEmail)
    : null;

  // Remove nulls
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};

export const validateDriverForm = (form) => {
  const errors = {};

  errors.name = validateRequired(form.name, "Name");
  errors.email = validateEmail(form.email);
  errors.password = validateMinLength(form.password, 6, "Password");
  errors.licenseNo = validateRequired(form.licenseNo, "License number");
  errors.phone = validatePhone(form.phone);

  // Optional
  // address optional

  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};

export const validateVehicleForm = (form) => {
  const errors = {};

  errors.vehicleNo =
    validateRequired(form.vehicleNo, "Vehicle number") ||
    validatePattern(
      form.vehicleNo,
      vehicleNoRegex,
      "Vehicle number",
      "Invalid vehicle registration format"
    );
  errors.model = validateRequired(form.model, "Model");
  errors.type = validateRequired(form.type, "Type");
  errors.capacityKg =
    validateRequired(form.capacityKg, "Capacity") ||
    validateMinNumber(form.capacityKg, 100, "Capacity");

  // Optional insurance

  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};

// Add more as needed for other entities
