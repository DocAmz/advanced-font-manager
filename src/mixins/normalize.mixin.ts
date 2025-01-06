
export function normalizeFontFaceDescriptors(
  descriptors: Partial<FontFaceDescriptors>
): Partial<FontFaceDescriptors> {
  const normalizedDescriptors: Partial<FontFaceDescriptors> = {}

  const allowedStyles = ['normal', 'italic', 'oblique'];
  const allowedWeights = [
    'normal',
    'bold',
    'lighter',
    'bolder',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ];
  const allowedStretches = [
    'normal',
    'ultra-condensed',
    'extra-condensed',
    'condensed',
    'semi-condensed',
    'semi-expanded',
    'expanded',
    'extra-expanded',
    'ultra-expanded',
  ];

  const allowedDisplay = [
    'auto',
    'block',
    'swap',
    'fallback',
    'optional',
  ];

  const allowedOverrides = ['normal', 'inherit'];
  const normalize = <T extends string>(value: T | undefined, allowed: T[], fallback?: T): T | undefined => value && allowed.includes(value) ? value : fallback ?? undefined;

  if (descriptors.display) {
    normalizedDescriptors.display = normalize(descriptors.display, allowedDisplay, 'auto' as FontDisplay) as FontDisplay
  }

  if (descriptors.style) {
    normalizedDescriptors.style = normalize(descriptors.style, allowedStyles);
  }

  if (descriptors.weight) {
    normalizedDescriptors.weight = normalize(descriptors.weight, allowedWeights);
  }

  if (descriptors.stretch) {
    normalizedDescriptors.stretch = normalize(descriptors.stretch, allowedStretches);
  }
  if (descriptors.unicodeRange) {
    normalizedDescriptors.unicodeRange = descriptors.unicodeRange ?? undefined;
  }
  if (descriptors.featureSettings) {
    normalizedDescriptors.featureSettings = descriptors.featureSettings ?? undefined;
  }
  if (descriptors.ascentOverride) {
    normalizedDescriptors.ascentOverride = normalize(descriptors.ascentOverride, allowedOverrides);
  }
  if (descriptors.descentOverride) {
    normalizedDescriptors.descentOverride = normalize(descriptors.descentOverride, allowedOverrides);
  }
  if (descriptors.lineGapOverride) {
    normalizedDescriptors.lineGapOverride = normalize(descriptors.lineGapOverride, allowedOverrides);
  }

  return normalizedDescriptors;
}


export function normalizeFamilyName() {}
export function normalizeUrl() {}
export function normalizePath() {}