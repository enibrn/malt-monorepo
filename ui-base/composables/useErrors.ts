import type { MyError } from '@enibrn/malt-ffb';

export function useErrors() {
  function handleError(error: MyError) {
    console.error(error);
    alert(error.toString());
  }

  return {
    handleError
  };
}