import React, { useCallback } from "react";
import { Button } from "@carbon/react";
import { Visit, showModal } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { Printer } from "@carbon/react/icons";

interface VisitDetailOverviewPrintButtonProps {
  patientUuid: string;
  visit: Visit;
}

function VisitDetailOverviewPrintButton({
  patientUuid,
  visit,
}: VisitDetailOverviewPrintButtonProps) {
  const { t } = useTranslation();

  const openPrintDischargeReportModal = useCallback(
    (visit: Visit) => {
      const dispose = showModal("print-discharge-report-dialog", {
        patientUuid,
        visit,
        closeModal: () => dispose(),
      });
    },
    [patientUuid]
  );

  return (
    <Button
      kind="ghost"
      renderIcon={(props) => <Printer size={16} {...props} />}
      iconDescription="Print discharge report"
      onClick={() => openPrintDischargeReportModal(visit)}
    >
      {t("printDischargeReport", "Print Discharge Report")}
    </Button>
  );
}

export default VisitDetailOverviewPrintButton;
