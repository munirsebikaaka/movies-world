import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(function () {
    function callBack(e) {
      if (e.code === key) inputEl.current.focus();
    }
    document.addEventListener("keydown", callBack);
    return () => document.addEventListener("keydown", callBack);
  }, []);
}
