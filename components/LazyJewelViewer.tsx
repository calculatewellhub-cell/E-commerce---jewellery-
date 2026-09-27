"use client";

import dynamic from "next/dynamic";

const JewelViewer = dynamic(() => import("./JewelViewer"), {
  ssr: false,
  loading: () => <div className="viewer-loading" aria-hidden><span /></div>,
});

export default JewelViewer;
