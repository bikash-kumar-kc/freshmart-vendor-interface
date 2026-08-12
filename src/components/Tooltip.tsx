import React, { useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });

    setVisible(true);
  };

  return (
    <>
      <div
        className="inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div
          className="
            pointer-events-none
            fixed
            z-9999
            -translate-x-1/2
            -translate-y-full
            rounded-md
            bg-slate-900
            px-3
            py-1.5
            text-xs
            font-medium
            text-white
            shadow-lg
          "
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {content}

          {/* Arrow */}
          <div
            className="
              absolute
              left-1/2
              top-full
              -translate-x-1/2
              border-x-4
              border-t-4
              border-x-transparent
              border-t-slate-900
            "
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;
