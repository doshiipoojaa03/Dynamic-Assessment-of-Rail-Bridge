import React from 'react';
import { Dialog, Typography, IconButton, Icon, ChartLine } from "@midasit-dev/moaui";

// ✅ Define prop types explicitly
interface GraphPopupDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chartData: any[]; // Replace `any[]` with exact type if known
}

const GraphPopupDialog: React.FC<GraphPopupDialogProps> = ({ isOpen, setIsOpen, chartData }) => {
  return (
    <Dialog open={isOpen} setOpen={setIsOpen}>
      <div
        style={{
          width: '1000px',
          backgroundColor: '#fff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
        }}
      >
        {/* Header with title and working close button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Typography variant="h1" color="primary">
            Speed vs Acceleration
          </Typography>

          {/* ✅ Supported IconButton syntax */}
          {/* <IconButton onClick={() => setIsOpen(false)}>
            <Icon iconName="Close" />
          </IconButton> */}
        </div>

        {/* Chart section */}
        <ChartLine
          data={chartData}
          axisTop
          axisTopTickValues={5}
          axisTopDecimals={1}
          axisTopLegend="Speed (km/h)"
          axisRight
          axisRightTickValues={5}
          axisRightDecimals={2}
          axisRightLegend="Acceleration (m/s²)"
          width={960}
          height={500}
          pointSize={0}
          marginTop={60}
          marginRight={70}
          marginLeft={60}
          marginBottom={60}
        />
      </div>
    </Dialog>
  );
};

export default GraphPopupDialog;
