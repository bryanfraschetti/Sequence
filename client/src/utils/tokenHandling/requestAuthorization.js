import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const requestAuthorization = async () => {
  try {
    // Initiate authorization flow
    const response = await fetch("/api/initiateAuthAuth", {
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
