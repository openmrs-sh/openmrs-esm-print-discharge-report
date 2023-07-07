import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  admissionIdVisitAttributeUuid: {
    _type: Type.UUID,
    _description: "The UUID of the Admission Id Visit Attribute",
    _default: "2a595e53-f83c-4ab5-9f95-60237fe337d6",
  },
};

export interface PrintDishargeReportConfig {
  admissionIdVisitAttributeUuid: string;
}
