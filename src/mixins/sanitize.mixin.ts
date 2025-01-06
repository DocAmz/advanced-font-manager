export function sanitizeFamilyName(familyName: string): string | null {
  if (typeof familyName !== 'string') {
    return null;
  }

  // Remove any unwanted characters (e.g., control characters, non-printable ASCII)
  let sanitized = familyName.replace(/[^\w\s-]/g, "");

  // Trim whitespace and collapse multiple spaces
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  // Ensure quotes if needed for CSS compatibility
  // if (/[ \-,]/.test(sanitized)) {
  //   sanitized = `"${sanitized}"`;
  // }

  return sanitized;
}

export function sanitizeUrl(url: string): string | null {
  // Define allowed protocols and valid font file extensions
  const allowedProtocols = ['http:', 'https:'];
  const allowedExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot', '.svg'];

  try {
    // Parse the URL to inspect its components
    const parsedUrl = new URL(url);

    // Check if the protocol is allowed
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }

    // Check if the path ends with a valid font extension
    const hasValidExtension = allowedExtensions.some(extension =>
      parsedUrl.pathname.endsWith(extension)
    );
    if (!hasValidExtension) {
      return null;
    }

    // Return sanitized URL (ensures it’s valid and normalized)
    return parsedUrl.href;
  } catch {
    // In case of invalid URL, return an empty string
    return null;
  }
}
export function sanitizePath() {}
export function sanitizeStyle() {}
