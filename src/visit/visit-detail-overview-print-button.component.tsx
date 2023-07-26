import React, { useCallback, useEffect } from "react";
import { Button } from "@carbon/react";
import { Visit, showModal, useConfig } from "@openmrs/esm-framework";
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
      iconDescription="Print release letter"
      onClick={() => openPrintDischargeReportModal(visit)}
    >
      {t("printDischargeReport", "Print Release Letter")}
    </Button>
  );
}

export default VisitDetailOverviewPrintButton;
