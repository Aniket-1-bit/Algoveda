// Code Execution Service
// This is a stub implementation. For production, integrate with:
// - Judge0 API
// - CodeChef API
// - AWS Lambda
// - Custom Docker containers

const executeCode = async (code, language, testCases = []) => {
  try {
    // Validation
    if (!code || !language) {
      return {
        success: false,
        error: 'Code and language are required',
        output: '',
      };
    }

    // In production, send to actual execution service
    // For now, return a mock response based on code patterns

    const output = mockExecuteCode(code, language);

    return {
      success: true,
      output,
      language,
      executionTime: Math.random() * 1000,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: '',
    };
  }
};

const mockExecuteCode = (code, language) => {
  // Simple mock execution based on code patterns
  const trimmedCode = code.trim().toLowerCase();

  // Detect common patterns
  if (trimmedCode.includes('print("hello')) {
    return 'hello\n';
  }
  if (trimmedCode.includes('print(')) {
    return 'Code executed successfully\n';
  }
  if (trimmedCode.includes('def ') && trimmedCode.includes('return')) {
    return 'Function defined and executed\n';
  }
  if (trimmedCode.includes('error') || trimmedCode.includes('raise')) {
    return 'Error: Invalid syntax\n';
  }

  return 'Code executed\n';
};

const validateCode = (code, language) => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  if (code.length > 50000) {
    return { valid: false, error: 'Code is too long (max 50KB)' };
  }

  // Language-specific validation
  const languageValidations = {
    python: validatePython,
    javascript: validateJavaScript,
    java: validateJava,
    cpp: validateCpp,
  };

  const validator = languageValidations[language.toLowerCase()];
  if (validator) {
    return validator(code);
  }

  return { valid: true };
};

const validatePython = (code) => {
  // Basic Python syntax checks
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    return { valid: false, error: 'Mismatched braces' };
  }

  return { valid: true };
};

const validateJavaScript = (code) => {
  // Basic JS syntax checks
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;

  if (openParens !== closeParens) {
    return { valid: false, error: 'Mismatched parentheses' };
  }

  return { valid: true };
};

const validateJava = (code) => {
  // Basic Java checks
  if (!code.includes('class ')) {
    return { valid: false, error: 'Java code must contain a class definition' };
  }

  return { valid: true };
};

const validateCpp = (code) => {
  // Basic C++ checks
  if (!code.includes('#include')) {
    return { valid: false, error: 'C++ code should include headers' };
  }

  return { valid: true };
};

module.exports = {
  executeCode,
  validateCode,
};
