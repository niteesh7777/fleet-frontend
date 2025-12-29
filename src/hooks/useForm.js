import { useState, useCallback } from "react";

/**
 * Custom hook for form state management
 * Eliminates boilerplate form logic across components
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Function} config.onSubmit - Submit handler (async)
 * @param {Function} config.validate - Validation function (optional)
 * @param {Object} config.validationSchema - Validation schema (optional, for library integration)
 *
 * @returns {Object} - Form state and handlers
 *
 * @example
 * const { form, update, errors, handleSubmit, reset, isSubmitting } = useForm({
 *   initialValues: { name: '', email: '' },
 *   validate: (values) => {
 *     const errors = {};
 *     if (!values.name) errors.name = 'Name is required';
 *     if (!values.email) errors.email = 'Email is required';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await api.create(values);
 *   }
 * });
 *
 * // In JSX
 * <form onSubmit={handleSubmit}>
 *   <Input
 *     value={form.name}
 *     onChange={(e) => update('name', e.target.value)}
 *     error={errors.name}
 *   />
 *   <Button type="submit" disabled={isSubmitting}>Submit</Button>
 * </form>
 */
export const useForm = ({
  initialValues = {},
  onSubmit,
  validate,
  validationSchema,
}) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  /**
   * Update a single form field
   */
  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  /**
   * Update multiple form fields at once
   */
  const updateMultiple = useCallback((updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Mark field as touched
   */
  const touch = useCallback((key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  /**
   * Validate form and return errors object
   */
  const validateForm = useCallback(() => {
    let validationErrors = {};

    // Use custom validate function if provided
    if (validate) {
      validationErrors = validate(form);
    }

    // TODO: Add support for validation schema libraries (Yup, Zod, etc.)
    // if (validationSchema) {
    //   validationErrors = validateWithSchema(form, validationSchema);
    // }

    setErrors(validationErrors);
    return validationErrors;
  }, [form, validate, validationSchema]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(
    (newValues) => {
      setForm(newValues || initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
      setSubmitCount(0);
    },
    [initialValues]
  );

  /**
   * Set form values programmatically
   */
  const setValues = useCallback((values) => {
    setForm(values);
  }, []);

  /**
   * Set form errors programmatically
   */
  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      setSubmitCount((prev) => prev + 1);

      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(form).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);
        return;
      }

      // Submit form
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(form);
          // Optionally reset form after successful submission
          // reset();
        } catch (error) {
          // Handle submission error
          console.error("Form submission error:", error);
          if (error.response?.data?.errors) {
            setFormErrors(error.response.data.errors);
          }
          throw error; // Re-throw to allow caller to handle
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [form, validateForm, onSubmit, reset, setFormErrors]
  );

  /**
   * Check if form is valid
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Check if form has been modified
   */
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialValues);

  return {
    form,
    update,
    updateMultiple,
    errors,
    touched,
    touch,
    isSubmitting,
    isValid,
    isDirty,
    submitCount,
    handleSubmit,
    reset,
    setValues,
    setErrors: setFormErrors,
    validateForm,
  };
};
