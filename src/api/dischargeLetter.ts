import { openmrsObservableFetch } from "@openmrs/esm-framework";

export function downloadDischargeLetter(patientUuid, visitUuid) {
  const abortController = new AbortController();
  const url = `/ws/module/report/release-letter/download?patientUuid=${patientUuid}&visitUuid=${visitUuid}`;
  return openmrsObservableFetch(url, {
    signal: abortController.signal,
    method: "GET",
    headers: {
      "Content-type": "application/pdf",
      Accept: "*/*",
    },
  });
}

export function signDischargeLetter(login, password, patientUuid, visitUuid) {
  const abortController = new AbortController();
  const url = "/ws/module/report/release-letter/sign";
  return openmrsObservableFetch(url, {
    signal: abortController.signal,
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-type": "application/json",
    },
    body: { login, password, patientUuid, visitUuid },
  });
}

export function getDischargeLetterStatus(patientUuid, visitUuid) {
  const abortController = new AbortController();
  const url = `/ws/module/report/release-letter/status?patientUuid=${patientUuid}&visitUuid=${visitUuid}`;
  return openmrsObservableFetch(url, {
    signal: abortController.signal,
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });
}
