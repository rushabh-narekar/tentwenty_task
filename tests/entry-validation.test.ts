import {
  getDefaultEntryValues,
  isEntryFormValid,
  validateEntryForm,
} from "@/lib/validation/entry";

describe("entry validation", () => {
  const validValues = {
    ...getDefaultEntryValues("2024-01-15"),
    project: "Project Name",
    description: "Homepage updates",
  };

  it("accepts valid entry values", () => {
    expect(validateEntryForm(validValues)).toEqual({});
    expect(isEntryFormValid(validValues)).toBe(true);
  });

  it("requires project, description, and type of work", () => {
    const errors = validateEntryForm({
      ...validValues,
      project: "",
      description: "",
      typeOfWork: "",
    });

    expect(errors.project).toBe("Project is required");
    expect(errors.description).toBe("Task description is required");
    expect(errors.typeOfWork).toBe("Type of work is required");
  });

  it("validates hours between 1 and 24", () => {
    expect(
      validateEntryForm({ ...validValues, totalHours: 0 }).totalHours,
    ).toBe("Hours must be between 1 and 24");
    expect(
      validateEntryForm({ ...validValues, totalHours: 25 }).totalHours,
    ).toBe("Hours must be between 1 and 24");
  });
});
