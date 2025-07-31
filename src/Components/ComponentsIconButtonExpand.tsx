// ComponentsIconButtonExpand.tsx
import React from "react";
import { IconButton, Icon } from "@midasit-dev/moaui";

interface ExpandButtonProps {
  onClick: () => void;
}

const ComponentsIconButtonExpand: React.FC<ExpandButtonProps> = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} color="normal" >
      <Icon iconName="Fullscreen" />
    </IconButton>
  );
};

export default ComponentsIconButtonExpand;
