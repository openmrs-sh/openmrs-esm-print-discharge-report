export enum DocumentStatus {
  SIGNED = "SIGNED",
  NO_SIGNED = "NO_SIGNED",
  SIGNED_REPORT_IN_PROGRESS = "SIGNED_REPORT_IN_PROGRESS",
  SIGNED_REPORT_FAILED = "SIGNED_REPORT_FAILED",
}

export function getDocumentStatusEnumFromString(dataString) {
  switch (dataString) {
    case "SIGNED":
      return DocumentStatus.SIGNED;
    case "NO_SIGNED":
      return DocumentStatus.NO_SIGNED;
    case "SIGNED_REPORT_IN_PROGRESS":
      return DocumentStatus.SIGNED_REPORT_IN_PROGRESS;
    case "SIGNED_REPORT_FAILED":
      return DocumentStatus.SIGNED_REPORT_FAILED;
    default:
      return DocumentStatus.SIGNED_REPORT_FAILED;
  }
}
