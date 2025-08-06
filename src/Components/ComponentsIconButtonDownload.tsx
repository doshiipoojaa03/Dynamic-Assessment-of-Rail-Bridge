// ComponentsIconButtonDownload.tsx
import React from "react";
import { IconButton, Icon } from "@midasit-dev/moaui";

interface DownloadButtonProps {
  onClick: () => void;
}

const ComponentsIconButtonDownload: React.FC<DownloadButtonProps> = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} color="normal">
      <Icon iconName="Download" />
    </IconButton>
  );
};

export default ComponentsIconButtonDownload;
