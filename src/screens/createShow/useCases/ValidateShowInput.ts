export interface ShowInputErrorMessages {
    description: string;
    days: string;
}

export const validateShowInputUseCase = (
    description: string,
    days: string
): ShowInputErrorMessages => {
    const errors: ShowInputErrorMessages = { description: '', days: '' };
    if (!description.trim()) {
        errors.description = 'Please enter a description';
    }
    const daysNum = Number(days);
    if (!days) {
        errors.days = 'Please enter the submission window in days';
    } else if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
        errors.days = 'Please enter a valid whole number';
    } else if (daysNum < 1) {
        errors.days = 'At least 1 day is required';
    } else if (daysNum > 30) {
        errors.days = 'Maximum 30 days allowed';
    }

    return errors;
};

