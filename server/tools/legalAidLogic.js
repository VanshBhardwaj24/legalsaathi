/**
 * NALSA (National Legal Services Authority) Eligibility Framework
 * Criteria for free legal aid in India.
 */

export const NALSA_CRITERIA = {
    CATEGORIES: [
        'SC (Scheduled Castes)',
        'ST (Scheduled Tribes)',
        'Victim of Trafficking or Begar',
        'Woman',
        'Child',
        'Person with Disability',
        'Victim of Mass Disaster / Ethnic Violence / Caste Atrocity',
        'Industrial Workman',
        'Person in Custody / Juvenile Home',
        'General (Based on Income Slab)'
    ],
    // Income thresholds vary by state, but these are general slabs
    INCOME_SLABS: {
        'below_1l': 'Below ₹1,00,000 (Universal Eligibility)',
        '1l_3l': '₹1,00,000 - ₹3,00,000 (State Dependent)',
        'above_3l': 'Above ₹3,00,000 (Self-Paid)'
    }
};

export const checkEligibility = (data) => {
    const { category, income, state } = data;

    // Automated Eligibility Logic
    const isCategoryEligible = NALSA_CRITERIA.CATEGORIES.includes(category) && category !== 'General (Based on Income Slab)';
    const isIncomeEligible = income === 'below_1l';
    
    // Some states have higher thresholds for general category
    const isStateExtendedEligible = (income === '1l_3l') && ['Delhi', 'Maharashtra', 'Gujarat'].includes(state);

    if (isCategoryEligible || isIncomeEligible || isStateExtendedEligible) {
        return {
            eligible: true,
            reason: isCategoryEligible 
                ? `Eligible under NALSA Section 12 for category: ${category}` 
                : `Eligible based on Income criteria for the state of ${state}.`
        };
    }

    return {
        eligible: false,
        reason: "Does not meet standard free legal aid requirements. Suggesting pro-bono consultation."
    };
};
