const axios = require("axios");

const blockedDomains = [
  "mailinator.com",
  "10minutemail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com"
];

const validateEmail = async (email) => {

  // Step 1: Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email format"
    };
  }

  // Step 2: Block disposable domains
  const domain = email.split("@")[1];

  if (blockedDomains.includes(domain)) {
    return {
      valid: false,
      message: "Temporary emails not allowed"
    };
  }

  // Step 3: Optional Abstract API
  if (process.env.ABSTRACT_EMAIL_KEY) {
    try {

      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_EMAIL_KEY}&email=${email}`
      );

      const data = response.data;

      if (data.deliverability !== "DELIVERABLE") {
        return {
          valid: false,
          message: "Email address not deliverable"
        };
      }

    } catch (error) {
    console.log("Abstract error:", error.response?.status);
    }
  }

  return {
    valid: true
  };

};

module.exports = validateEmail;