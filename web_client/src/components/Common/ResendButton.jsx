import React, { useState, useEffect } from "react";
import { Button } from "antd";

const ResendButton = ({ onClick }) => {
  const [timer, setTimer] = useState(0);

  const handleResend = () => {
    onClick();
    // Trigger your resend API here
    setTimer(30); // start 30-second countdown
  };

  // Countdown effect
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [timer]);

  return (
    <Button onClick={handleResend} disabled={timer > 0}>
      {timer > 0 ? `Resend in ${timer}s` : "Resend"}
    </Button>
  );
};

export default ResendButton;
