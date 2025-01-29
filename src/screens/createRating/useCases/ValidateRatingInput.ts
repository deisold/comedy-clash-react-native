export interface RatingInputErrorMessages {
    name: string;
    comment: string;
    value: string;
}

export const validateRatingInputUseCase = (
    name: string,
    comment: string,
    value: string,
): RatingInputErrorMessages => {
    const errors: RatingInputErrorMessages = { name: '', comment: '', value: '' };
    if (!name) errors.name = 'Please enter your name';
    if (!comment) errors.comment = 'Please enter a comment';
    if (!value) errors.value = 'Please enter a value';
    else if (Number(value) < 1) errors.value = 'At least 1 points';
    else if (Number(value) > 5) errors.value = 'Not more than 5 points';

    return errors;
};

