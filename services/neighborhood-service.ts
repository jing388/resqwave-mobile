import { NeighborhoodData } from "@/types/neighborhood";

/**
 * Fetch neighborhood data from the backend
 * TODO: Replace mock data with actual API call
 */
export const fetchNeighborhoodData = async (): Promise<NeighborhoodData> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/neighborhoods/${neighborhoodId}`);
    // const data = await response.json();
    // return data;

    // Mock data - replace with actual API response
    const mockData: NeighborhoodData = {
      id: "N-16",
      name: "N-16",
      registeredAt: "August 10, 2023",
      lastUpdatedAt: "September 25, 2023",
      terminalID: "RSQW-001",
      terminalAddress: "Barangay 175 Subdivision, Camarin, Caloocan City North",
      coordinates: {
        latitude: 14.765,
        longitude: 121.0392,
      },
      approxHouseholds: 15800,
      approxResidents: 71726,
      avgHouseholdSize: 4.5,
      floodwaterSubsidence: "2-4 hours",
      floodRelatedHazards: [
        "Strong Water Current (Malakas na agos ng tubig)",
        "Drainage overflow or canal blockage (Pag-apaw ng drainage o bara sa kanal)",
        "Electrical wires or exposed cables (Mga kable o wire na nakalantad)",
      ],
      notableInfo: ["Contains multiple residential subdivisions"],
      focalPerson: {
        name: "Juan Dela Cruz",
        contactNo: "+63 912 345 6789",
        email: "juan.delacruz@resqwave.ph",
      },
      alternativeFocalPerson: {
        name: "Maria Santos",
        contactNo: "+63 923 456 7890",
        email: "maria.santos@resqwave.ph",
      },
    };

    return mockData;
  } catch (error) {
    console.error("Error fetching neighborhood data:", error);
    throw error;
  }
};

export interface UpdateNeighborhoodDataParams {
  neighborhoodId: string;
  approxHouseholds: number;
  approxResidents: number;
  avgHouseholdSize: number;
  floodwaterSubsidence: string;
  floodRelatedHazards: string[];
  notableInfo: string[];
}

/**
 * Update neighborhood data on the backend
 * TODO: Replace mock implementation with actual API call
 */
export const updateNeighborhoodData = async (
  params: UpdateNeighborhoodDataParams
): Promise<void> => {
  try {
    console.log("Submitting edited data:", params);

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/neighborhoods/${params.neighborhoodId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`
    //   },
    //   body: JSON.stringify(params)
    // });
    //
    // if (!response.ok) {
    //   throw new Error('Failed to update neighborhood data');
    // }
    //
    // const result = await response.json();
    // return result;

    // Mock success - remove when implementing actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error updating neighborhood data:", error);
    throw error;
  }
};
