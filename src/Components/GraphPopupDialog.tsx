import React from 'react';
import {
  Dialog,
  Typography,
  ChartLine,
} from "@midasit-dev/moaui";
// import html2canvas from 'html2canvas';

type ChartDatum = { x: number; y: number };
type LineSeries = { id: string; color: string; data: ChartDatum[] };

interface GraphPopupDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chartData: LineSeries[];
}

const GraphPopupDialog: React.FC<GraphPopupDialogProps> = ({
  isOpen,
  setIsOpen,
  chartData,
}) => {
  const combinedData: LineSeries[] = [...chartData];

  // const handleDownload = async () => {
  //   const chartElement = document.querySelector('.chart-line') as HTMLElement;
  //   if (chartElement) {
  //     const canvas = await html2canvas(chartElement, { scale: 2 });
  //     const link = document.createElement('a');
  //     link.download = 'speed_vs_acceleration.png';
  //     link.href = canvas.toDataURL('image/png');
  //     link.click();
  //   }
  // };

  return (
    <Dialog open={isOpen} setOpen={setIsOpen}> 
      <div
        style={{
          width: '975px',
          height:'450px',
          backgroundColor: '#fff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
          alignItems:'center'
          // overflow:'hidden',
        
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            marginTop:'0px'
          }}
        >
          <Typography variant="h1" color="primary" size='medium'>
            Speed vs Acceleration
          </Typography>
          {/* <div>
            {/* <IconButton onClick={() => setIsOpen(false)}>
              <Icon iconName="Close" />
            </IconButton>
            <IconButton onClick={handleDownload}>
              <Icon iconName="Download" />
            </IconButton> */}
          {/* </div> */} 
        </div>

        {/* Combined Chart */}
        <ChartLine
          data={chartData}
          axisBottom
          axisBottomTickValues={5}
          axisBottomDecimals={1}
          axisBottomLegend="Speed (km/h)"
          axisLeft
          axisLeftTickValues={5}
          axisLeftDecimals={2}
          axisLeftLegend="Acceleration (m/s²)"
          width={950}
          height={450}
          pointSize={0}
          marginTop={20}
          marginRight={30}
          marginLeft={50}
          marginBottom={60}
        />
      </div>
    </Dialog>
  );
};

export default GraphPopupDialog;