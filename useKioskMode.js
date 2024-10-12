import React, { useEffect, useState } from "react";

const enterFullscreen = (element) => {
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
const useKioskMode = () => {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    window.addEventListener("click", handleEvent);
    window.addEventListener("touchstart", handleEvent);
    return () => {
      window.removeEventListener("click", handleEvent);
      window.removeEventListener("touchstart", handleEvent);
    };
  }, [clickCount, clickTimer, isKioskMode]);

  function handleEvent(e) {
    console.log("inside handleEvent");
    const isTouch =
      e.type === "touchstart" ||
      e.type === "touchmove" ||
      e.type === "touchend";
    const event = isTouch ? e.touches[0] : e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cornerWidth = 300;
    const cornerHeight = 300;

    if (
      event.clientX > windowWidth - cornerWidth &&
      event.clientY > windowHeight - cornerHeight
    ) {
      setClickCount((prev) => prev + 1);
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      setClickTimer(setTimeout(() => setClickCount(0), 5000));
      if (clickCount + 1 === 5) {
        toggleKioskMode();
      }
    } else {
      // Reset count if clicked outside the corner
      setClickCount(0);
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    }
  }

  function handleValidatePin(pin) {
    if (pin === "1111") {
      setIsModelOpen(false);
      if (isKioskMode) {
        exitFullscreenFn();
        setIsKioskMode(false);
      } else {
        enterFullscreenFn();
        setIsKioskMode(true);
      }
    } else {
      setError("Invalid PIN");
    }
  }

  function toggleKioskMode() {
    console.log("inside toggleKioskMode");
    setIsModelOpen(true);
    setClickCount(0);
  }
  function enterFullscreenFn() {
    const element = document.documentElement;
    enterFullscreen(element);
  }
  function exitFullscreenFn() {
    exitFullscreen();
  }

  return {
    isKioskMode,
    exitKioskMode: exitFullscreenFn,
    enterKioskMode: enterFullscreenFn,
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
