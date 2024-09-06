import calculateCurrentValue from "./calculateCurrentValue.js";

const calculatePatrimoineValue = (possessions, getPatrimoineDate) => {
    let patrimoineValue = 0
    possessions.forEach(possession => {
      switch (possession.type) {
        case "TrainDeVie":
          patrimoineValue -= calculateCurrentValue(possession, getPatrimoineDate);
          break;
      
        default:
          patrimoineValue += calculateCurrentValue(possession, getPatrimoineDate);
          break;
      }
    });
    return patrimoineValue.toFixed(2);
  }
  
  export default calculatePatrimoineValue;