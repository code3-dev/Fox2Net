// Force light mode only with error handling
export function useColorScheme(): 'light' {
  try {
    return 'light';
  } catch (error) {
    console.warn('useColorScheme error:', error);
    return 'light';
  }
}
