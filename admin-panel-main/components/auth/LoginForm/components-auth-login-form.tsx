      } catch (error: any) {
        console.error('Login error:', error); // Add logging to debug
        
        // Safely handle error responses
        const errors = error.response?.data?.errors || {};
        const message = error.response?.data?.message;
        const emailError = errors.email;
        const passwordError = errors.password;

        if (emailError && passwordError) {
          toast.error(`Error: Both email and password are incorrect.`);
        } else if (emailError) {
          toast.error(`Error: ${emailError}`);
        } else if (passwordError) {
          toast.error(`Error: ${passwordError}`);
        } else if (message) {
          toast.error(message); // Show server message if available
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } finally {
        setSubmitting(false);
      }
