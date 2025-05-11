import React from "react";
import useShareStore from "../../../store/useShareStore";

const MultipleMenu = React.forwardRef<
  HTMLDivElement,
  {
    style?: React.CSSProperties;
  }
>(({ style}, ref) => {
  const multipleMenuPosition = useShareStore(
    (state) => state.multipleMenuPosition
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: multipleMenuPosition.x,
        top: multipleMenuPosition.y,
        zIndex: 1000,
        ...style,
      }}
      onMouseMove={handleMouseMove}
    >
    </div>
  );
});

export default MultipleMenu;
