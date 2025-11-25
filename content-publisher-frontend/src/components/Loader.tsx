import React from "react";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return <div className="center loader">{text}</div>;
}
