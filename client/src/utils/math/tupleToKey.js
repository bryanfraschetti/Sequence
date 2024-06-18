export const tupleToKey = (key, mode) => {
  let keyNotation = null;
  switch (mode) {
    case 0: // Define minor keys
      switch (key) {
        case 0:
          keyNotation = "C";
          break;
        case 1:
          keyNotation = "C#";
          break;
        case 2:
          keyNotation = "D";
          break;
        case 3:
          keyNotation = "E♭";
          break;
        case 4:
          keyNotation = "E";
          break;
        case 5:
          keyNotation = "F";
          break;
        case 6:
          keyNotation = "F#";
          break;
        case 7:
          keyNotation = "G";
          break;
        case 8:
          keyNotation = "G#";
          break;
        case 9:
          keyNotation = "A";
          break;
        case 10:
          keyNotation = "B♭";
          break;
        case 11:
          keyNotation = "B";
          break;
        default:
          keyNotation = "C";
          break;
      }
      break;
    case 1: // Define major keys
      switch (key) {
        case 0:
          keyNotation = "C";
          break;
        case 1:
          keyNotation = "D♭";
          break;
        case 2:
          keyNotation = "D";
          break;
        case 3:
          keyNotation = "E♭";
          break;
        case 4:
          keyNotation = "E";
          break;
        case 5:
          keyNotation = "F";
          break;
        case 6:
          keyNotation = "G♭";
          break;
        case 7:
          keyNotation = "G";
          break;
        case 8:
          keyNotation = "A♭";
          break;
        case 9:
          keyNotation = "A";
          break;
        case 10:
          keyNotation = "B♭";
          break;
        case 11:
          keyNotation = "B";
          break;
        default:
          keyNotation = "C";
          break;
      }
      break;
    default:
      mode = 0;
      break;
  }

  const modes = ["maj", "min"];

  return `${keyNotation} ${modes[mode]}`;
};
