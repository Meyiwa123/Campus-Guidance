interface Program {
  program_name: string;
}
interface Institution {
  institution_name: string;
}
interface ProgramType {
  program_type: string;
}
interface AcademicLevel {
  academic_level: string;
}

// Unique Institutions
export const institutions: string[] = [];
// fetchInstitutions function
export const fetchInstitutions = async (): Promise<void> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/all-institutions"
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const data: Institution[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected an array in the JSON response");
    }

    const institutionNames: string[] = data.map((institution) => institution.institution_name);

    institutions.splice(0, institutions.length, ...institutionNames);

  } catch (error: any) {
    console.error("Error fetching institutions:", error.message);
  }
};

// Unique Academic Levels
export const academicLevels: string[] = [];
// Function to fetch academic levels
export const fetchAcademicLevels = async (): Promise<void> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/all-academic-levels"
    ); // Update the endpoint as needed

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: AcademicLevel[] = await response.json();
    const levelNames: string[] = data.map((level) => level.academic_level);

    // Clear existing academic levels and add new level names
    academicLevels.splice(0, academicLevels.length, ...levelNames);

  } catch (error) {
    console.error("Error fetching academic levels:", (error as Error).message);
  }
};

// Unique Programs
export const programNames: string[] = [];
// Function to fetch program names
export const fetchPrograms = async (): Promise<void> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/program-names"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Program[] = await response.json();
    const programNamesList: string[] = data.map(
      (program) => program.program_name
    );

    // Clear existing programs and add new program names
    programNames.splice(0, programNames.length, ...programNamesList);

  } catch (error) {
    console.error("Error fetching programs:", (error as Error).message);
  }
};

// Unique Program Types
export const programTypes: string[] = [];
// Function to fetch program types
export const fetchProgramTypes = async (): Promise<void> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/all-program-types"
    ); // Update the endpoint as needed

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ProgramType[] = await response.json();
    const typeNames: string[] = data.map(
      (programType) => programType.program_type
    );

    // Clear existing program types and add new type names
    programTypes.splice(0, programTypes.length, ...typeNames);

  } catch (error) {
    console.error("Error fetching program types:", (error as Error).message);
  }
};

// Timeline
export const program_duration: { [key: string]: number } = {
  "1 year": 365 * 24,
  "2 years": 2 * 365 * 24,
  "3 years": 3 * 365 * 24,
  "4 years": 4 * 365 * 24,
  "> 4 years": 10 * 365 * 24,
};
