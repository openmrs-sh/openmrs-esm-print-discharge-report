import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DefinitionTooltip, Tag } from "@carbon/react";
import { useConfig } from "@openmrs/esm-framework";
import { useVisitOrOfflineVisit } from "@openmrs/esm-patient-common-lib";
import styles from "./admission-id-tag.scss";
import { PrintDishargeReportConfig } from "../config-schema";

interface AdmissionIdTagProps {
  patientUuid: string;
  patient: fhir.Patient;
}

const AdmissionIdTag: React.FC<AdmissionIdTagProps> = ({ patientUuid }) => {
  const config = useConfig() as PrintDishargeReportConfig;
  const { t } = useTranslation();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);

  const admissionValue = useMemo(
    () =>
      currentVisit.attributes?.find(
        (x) => x.attributeType?.uuid == config.admissionIdVisitAttributeUuid
      )?.value,
    [config.admissionIdVisitAttributeUuid, currentVisit.attributes]
  );

  const admissionDisplay = useMemo(() => t("admissionId", "Admission ID"), [t]);

  return (
    currentVisit &&
    admissionValue && (
      <DefinitionTooltip
        className={styles.definitionToolTip}
        align="bottom-left"
        definition={
          <div role="tooltip" className={styles.tooltipPadding}>
            <h6
              className={styles.heading}
            >{`${admissionDisplay} ${admissionValue}`}</h6>
          </div>
        }
      >
        <span key={admissionDisplay} className={styles.admissionTag}>
          <Tag type="gray">{admissionDisplay}</Tag>
          <span className={styles.admissionValue}>{admissionValue}</span>
        </span>
      </DefinitionTooltip>
    )
  );
};

export default AdmissionIdTag;
