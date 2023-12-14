export const requestAuthorization = async () => {
  const entry_point = "/";
  try {
    const response = await fetch("/initiateAuth", {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = data.next;
    } else {
      throw new Error("Response not OK");
    }
  } catch (error) {
    window.location.href = entry_point;
  }
};
