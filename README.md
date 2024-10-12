react-kiosk-mode-hook
A React hook for entering and exiting kiosk mode with PIN validation.

Overview
This package provides a React hook, useKiosk Mode, that allows you to enter and exit kiosk mode on a webpage. It uses the fullscreen API to enter fullscreen mode and listens for the fullscreenchange event to exit fullscreen mode. Additionally, it provides PIN validation to ensure that only authorized users can exit kiosk mode.

Features
Enter and exit kiosk mode with a single function call
PIN validation to ensure authorized access
Automatic exit from kiosk mode after a specified timeout
Customizable modal dialog for PIN entry
Installation
To install the package, run the following command:


Verify

Open In Editor
Edit
Copy code
npm install react-kiosk-mode-hook
Usage
Here is an example of how to use the useKioskMode hook:

javascript

Verify

Open In Editor
Edit
Copy code
import React from 'react';
import useKioskMode from 'react-kiosk-mode-hook';

function App() {
  const { isKioskMode, toggleKioskMode, modalProps } = useKioskMode();

  return (
    <div>
      {isKioskMode ? (
        <button onClick={toggleKioskMode}>Exit Kiosk Mode</button>
      ) : (
        <button onClick={toggleKioskMode}>Enter Kiosk Mode</button>
      )}
      {modalProps.isOpen && (
        <Modal {...modalProps}>
          <input type="password" placeholder="Enter PIN" />
          <button onClick={modalProps.onValidatePin}>Validate PIN</button>
        </Modal>
      )}
    </div>
  );
}
Configuration
You can customize the behavior of the useKioskMode hook by passing options to the useKioskMode function. Here are the available options:

timeout: The timeout in milliseconds after which the kiosk mode will be exited automatically. Defaults to 5000.
pin: The PIN code required to exit kiosk mode. Defaults to "1111".
Here is an example of how to pass options to the useKioskMode function:

javascript

Verify

Open In Editor
Edit
Copy code
import React from 'react';
import useKioskMode from 'react-kiosk-mode-hook';

function App() {
  const { isKioskMode, toggleKioskMode, modalProps } = useKioskMode({
    timeout: 10000,
    pin: "1234",
  });

  // ...
}
License
This package is licensed under the MIT License.