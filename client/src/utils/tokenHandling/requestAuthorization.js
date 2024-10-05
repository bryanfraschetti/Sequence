import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";
import { SequenceNamespace } from "../SequenceNamespace";

export const requestAuthorization = async () => {
  const sequenceUrl = SequenceNamespace.getVar("sequenceUrl");

  try {
    // Initiate authorization flow
    const response = await fetch(`${sequenceUrl}/api/initiateAuth`, {
      method: "GET",
    }); // Request initiateAuth endpoint from Sequence
    if (response.ok) {
      // Successful authorization -> Redirect to Sequencer page
      const data = await response.json();
      window.location.href = data.next;
    } else {
      throw new Error("Response not OK");
    }
  } catch (error) {
    ActivateErrorNotice(error);
  }
};
