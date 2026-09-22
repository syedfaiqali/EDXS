/**
 * The trial form's field set, kept beside the component rather than in it so
 * the page can own the state while the component stays a pure renderer.
 */
export interface TrialFormData {
    clientName: string;
    description: string;
    contactPerson: string;
    contactNo: string;
    email: string;
    address: string;
    countryId: string;
    stateId: string;
    cityId: string;
    campusName: string;
    userName: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    mobile: string;
}

export const emptyTrialForm: TrialFormData = {
    clientName: '', description: '', contactPerson: '', contactNo: '', email: '',
    address: '', countryId: '', stateId: '', cityId: '', campusName: '',
    userName: '', password: '', confirmPassword: '', fullName: '', mobile: ''
};
