![](https://hubs.ly/Q03GR7NJ0)

# Dynamic Analysis of Rail Bridge

- The **dynamic analysis of rail bridges** requires precise evaluation of structural accelerations under varying train loads and operating speeds. This application automates the generation of multiple time-history load cases within the analytical model, significantly reducing manual effort in load definition, data extraction, and result interpretation. It improves efficiency and ensures accurate, consistent assessment of the bridge’s dynamic response.

## Details

## version 1.0.0

### Features

- **Train Speeds**:  
  Define the initial and final train speeds, along with the speed increment, to automatically generate multiple time-history load cases.

- **Time Step Increment**:  
  Specify the time step interval for each time-history load case.

- **Bridge Type for Damping**:  
  Select the bridge type or input user-defined damping values. Default damping is applied per EN1991-2:2003, Clause 6.4.6.3 (2).

- **Train Load File**:  
  Upload an Excel file containing the train load data (serial number, axle load, axle distances). The plugin validates and displays the data in a preview window.

- **Rail Track Nodes**:  
  Assign the structural group containing nodes along the rail track where dynamic loads will be applied.

- **Acceleration Output Nodes**:  
  Select the structural group containing nodes where vertical acceleration responses will be evaluated.

- **Speed vs. Acceleration Plot**:  
  View the absolute maximum acceleration plot across different speeds and export the results in Excel format for reporting.

### Limitations

- The combined length of two consecutive bridge elements (x) must exceed the minimum distance between any two axles (d) of the train.  
- All input data must be provided as indicated in the plugin dialog box.

### version 1.0.0

- Initial release
