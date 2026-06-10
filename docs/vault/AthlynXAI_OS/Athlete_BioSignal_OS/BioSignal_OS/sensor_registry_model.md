# Athlete BioSignal OS Sensor Registry Model

| Domain | Signals | First Providers | Lifecycle Fields |
|---|---|---|---|
| Glucose | value, trend, freshness, alarms | Libre, Dexcom, Medtronic, Eversense | sensorStart, sensorEnd, warmup, daysRemaining, status |
| Heart | HR, HRV, ECG, load | Apple, Garmin, WHOOP, Oura, Fitbit, Polar, AliveCor | deviceBattery, lastSync, permissionStatus |
| Oxygen | SpO2, respiratory rate | Apple, Garmin, WHOOP, Oura, Masimo, Nonin | lastSync, freshness, deviceStatus |
| Blood Flow | BP, perfusion, SmO2, PTT | cuffless BP, Moxy, PortaMon | calibrationDue, lastSync, sensorPlacement |
| Brain | EEG, impact, cognitive readiness | Muse, NeuroSky, instrumented mouthguards/helmets | baselineDate, lastAssessment, reviewRequired |
| Hydration/Heat | sweat, sodium, core temp, heat strain | Nix, CORE, Epicore, Kenzen | patchStart, patchEnd, temperatureRisk, hydrationStatus |
| Sleep/Recovery | readiness, strain, HRV, sleep stages | WHOOP, Oura, Garmin, Fitbit, Apple Health | nightlyWindow, lastSync, subscriptionStatus |
