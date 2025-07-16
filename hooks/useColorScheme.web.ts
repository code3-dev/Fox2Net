
/**
 * Force light mode only - no dark mode support
 */
export function useColorScheme(): 'light' {
  try {
    return 'light';
  } catch (error) {
    console.warn('useColorScheme error:', error);
    return 'light';
  }
}
