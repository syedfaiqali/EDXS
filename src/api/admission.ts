/**
 * Admission data, read from the EDXS gateway.
 *
 * These mirror the DTOs on FrontOffice.Service's `PublicAdmissionController`.
 * An enquiry submitted here lands in the same table the back-office Admission
 * Enquiry screen reads, so it joins the school's normal admission pipeline.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001').replace(/\/$/, '');

export interface AdmissionCampus {
    id: number;
    name: string;
}

/** An admission register, carrying the academic year it belongs to. */
export interface AdmissionRegister {
    id: number;
    name: string;
    academicYear: string;
    isActive: boolean;
}

export interface AdmissionClass {
    id: number;
    name: string;
}

/** The registers and classes available at one campus. */
export interface AdmissionOptions {
    registers: AdmissionRegister[];
    classes: AdmissionClass[];
}

export interface AdmissionSchool {
    /** The code the enquiry and status endpoints are addressed by. */
    code: string;
    name: string;
    city: string;
    campuses: AdmissionCampus[];
    /** False when the school has no campus configured and cannot take an enquiry. */
    acceptsEnquiries: boolean;
}

export interface AdmissionEnquiryRequest {
    fullName: string;
    email: string;
    phone?: string;
    studentName?: string;
    programOfInterest?: string;
    gradeLevel?: string;
    campusId?: number;
    registerId?: number;
    /** The class applied for. Required by the server. */
    classId: number;
    message?: string;
}

export interface AdmissionEnquiryResult {
    /** The enquiry number, which is also the token for the status lookup. */
    token: string;
    emailSent: boolean;
    message: string;
}

export interface AdmissionStatusStep {
    title: string;
    description: string;
    /** done | current | upcoming */
    state: string;
}

export interface AdmissionStatus {
    token: string;
    kind: string;
    applicantName: string;
    studentName: string;
    submittedOn: string | null;
    currentStatus: string;
    steps: AdmissionStatusStep[];
}

/** Reads an error message the API returned, falling back to a readable default. */
const readError = async (response: Response, fallback: string): Promise<string> => {
    try {
        const body = await response.json();
        if (body && typeof body.error === 'string' && body.error.trim()) {
            return body.error;
        }
    } catch {
        // A non-JSON body is not worth surfacing; the fallback reads better.
    }
    return fallback;
};

/** The schools currently listed in the public admissions directory. */
export const fetchAdmissionSchools = async (signal?: AbortSignal): Promise<AdmissionSchool[]> => {
    const response = await fetch(`${API_BASE_URL}/api/public/admission/schools`, {
        signal,
        headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Schools request failed (${response.status})`);
    }

    const data = (await response.json()) as AdmissionSchool[] | null;
    return Array.isArray(data) ? data : [];
};

/** The registers and classes offered at one campus. */
export const fetchAdmissionOptions = async (
    code: string,
    campusId: number,
    signal?: AbortSignal
): Promise<AdmissionOptions> => {
    const response = await fetch(
        `${API_BASE_URL}/api/public/admission/${encodeURIComponent(code)}/campuses/${campusId}/options`,
        { signal, headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
        throw new Error(`Options request failed (${response.status})`);
    }

    const data = (await response.json()) as Partial<AdmissionOptions> | null;
    return { registers: data?.registers ?? [], classes: data?.classes ?? [] };
};

/** Raises an admission enquiry against one school. */
export const submitAdmissionEnquiry = async (
    code: string,
    request: AdmissionEnquiryRequest,
    signal?: AbortSignal
): Promise<AdmissionEnquiryResult> => {
    const response = await fetch(
        `${API_BASE_URL}/api/public/admission/${encodeURIComponent(code)}/enquiries`,
        {
            method: 'POST',
            signal,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error(
            await readError(response, 'We could not record your enquiry just now. Please try again.')
        );
    }

    return (await response.json()) as AdmissionEnquiryResult;
};

/**
 * Looks up an enquiry by its reference. Returns null when the reference is not
 * recognised, which is the common case of a mistyped token rather than a fault.
 */
export const fetchAdmissionStatus = async (
    code: string,
    token: string,
    signal?: AbortSignal
): Promise<AdmissionStatus | null> => {
    const response = await fetch(
        `${API_BASE_URL}/api/public/admission/${encodeURIComponent(code)}/status/${encodeURIComponent(token)}`,
        { signal, headers: { Accept: 'application/json' } }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(await readError(response, 'We could not check that reference just now.'));
    }

    return (await response.json()) as AdmissionStatus;
};
