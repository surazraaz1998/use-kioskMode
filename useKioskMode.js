/**
 * useKioskMode hook
 *
 * This hook provides a way to enter and exit kiosk mode on a webpage.
 * It uses the fullscreen API to enter fullscreen mode and listens for
 * the fullscreenchange event to exit fullscreen mode.
 *
 * @returns {object} An object with the following properties:
 *   - isKioskMode: A boolean indicating whether the webpage is in kiosk mode.
 *   - toggleKioskMode: A function to Toggle kiosk mode.
 *   - modalProps: An object with properties for the modal dialog.
 */

import { useEffect, useState } from "react";

const useKioskMode = () => {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);

  /**
   * Handle event listener for fullscreenchange event
   */
  const handleFullscreenChange = () => {
    if (document.fullscreenElement === null) {
      setIsKioskMode(false);
    }
  };

  /**
   * Handle event listener for click and touchstart events
   */
  const handleEvent = (e) => {
    const isTouch = e.type === "touchstart" || e.type === "touchmove" || e.type === "touchend";
    const event = isTouch ? e.touches[0] : e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cornerWidth = 300;
    const cornerHeight = 300;

    if (event.clientX > windowWidth - cornerWidth && event.clientY > windowHeight - cornerHeight) {
      incrementClickCount();
    } else {
      resetClickCount();
    }
  };

  /**
   * Increment click count
   */
  const incrementClickCount = () => {
    setClickCount((prev) => prev + 1);
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    setClickTimer(setTimeout(() => setClickCount(0), 5000));
    if (clickCount + 1 === 5) {
      toggleKioskMode();
    }
  };

  /**
   * Reset click count
   */
  const resetClickCount = () => {
    setClickCount(0);
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
  };
 
  /**
   * Handle PIN validation
   */
  const handleValidatePin = (pin) => {
    if (pin === "1111") {
      setIsModelOpen(false);
      toggleKioskMode();
    } else if (pin === "") {
      setError("PIN cannot be empty");
    } else {
      setError("Invalid PIN");
    }
  };

  /**
   * Toggle kiosk mode
   */
  const toggleKioskMode = () => {
    if (isKioskMode) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
    setIsKioskMode(!isKioskMode);
  };

  /**
   * Enter fullscreen mode
   */
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      // Safari
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  };

  /**
   * Exit fullscreen mode
   */
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  };


  useEffect(() => {
    window.addEventListener("click", handleEvent);
    window.addEventListener("touchstart", handleEvent);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("click", handleEvent);
      window.removeEventListener("touchstart", handleEvent);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [clickCount, clickTimer, isKioskMode]);


  return {
    isKioskMode,
    toggleKioskMode,
    modalProps:{
      isOpen: isModelOpen,
      onClose: () => setIsModelOpen(false),
      onValidate: handleValidatePin,
      pin,
      setPin,
      error,
    }
  };
};

export default useKioskMode;
