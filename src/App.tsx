import React, { useState, useEffect, useRef } from "react";
import { Panel,Typography, TextField, Button, Grid, ChartLine } from "@midasit-dev/moaui"; 
import { DropList, IconButton, Icon } from '@midasit-dev/moaui';
import { midasAPI } from "./Function/Common";
import { runAnalysisWithInputsUI } from "./utils_pyscript";
import { mapi_key } from "./utils_pyscript";
import { useSnackbar, SnackbarProvider,  closeSnackbar } from "notistack";
import GraphPopupDialog from "./Components/GraphPopupDialog";
import ComponentsIconButtonExpand from "./Components/ComponentsIconButtonExpand";
import ComponentsIconButtonDownload from "./Components/ComponentsIconButtonDownload";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const WrappedApp = () => {
	// Rail Load API
  const [trainLoadFile, setTrainLoadFile] = useState<File | null>(null);
  const [trainLoadFilename, setTrainLoadFilename] = useState('');
  const [excelData, setExcelData] = useState<number[][] | null>(null);

  const XLSX = require('xlsx');
  const bridgeTypes = new Map([
    ["Steel and Composite", "Steel and Composite"],
    ["Prestressed Concrete", "Prestressed Concrete"],
    ["Filler Beam and Reinforced Concrete", "Filler Beam and Reinforced Concrete"],
    ["User defined", "User defined"]
  ]);
  
  const [initialSpeed, setInitialSpeed] = useState<string>('60');
  const [finalSpeed, setFinalSpeed] = useState<string>('200');
  const [speedIncrement, setSpeedIncrement] = useState<string>('5');
  const [timeStepIncrement, setTimeStepIncrement] = useState<string>('0.0001');
  
  const [bridgeType, setBridgeType] = useState<string>('Steel and Composite');
  const [damping, setDamping] = useState<string>('');
  const [isDampingEnabled, setIsDampingEnabled] = useState<boolean>(false);
  
  const [railTrackNode, setRailTrackNode] = useState<string>('');
  const [accelerationNode, setAccelerationNode] = useState<string>('');
  const [availableGroups, setAvailableGroups] = useState<Map<string, string>>(new Map());
  
  type ChartDatum = { x: number; y: number };
  type LineSeries = { id: string; color: string; data: ChartDatum[] };
  
  
  const [chartData, setChartData] = useState<LineSeries[]>([]);
  const [staticChartData, setStaticChartData] = useState<LineSeries[]>([]);
  const [isGraphPopupOpen, setIsGraphPopupOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { enqueueSnackbar } = useSnackbar();
  const handleBridgeTypeChange = (value: string) => {
    setBridgeType(value);
    setIsDampingEnabled(value === 'User defined');
    if (value !== 'User defined') {
      setDamping('');
    }
  };
  useEffect(() => {
  const start = parseFloat(initialSpeed);
  const end = parseFloat(finalSpeed);
  const step = parseFloat(speedIncrement);

  const staticSeries: LineSeries[] = [
    {
      id: "Speed vs Acceleration",
      color: "#f47560",
      data: [],
    },
  ];

  for (let x = start; x <= end; x += step) {
    staticSeries[0].data.push({ x, y: 0 });
  }

  setStaticChartData(staticSeries);
}, []);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) {
    enqueueSnackbar("No file selected. Please choose an Excel file.", {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      action: (key) => (
  <IconButton onClick={() => closeSnackbar(key)}>
    <Icon iconName="Close" />
  </IconButton>
)
    });
    return;
  }

  const validExtensions = [".xls", ".xlsx"];
  if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
    enqueueSnackbar("Invalid file type. Please upload a .xls or .xlsx file.", {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    return;
  }

  setTrainLoadFile(file);
  setTrainLoadFilename(file.name);

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: (number[])[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error("Empty sheet");
      }

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (
          !Array.isArray(row) ||
          row.length !== 3 ||
          row.some(cell => typeof cell !== 'number' || isNaN(cell))
        ) {
          enqueueSnackbar(`Row ${i + 1} must have exactly 3 numeric (non-empty) values.`, {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
          return;
        }
      }

      setExcelData(jsonData);

      enqueueSnackbar("Excel file loaded successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    } catch (err) {
      enqueueSnackbar("Error reading Excel file.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };

  reader.readAsArrayBuffer(file);
};

  // To fetch Group Names
  useEffect(() => {
  const fetchGroupNames = async () => {
    try {
      const response = await midasAPI("GET", "/db/GRUP");
      const grup = response.GRUP;

      if (grup) {
        // Create a Map<string, string> where both key and value are NAME
        const groupMap = new Map<string, string>(
          Object.values(grup).map((val: any) => [val.NAME, val.NAME])
        );

        setAvailableGroups(groupMap);

        // Set default selections
        const names = Array.from(groupMap.keys());
        if (names.length > 0) {
          setRailTrackNode(names[0]);         // "track"
          if (names.length > 1) {
            setAccelerationNode(names[1]);    // "girder"
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch GRUP:", error);
    }
  };

  fetchGroupNames();
}, []);


const handleRunAnalysis = async () => {
  const errors: string[] = [];
  const start = parseFloat(initialSpeed);
  const end = parseFloat(finalSpeed);

  const isPositiveFloat = (val: string) => !isNaN(Number(val)) && parseFloat(val) > 0;

  // Gather all validation errors
  if (!isPositiveFloat(initialSpeed)) {
    errors.push("Initial Speed must be a positive number.");
  }

  if (!isPositiveFloat(finalSpeed) || end <= start) {
    errors.push("Final Speed must be a positive number and greater than Initial Speed.");
  }

  if (!isPositiveFloat(speedIncrement)) {
    errors.push("Speed Increment must be a positive number.");
  }

  if (!isPositiveFloat(timeStepIncrement)) {
    errors.push("Time Step Increment must be a positive number.");
  }

  if (bridgeType === "User defined") {
    const dampingValue = parseFloat(damping);
    if (!isPositiveFloat(damping) || dampingValue >= 1) {
      errors.push("Damping Ratio must be a positive number less than 1.");
    }
  }

  if (!trainLoadFile) {
    errors.push("Please upload the train load Excel file.");
  }

  // ❌ If there are any errors, show them all and stop
  if (errors.length > 0) {
    errors.forEach(msg =>
      enqueueSnackbar(msg, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      })
    );
    return;
  }

  // ✅ Continue with analysis
  enqueueSnackbar("Running analysis. Please wait...", {
    variant: 'info',
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
  });

  const globalkey = mapi_key;

  try {
    const result = await runAnalysisWithInputsUI({
      initial: start,
      final: end,
      step: parseFloat(speedIncrement),
      time_step: parseFloat(timeStepIncrement),
      bridge_type: bridgeType,
      damping_input: damping,
      track_group: railTrackNode,
      girder_group: accelerationNode,
      file: trainLoadFile as File,
      globalkey,
    });

    if (result.status === "completed" && Array.isArray(result.points)) {
      const lineData: LineSeries[] = [
        {
          id: "Speed vs Acceleration",
          color: "red",
          data: result.points,
        },
      ];

      setChartData(lineData);

      enqueueSnackbar("Analysis completed successfully!", {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } else {
      enqueueSnackbar("Analysis failed or returned no points.", {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  } catch (err) {
    console.error("Analysis error:", err);
    enqueueSnackbar("Failed to run analysis. Check console for details.", {
      variant: 'error',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
  }
};

  const hiddenChartRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (hiddenChartRef.current) {
      const canvas = await html2canvas(hiddenChartRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = "speed_vs_acceleration.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  function handleReset() {
    setInitialSpeed('60');
    setFinalSpeed('200');
    setSpeedIncrement('5');
    setTimeStepIncrement('0.0001');
    setBridgeType('Steel and Composite');
    setDamping('');
    setIsDampingEnabled(false);
    setTrainLoadFile(null);
    setTrainLoadFilename('');
    setRailTrackNode('');
    setAccelerationNode('');
    setExcelData(null); // Hide the Excel panel on refresh
    setChartData([]);
  }  
		if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
  
return (
        <div
    style={{
      maxWidth: '1400px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
    }}
  >
    {/* <Panel width="1040px" height="690px">   */}
          <Panel
            width="fit-content"
            height="auto"
            marginTop={3}
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '0 auto',
              padding: '20px',
            }}
          >
      {/* Panel Header */}
      <Panel width="100%" height="50px" variant="box">
        <Typography variant="h1" color="primary" center size="large">
          Dynamic Analysis of Rail Bridge
        </Typography>
      </Panel>

      {/* Body Content */}
      <div
      style={{
        display: 'flex',
        flexWrap: 'wrap', 
        flexDirection: 'row',
        gap: '20px',
        padding: '10px',
      }}
    >
        {/* Left Column - Form */}
        <Panel width="480px" height="445px">
          <Panel width="460px" height="130px" variant="strock" marginTop={0}>
            <Grid container direction="row">
              <Grid item xs={4}>
                <Typography marginTop={0} variant="body2">Initial Speed (kmph)</Typography>
                <div style={{ marginTop: '10px' }}>
                  <TextField width="190px" value={initialSpeed} onChange={(e) => setInitialSpeed(e.target.value)} />
                </div>
              </Grid>
              <Grid item xs={4} marginLeft={10}>
                <Typography marginTop={0} variant="body2">Final Speed (kmph)</Typography>
                <div style={{ marginTop: '10px' }}>
                  <TextField width="190px" value={finalSpeed} onChange={(e) => setFinalSpeed(e.target.value)} />
                </div>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={4}>
                <Typography marginTop={1} variant="body2">Speed Increment (kmph)</Typography>
                <div style={{ marginTop: '10px' }}>
                  <TextField width="190px" value={speedIncrement} onChange={(e) => setSpeedIncrement(e.target.value)} />
                </div>
              </Grid>
              <Grid item xs={4} marginLeft={10}>
                <Typography marginTop={1} variant="body2">Time Step Increment (sec)</Typography>
                <div style={{ marginTop: '10px' }}>
                  <TextField width="190px" value={timeStepIncrement} onChange={(e) => setTimeStepIncrement(e.target.value)} />
                </div>
              </Grid>
            </Grid>
          </Panel>

          <Panel width="460px" height="70px" variant="strock" marginTop={1}>
            <Grid container direction="row">
              <Grid item xs={4}>
                <Typography marginTop={0} variant="body2">Bridge Type for Damping</Typography>
                <div style={{ marginTop: '10px' }}>
                  <DropList
                    itemList={bridgeTypes}
                    width="190px"
                    value={bridgeType}
                    onChange={(e) => handleBridgeTypeChange(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid item xs={4} marginLeft={10}>
                <Typography marginTop={0} variant="body2">Damping Ratio</Typography>
                <div style={{ marginTop: '10px' }}>
                {bridgeType === "User defined" ? (
                  <TextField
                    width="190px"
                    value={damping}
                    onChange={(e) => setDamping(e.target.value)}
                    placeholder="Enter value < 1"
                  />
                ) : (
                  <TextField
                    width="190px"
                    value={damping}
                    onChange={() => {}}
                    disabled
                    placeholder="Disabled"
                  />
                )}
              </div>
              </Grid>
            </Grid>
          </Panel>

          <Panel width="460px" height="150px" variant="strock" marginTop={1}>
            <Typography marginTop={0} variant="body2">Train Load File (.xlsx)</Typography>
            <div style={{ marginTop: '15px' }}>
              <TextField width="127px" value={trainLoadFilename} disabled />
              <Button color="normal" width="20px" onClick={() => fileInputRef.current?.click()}>
                Browse
              </Button>
              <input
                type="file"
                style={{ display: 'none' }}
                accept=".csv,.xlsx"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>
            <Grid container direction="row">
              <Grid item xs={4}>
                <Typography marginTop={2} variant="body2">Rail Track Nodes</Typography>
                <div style={{ marginTop: '16px' }}>
                  <DropList
                    itemList={availableGroups}
                    width="190px"
                    value={railTrackNode}
                    onChange={(e) => setRailTrackNode(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid item xs={4} marginLeft={10}>
                <Typography marginTop={1} variant="body2">Acceleration Output Nodes</Typography>
                <div style={{ marginTop: '10px' }}>
                  <DropList
                    itemList={availableGroups}
                    width="190px"
                    value={accelerationNode}
                    onChange={(e) => setAccelerationNode(e.target.value)}
                  />
                </div>
              </Grid>
            </Grid>
          </Panel>

          <Panel flexItem justifyContent="center" width="450px" height="80px" variant="box" marginTop={1} >
            <Button color="normal" width="auto"  onClick={handleRunAnalysis}>
              Run Analysis
            </Button>
            <div style={{ marginLeft:"10px" }}>
            <Button color="normal" width="auto" onClick={handleReset}>
              Refresh
            </Button>
            </div>
          </Panel>
        </Panel>

        {/* Right Column - Always Rendered Panel */}
<Grid container direction="column" spacing={1} style={{ width: 'auto', maxWidth: '100%' }}>
  <Grid item>
  <Panel width="480px" height="190px" variant="strock" style={{ overflowX: 'auto' }}>
    <Typography variant="h1" color="primary" marginBottom={1}>
      Train Load
    </Typography>
    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {excelData && (
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '5px', backgroundColor: '#f0f0f0' }}>
                Sr no.
              </th>
              <th style={{ border: '1px solid #ccc', padding: '5px', backgroundColor: '#f0f0f0' }}>
                Axel Spacing (m)
              </th>
              <th style={{ border: '1px solid #ccc', padding: '5px', backgroundColor: '#f0f0f0' }}>
                Axel Load (kN)
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {excelData ? (
            excelData.map((row, rowIndex) => {
              const rowData = row.slice(0, 3);
              const rowInvalid = rowData.some(cell => cell === null || cell === undefined || Number.isNaN(cell));
              return (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: rowInvalid ? '#ffe5e5' : 'inherit',
                    color: rowInvalid ? '#d8000c' : 'inherit',
                  }}
                >
                  {rowData.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: '1px solid #ccc',
                        padding: '5px',
                      }}
                    >
                      {cell !== null && cell !== undefined && !Number.isNaN(cell) ? cell : 'N/A'}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} style={{ padding: '5px', color: '#999' }}>
                No train load data uploaded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Panel>
</Grid>

  {/* Output Chart Panel */}
  <Grid item>
    <Panel width="480px" height="248px" variant="strock" style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" color="primary">Speed vs Acceleration</Typography>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ComponentsIconButtonDownload onClick={handleDownload} />
          <ComponentsIconButtonExpand onClick={() => setIsGraphPopupOpen(true)} />
        </div>
      </div>
      <div style={{ width: '100%', height: '220px', position: 'relative' }}>
        <ChartLine
          data={chartData.length > 0 ? chartData : staticChartData}
          axisBottom
          axisBottomTickValues={5}
          axisBottomDecimals={1}
          axisBottomLegend="Speed (km/h)"
          axisLeft
          axisLeftTickValues={5}
          axisLeftDecimals={2}
          axisLeftLegend="Acceleration (m/s²)"
          width="100%"
          height="100%"
          pointSize={0}
          marginTop={20}
          marginRight={70}
          marginLeft={60}
          marginBottom={60}
        />

      </div>
    </Panel>
  </Grid>
  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={hiddenChartRef}>
          <ChartLine
            data={chartData.length > 0 ? chartData : staticChartData}
            axisBottom
            axisBottomTickValues={5}
            axisBottomDecimals={1}
            axisBottomLegend="Speed (km/h)"
            axisLeft
            axisLeftTickValues={5}
            axisLeftDecimals={2}
            axisLeftLegend="Acceleration (m/s²)"
            width={950}
            height={500}
            pointSize={0}
            marginTop={20}
            marginRight={70}
            marginLeft={60}
            marginBottom={60}
          />
        </div>
      </div>
<GraphPopupDialog
  isOpen={isGraphPopupOpen}
  setIsOpen={setIsGraphPopupOpen}
  chartData={chartData.length > 0 ? chartData : staticChartData}
/>



</Grid>

      </div>
          </Panel>
    {/* </Panel> */}
  </div>
);
};



const App = () =>(
<SnackbarProvider
  maxSnack={5}
  autoHideDuration={null}
  hideIconVariant
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
   action={(snackbarId) => (
        <button
          onClick={() => closeSnackbar(snackbarId)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            marginLeft: '12px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
>
  <WrappedApp />
</SnackbarProvider>
);
export default App;
