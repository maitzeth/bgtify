import { toast } from 'sonner';

/**
 * Retrieves the file name without its extension from a given file name.
 * 
 * @param {string} fileName - The name of the file including its extension.
 * 
 * @returns {string} - The file name without its extension.
 */
export const getFileNameWithoutExtension = (fileName: string): string => {
  return fileName.split('.').slice(0, -1).join('.');
}


type HandlerFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

/**
 * Higher-order function that wraps an asynchronous handler function with error handling.
 * 
 * @template T - The types of arguments expected by the handler function.
 * @template R - The return type of the handler function.
 * 
 * @param {(...args: T) => Promise<R>} handler - The asynchronous handler function to be wrapped.
 *   Takes any number of arguments of type T and returns a Promise resolving to a value of type R.
 * 
 * @returns {(...args: T) => Promise<R | Error>} - A wrapped function with the same signature as the input handler function,
 *   but with the return type augmented to include Error as a possible return type.
 */
export const withErrorHandling = <T extends unknown[], R>(
  handler: HandlerFunction<T, R>
): HandlerFunction<T, R | string> => {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (err) {
      let errMsg = (err as Error).message;

      if (err instanceof TypeError) {
        errMsg = err.message;
      }
      toast(errMsg);
      return errMsg;
    }
  };
};